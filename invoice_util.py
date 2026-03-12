from backend.rag.legacy_adapter import extract_from_uploaded_file


def create_docs(uploaded_file):
    return extract_from_uploaded_file(uploaded_file)
