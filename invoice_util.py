from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline
import re

def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"([A-Z])\s+([A-Z])", r"\1\2", text)
    return text


def create_docs(uploaded_file):
    with open(uploaded_file.name, "wb") as f:
        f.write(uploaded_file.getbuffer())

    loader = PyPDFLoader(uploaded_file.name)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1200,
        chunk_overlap = 300)
    chunks = splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(chunks, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 6})

    print("===== REGEX INPUT TEXT =====")
    context_text = "\n\n".join([doc.page_content for doc in chunks])
    print(context_text[:1500])
    print("===== END REGEX INPUT =====")
  

    def extract_invoice_fields(text):
       def find(pattern):
          m = re.search(pattern, text, re.IGNORECASE)
          return m.group(1).strip() if m else "Not found"

       return f"""
      Invoice Number: {find(r"Invoice No\s*([A-Z0-9]+)")}
     Invoice Date: {find(r"Invoice Date\s*([A-Za-z]+\s+\d{2},\s+\d{4})")}
     Vendor Name: {find(r"Billed By\s*([\w\s]+)")}
     Subtotal: {find(r"Amount\s*₹\s*([\d,]+\.\d{2})")}
     Tax: {find(r"IGST\s*₹\s*([\d,]+\.\d{2})")}
     Total Amount: {find(r"Total\s*\(INR\)\s*₹\s*([\d,]+\.\d{2})")}
     Payment Terms: {find(r"Due Date\s*([A-Za-z]+\s+\d{2},\s+\d{4})")}
     """.strip()


    


    hf_pipeline = pipeline(
        "text-generation",
        model="distilgpt2",
        max_new_tokens=256
    )

    llm = HuggingFacePipeline(pipeline=hf_pipeline)
       
    prompt = PromptTemplate.from_template(
"""
You are an invoice information extractor.

ONLY extract the fields listed below.
DO NOT add explanations.
DO NOT repeat text.
DO NOT invent fields.

Return ONLY the section between <START> and <END>.

<START>
Invoice Number:
Invoice Date:
Vendor Name:
Subtotal:
Tax:
Total Amount:
Payment Terms:
<END>

If a field is missing, write "Not found".

Invoice text:
{context}
"""
)
    def extract_clean_block(text):
       if "<START>" in text and "<END>" in text:
            return text.split("<START>")[1].split("<END>")[0].strip()
       return text.strip()



    
    def format_docs(docs):
         return "\n\n".join(clean_text(doc.page_content) for doc in docs)

    rag_pipeline = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    )


    raw_result = rag_pipeline.invoke("Extract invoice fields")
    clean_result = extract_clean_block(raw_result)
    if not clean_result or len(clean_result.strip()) < 5:
       clean_result = """Invoice Number: Not found
Invoice Date: Not found
Vendor Name: Not found
Subtotal: Not found
Tax: Not found
Total Amount: Not found
Payment Terms: Not found"""
    return clean_result
