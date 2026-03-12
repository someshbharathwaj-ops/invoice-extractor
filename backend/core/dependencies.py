from backend.services.invoice_service import invoice_service
from backend.services.processing_service import processing_service
from backend.services.system_service import system_service


def get_invoice_service():
    return invoice_service


def get_processing_service():
    return processing_service


def get_system_service():
    return system_service
