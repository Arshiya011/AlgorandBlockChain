from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.clause_service import split_into_clauses
import os
import shutil

from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)

    clauses = split_into_clauses(extracted_text)

    return {
    "filename": file.filename,
    "number_of_clauses": len(clauses),
    "clauses": clauses
}