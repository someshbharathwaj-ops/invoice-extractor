# 🧾 Invoice Extractor 

A Retrieval-Augmented Generation (RAG) based Invoice Data Extraction system built using **LangChain, FAISS, HuggingFace, and Streamlit**.

⚠️ **Project Status: Currently Under Refactor (Not Fully Working)**
This project is being actively upgraded to improve reliability, extraction accuracy, and architecture design.

---

## 🚀 Project Vision

The goal of this project is to build a robust invoice intelligence system that:

* Accepts invoice PDFs
* Processes them using a RAG pipeline
* Extracts structured financial fields
* Returns clean, machine-readable output

This is not just a PDF parser — it is an attempt to build a **mini document-understanding pipeline** using modern LLM architecture.

---

## 🏗️ Current Architecture

User Upload
→ PDF Loader
→ Recursive Text Splitter
→ Embedding Model (MiniLM)
→ FAISS Vector Store
→ Retriever
→ Prompt Template
→ HuggingFace LLM
→ Field Extraction Output

---

## 📌 Target Extraction Fields

The system attempts to extract:

* Invoice Number
* Invoice Date
* Vendor Name
* Subtotal
* Tax
* Total Amount
* Payment Terms

If a field cannot be confidently extracted:

```
Not found
```

---

## 🛠️ Tech Stack

* Python
* Streamlit
* LangChain
* FAISS
* HuggingFace Transformers
* Sentence Transformers (`all-MiniLM-L6-v2`)
* dotenv

---

## 📂 Project Structure

```
invoice-extractor/
│
├── invoice_extractor.py     # Streamlit Frontend
├── invoice_util.py          # RAG + Extraction Logic
├── requirements.txt
├── .gitignore
├── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```
git clone https://github.com/someshbharathwaj-ops/invoice-extractor.git
cd invoice-extractor
```

### 2️⃣ Create Virtual Environment

```
python -m venv venv
```

Activate:

Windows:

```
venv\Scripts\activate
```

Mac/Linux:

```
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```
pip install -r requirements.txt
```

---

## ▶️ Run Application

```
streamlit run invoice_extractor.py
```

---

## ⚠️ Current Issues (Honest Status)

The system is **not stable yet**. Known problems:

* PDF parsing fails for complex invoice layouts
* RAG retrieval is inconsistent
* LLM responses are not deterministic
* Some invoices return incomplete fields
* Chunking strategy needs redesign
* Regex fallback logic is fragile
* No structured JSON enforcement
* No validation layer
* Temporary files not auto-cleaned

This repository reflects an **active learning and architecture improvement process**, not a final production system.

---

## 🎓 Learning Context

This project was originally developed after completing a Retrieval-Augmented Generation course on Coursera.

It serves as:

* A hands-on RAG experimentation environment
* A sandbox for document intelligence
* A portfolio project showing system design thinking
* A base for future document AI systems

---

## 🔄 Upgrade Roadmap (Phase-wise)

### Phase 1 — Stabilization

* Improve PDF loader robustness
* Redesign chunking strategy
* Add structured JSON schema enforcement
* Improve prompt design
* Add logging

### Phase 2 — Model Improvements

* Replace `distilgpt2` with instruction-tuned LLM
* Add structured output parser
* Add confidence scoring
* Improve retrieval relevance

### Phase 3 — Production Readiness

* Dockerize application
* Add API layer (FastAPI)
* Add persistent vector storage
* Add automated cleanup
* Add CI/CD
* Deploy on Render / Streamlit Cloud

### Phase 4 — Advanced Upgrade (Long-Term Vision)

* Add layout-aware parsing (e.g., OCR + LayoutLM)
* Add table extraction module
* Multi-invoice batch processing
* Analytics dashboard
* Convert into SaaS-ready microservice

---

## 💡 Why Keep a “Broken” Project Public?

Because engineering growth is visible in iteration.

This repository shows:

* RAG understanding
* Vector database usage
* Prompt engineering attempts
* LLM integration
* Real-world document challenges
* Architecture refactoring journey

---

## 👨‍💻 Author

Somesh Bharathwaj
GitHub: [https://github.com/someshbharathwaj-ops](https://github.com/someshbharathwaj-ops)

BS Data Science | AI Systems | RAG | Document Intelligence

---

## 📜 License

Educational / Experimental Use Only
