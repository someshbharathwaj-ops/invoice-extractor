# 🧾 Invoice Extractor (RAG Experiment)

An experimental **Invoice Data Extraction system** built to explore **Retrieval-Augmented Generation (RAG)** pipelines for document understanding.

This project investigates how **LLMs, vector databases, and embeddings** can be used to extract structured information from invoice PDFs.

⚠️ **Project Status:**  
This project is **currently under active refactoring and experimentation**.  
It is **not yet a stable or production-ready system**.

---

# 🎯 Project Objective

The goal of this repository is to **experiment with building a document-understanding pipeline**, rather than delivering a finished invoice extraction product.

The system explores:

- RAG pipeline architecture  
- PDF text processing challenges  
- LLM-based information extraction  
- Vector search for document retrieval  
- Prompt-based structured field extraction  

This project serves as a **learning environment and architecture prototype** for future document intelligence systems.

---

# 🧠 Conceptual Pipeline

The experimental pipeline currently follows this architecture:

```
User Upload
   ↓
PDF Loader
   ↓
Text Chunking
   ↓
Embedding Model
   ↓
FAISS Vector Store
   ↓
Retriever
   ↓
Prompt Template
   ↓
LLM Inference
   ↓
Field Extraction Attempt
```

This pipeline is **still being redesigned and improved**.

---

# 📌 Intended Extraction Fields

The system attempts to extract important invoice attributes such as:

- Invoice Number  
- Invoice Date  
- Vendor Name  
- Subtotal  
- Tax  
- Total Amount  
- Payment Terms  

If a value cannot be extracted reliably, the system returns:

```
Not Found
```

Accuracy currently varies depending on invoice layout.

---

# 🛠️ Technology Stack

### Core Technologies

- Python  
- Streamlit  
- LangChain  
- FAISS Vector Database  

### Machine Learning / NLP

- HuggingFace Transformers  
- Sentence Transformers  
- `all-MiniLM-L6-v2` embedding model  

### Utilities

- dotenv  
- LangChain PDF loaders  

---

# 📂 Repository Structure

```
invoice-extractor/

├── invoice_extractor.py     # Streamlit interface
├── invoice_util.py          # RAG pipeline + extraction logic
├── requirements.txt
├── .gitignore
└── README.md
```

The codebase currently focuses on **experimenting with RAG pipeline design and document extraction strategies**.

---

# ⚙️ Setup (Experimental)

### 1. Clone the Repository

```
git clone https://github.com/someshbharathwaj-ops/invoice-extractor.git
cd invoice-extractor
```

### 2. Create Virtual Environment

```
python -m venv venv
```

Activate the environment:

Windows

```
venv\Scripts\activate
```

Mac/Linux

```
source venv/bin/activate
```

### 3. Install Dependencies

```
pip install -r requirements.txt
```

---

# ▶️ Run the Application

```
streamlit run invoice_extractor.py
```

⚠️ The application may **not work reliably yet**, since the architecture is still evolving.

---

# ⚠️ Current Limitations

This repository intentionally reflects a **work-in-progress system**.

Known issues include:

- PDF parsing struggles with complex invoice layouts  
- Chunking strategy needs redesign  
- Retrieval quality is inconsistent  
- LLM responses are not deterministic  
- Some fields are incorrectly extracted  
- Output is not strictly structured  
- Regex fallback logic needs improvement  
- Temporary file cleanup is incomplete  

These issues are expected during the **experimentation and refactoring phase**.

---

# 🔄 Development Roadmap

### Phase 1 — Pipeline Stabilization

- Improve PDF loading reliability  
- Redesign text chunking strategy  
- Add structured JSON output schema  
- Improve prompt design  
- Add logging and debugging tools  

### Phase 2 — Model Improvements

- Replace `distilgpt2` with an instruction-tuned LLM  
- Add structured output parser  
- Introduce extraction confidence scoring  
- Improve retrieval ranking  

### Phase 3 — System Architecture

- Introduce FastAPI backend  
- Add persistent vector storage  
- Dockerize the application  
- Implement automated file cleanup  
- Add CI/CD pipeline  

### Phase 4 — Advanced Document Intelligence

Future exploration may include:

- Layout-aware document parsing  
- OCR integration  
- Table extraction  
- Batch invoice processing  
- Analytics dashboard  
- SaaS-style document processing system  

---

# 🎓 Learning Context

This project was started after studying **Retrieval-Augmented Generation systems** and serves as a **hands-on environment for experimenting with LLM pipelines**.

The project helps explore:

- RAG architecture  
- Vector databases  
- Prompt engineering  
- Document AI challenges  
- AI system design  

---

# 💡 Why Keep an Incomplete Project Public?

Engineering growth happens through **iteration and experimentation**.

This repository intentionally shows:

- experimentation with RAG pipelines  
- early architecture attempts  
- real challenges in document extraction  
- ongoing refactoring and improvement  

It represents **learning through building real systems**.

---

# 👨‍💻 Author

**Somesh Bharathwaj**

BS Data Science  
AI Systems | RAG | Document Intelligence  

GitHub:  
https://github.com/someshbharathwaj-ops

---

# 📜 License

This project is provided for **educational and experimental purposes only**.
