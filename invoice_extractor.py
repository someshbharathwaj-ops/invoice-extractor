import streamlit as st
from dotenv import load_dotenv
import invoice_util as iu

# Load environment once (even if unused now)
load_dotenv()

def main():
    st.set_page_config(
        page_title="Invoice Extractor",
        layout="centered"
    )

    st.title(" Invoice Data Extractor (RAG + LangChain)")

    st.write(
        "Upload a PDF invoice and extract structured invoice data using a "
        "Retrieval-Augmented Generation (RAG) model."
    )

    uploaded_files = st.file_uploader(
        "Upload invoice PDF(s)",
        type=["pdf"],
        accept_multiple_files=True
    )

    if st.button("Extract Data"):
        if not uploaded_files:
            st.warning("Please upload at least one PDF file.")
            return

        for file in uploaded_files:
            with st.spinner(f"Extracting data from {file.name}..."):
                try:
                    result = iu.create_docs(file)

                    st.subheader(f"Extracted Data: {file.name}")

                    if result and result.strip():
                        st.text(result)
                    else:
                        st.text(
                            """Invoice Number: Not found
Invoice Date: Not found
Vendor Name: Not found
Subtotal: Not found
Tax: Not found
Total Amount: Not found
Payment Terms: Not found"""
                        )

                    st.success("Extraction successful ✅")

                except Exception as e:
                    st.error(f"Error processing {file.name}")
                    st.exception(e)


if __name__ == "__main__":
    main()
