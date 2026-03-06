from langchain_core.prompts import PromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline
import re


def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"([A-Z])\s+([A-Z])", r"\1\2", text)
    return text


def create_docs(uploaded_file):

    # Save uploaded file
    with open(uploaded_file.name, "wb") as f:
        f.write(uploaded_file.getbuffer())

    # Load PDF
    loader = PyPDFLoader(uploaded_file.name)
    documents = loader.load()

    # Extract text
    context_text = "\n\n".join([doc.page_content for doc in documents])
    context_text = clean_text(context_text)

    # Regex fallback
    def extract_invoice_fields(text):

        def find(pattern):
            m = re.search(pattern, text, re.IGNORECASE)
            return m.group(1).strip() if m else "Not found"

        return f"""
Invoice Number: {find(r"Invoice\s*(?:No|Number|#|ID)[:\s]*([A-Z0-9\-]+)")}
Invoice Date: {find(r"Invoice\s*Date[:\s]*([A-Za-z]+\s+\d{1,2},\s+\d{4})")}
Vendor Name: {find(r"Billed\s*By[:\s]*([\w\s]+)")}
Subtotal: {find(r"Subtotal[:\s]*₹?\s*([\d,]+\.\d{2})")}
Tax: {find(r"(?:IGST|GST|Tax)[:\s]*₹?\s*([\d,]+\.\d{2})")}
Total Amount: {find(r"Total[:\s]*₹?\s*([\d,]+\.\d{2})")}
Payment Terms: {find(r"(?:Due\s*Date|Payment\s*Due)[:\s]*([A-Za-z]+\s+\d{1,2},\s+\d{4})")}
""".strip()

    # LLM
    hf_pipeline = pipeline(
        "text2text-generation",
        model="google/flan-t5-base",
        max_new_tokens=256
    )

    llm = HuggingFacePipeline(pipeline=hf_pipeline)

    prompt = PromptTemplate.from_template(
"""
Extract the following invoice information.

Return ONLY this format:

Invoice Number:
Invoice Date:
Vendor Name:
Subtotal:
Tax:
Total Amount:
Payment Terms:

Invoice text:
{context}
"""
    )

    formatted_prompt = prompt.format(context=context_text)

    # Run LLM
    raw_result = llm.invoke(formatted_prompt)

    clean_result = raw_result.strip()

    # Fallback if LLM fails
    if not clean_result or "Invoice Number" not in clean_result:
        clean_result = extract_invoice_fields(context_text)

    return clean_result