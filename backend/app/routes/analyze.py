from fastapi import APIRouter, UploadFile, File, HTTPException

import os
import shutil

from app.services.pdf_service import extract_text_from_pdf
from app.services.clause_service import split_into_clauses
from app.services.ai_service import analyze_clause
from app.services.document_service import is_contract


router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):

    # Check if file exists
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file was uploaded."
        )

    # Only allow PDF files
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    # Save uploaded PDF temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:

        # -------------------------
        # STEP 1: Extract PDF text
        # -------------------------

        text = extract_text_from_pdf(
            file_path
        )

        # Check if text was extracted
        if not text or len(text.strip()) < 50:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract enough text from the PDF. "
                    "The document may be scanned or image-based."
                )
            )

        # -------------------------
        # STEP 2: Detect document type
        # -------------------------

        document = is_contract(
            text
        )

        # Reject non-contract documents
        if not document.get(
            "is_contract",
            False
        ):

            return {
                "filename": file.filename,
                "status": "rejected",
                "message": "Uploaded document is not a legal contract.",
                "document_type": document.get(
                    "document_type",
                    "Unknown"
                )
            }

        # -------------------------
        # STEP 3: Split into clauses
        # -------------------------

        clauses = split_into_clauses(
            text
        )

        if not clauses:

            raise HTTPException(
                status_code=400,
                detail="No contract clauses could be detected."
            )

        # -------------------------
        # STEP 4: AI Risk Analysis
        # -------------------------

        results = []

        for clause in clauses:

            clause = clause.strip()

            # Ignore very small pieces
            if len(clause) < 20:
                continue

            analysis = analyze_clause(
                clause
            )

            results.append(
                {
                    "clause": clause,
                    **analysis
                }
            )

        # -------------------------
        # STEP 5: Return final result
        # -------------------------

        return {
            "filename": file.filename,

            "status": "success",

            "document_type": document.get(
                "document_type",
                "Legal Contract"
            ),

            "number_of_clauses": len(
                results
            ),

            "analysis": results
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Contract analysis failed: {str(error)}"
        )

    finally:

        # Delete temporary PDF
        if os.path.exists(file_path):

            os.remove(file_path)