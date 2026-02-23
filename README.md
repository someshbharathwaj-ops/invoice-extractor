📄 README.md
# 🧾 Invoice Extractor (RAG + LangChain + Streamlit)

A Streamlit-based Invoice Data Extraction system built using 
Retrieval-Augmented Generation (RAG), LangChain, FAISS, and HuggingFace models.

This project extracts structured invoice information from uploaded PDF invoices.

---

## 🚀 Project Overview

This application allows users to:

- Upload one or multiple invoice PDFs
- Process documents using a RAG pipeline
- Extract structured invoice fields
- Display results in a clean Streamlit interface

It combines:

- 🔎 PDF document loading
- ✂️ Recursive text splitting
- 🧠 Embedding generation
- 📦 FAISS vector storage
- 🤖 HuggingFace LLM generation
- 🎯 Prompt-controlled field extraction

---

## 🏗️ Architecture

User Upload → PDF Loader → Text Splitter → Embeddings → FAISS → Retriever  
→ Prompt Template → HuggingFace LLM → Structured Output

---

## 📌 Extracted Fields

The system attempts to extract:

- Invoice Number
- Invoice Date
- Vendor Name
- Subtotal
- Tax
- Total Amount
- Payment Terms

If a field is not found, the system returns:


Not found


---

## 🛠️ Tech Stack

- Python
- Streamlit
- LangChain
- FAISS
- HuggingFace Transformers
- Sentence Transformers (all-MiniLM-L6-v2)
- dotenv

---

## 📂 Project Structure


invoice-extractor/
│
├── invoice_extractor.py # Streamlit App
├── invoice_util.py # RAG + Extraction Pipeline
├── .gitignore
├── README.md


---

## ⚙️ Installation

### 1️⃣ Clone the repository


git clone https://github.com/someshbharathwaj-ops/invoice-extractor.git

cd invoice-extractor


### 2️⃣ Create virtual environment


python -m venv venv


Activate:

Windows:

venv\Scripts\activate


Mac/Linux:

source venv/bin/activate


### 3️⃣ Install dependencies


pip install -r requirements.txt


---

## ▶️ Run the Application


streamlit run invoice_extractor.py


---

## ⚠️ Current Limitations

- PDF parsing quality depends heavily on document structure.
- Regex patterns are invoice-format dependent.
- LLM output may vary.
- Not optimized for production usage.
- File saving is temporary and not cleaned automatically.

---

## 🎓 Academic Context

This project was developed as part of a Coursera learning exercise 
focused on Retrieval-Augmented Generation (RAG) systems.

The implementation is intentionally being improved incrementally to:
- Understand commit history
- Refactor architecture gradually
- Improve PDF parsing quality
- Enhance extraction reliability

---

## 🔮 Planned Improvements

- Improve PDF parsing robustness
- Replace regex fallback logic
- Add structured JSON output
- Add logging system
- Add Docker support
- Add deployment (Streamlit Cloud / Render)
- Replace distilgpt2 with stronger instruction model
- Improve chunking strategy

---

## 👨‍💻 Author

Somesh Bharathwaj  
GitHub: https://github.com/someshbharathwaj-ops

---

## 📜 License

This project is for educational purposes.
