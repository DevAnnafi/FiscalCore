from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import resend
from app.core.config import settings

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str

@router.post("/contact")
def send_contact_email(request: ContactRequest):
    if not request.name or not request.email or not request.message:
        raise HTTPException(status_code=400, detail="Name, email and message are required")
    
    resend.api_key = settings.resend_api_key
    
    try:
        resend.Emails.send({
            "from": "FiscalCore <onboarding@resend.dev>",
            "to": "islamannafi@gmail.com", 
            "reply_to": request.email,
            "subject": f"[FiscalCore Contact] {request.subject or 'New Message'}",
            "html": f"""
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> {request.name}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Subject:</strong> {request.subject or 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>{request.message}</p>
            """
        })
        return {"message": "Message sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send message")