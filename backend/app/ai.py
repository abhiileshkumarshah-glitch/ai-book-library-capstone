import os
import json
from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session
from .models import Book
from .schemas import BookUpdate
from .crud import update_book

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def books_to_context(books):
    if not books:
        return "No books found."

    context = ""

    for book in books:
        context += f"""
Book ID: {book.id}
Title: {book.title}
Author: {book.author}
Status: {book.status}
Rating: {book.rating}
Notes:
"""
        for note in book.notes:
            context += f"- {note.content}\n"

    return context


def ask_ai(prompt: str):
    try:
        response = client.models.generate_content(
           model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        error_text = str(e)

        if "RESOURCE_EXHAUSTED" in error_text or "429" in error_text:
            return (
                "Gemini API quota is currently exceeded. "
                "Please wait and try again later, enable billing, or use another API key."
            )

        if "API key" in error_text or "invalid" in error_text.lower():
            return "Gemini API key is invalid. Please check backend/.env file."

        return f"AI error: {error_text}"

def recommend_books(db: Session):
    books = db.query(Book).all()
    context = books_to_context(books)

    prompt = f"""
You are an AI reading assistant.

Use the user's real book data below to recommend what they should read next.

User book data:
{context}

Give a helpful recommendation in simple language.
"""

    return ask_ai(prompt)


def summarize_notes(db: Session, book_id: int):
    book = db.query(Book).filter(Book.id == book_id).first()

    if not book:
        return "Book not found."

    notes = "\n".join([note.content for note in book.notes])

    if not notes:
        return "No notes found for this book."

    prompt = f"""
Summarize these reading notes for the book "{book.title}" by {book.author}.

Notes:
{notes}

Give:
1. Short summary
2. Key ideas
3. One useful takeaway
"""

    return ask_ai(prompt)


def ai_agent(db: Session, user_message: str):
    books = db.query(Book).all()
    context = books_to_context(books)

    prompt = f"""
You are an AI agent for a book library app.

The user may ask you to update a book. You must return ONLY valid JSON.
Do not use markdown.
Do not wrap the response in ```json.

User book data:
{context}

User request:
{user_message}

Return JSON in this format:
{{
  "action": "update_book" or "none",
  "book_id": number or null,
  "status": "want_to_read" or "currently_reading" or "read" or null,
  "rating": number or null,
  "message": "short message for user"
}}

Rules:
- If user says they finished a book, status should be "read".
- If user gives a rating, include rating.
- If no update is needed, action should be "none".
"""

    ai_text = ask_ai(prompt)

    try:
        clean_text = ai_text.strip()
        clean_text = clean_text.replace("```json", "")
        clean_text = clean_text.replace("```", "")
        clean_text = clean_text.strip()

        data = json.loads(clean_text)
    except Exception:
        return {
            "message": "AI response was not valid JSON.",
            "raw_response": ai_text
        }

    if data.get("action") == "update_book" and data.get("book_id"):
        book_update = BookUpdate(
            status=data.get("status"),
            rating=data.get("rating")
        )

        updated_book = update_book(db, data["book_id"], book_update)

        return {
            "message": data.get("message"),
            "updated_book": updated_book
        }

    return {
        "message": data.get("message", "No action needed.")
    }