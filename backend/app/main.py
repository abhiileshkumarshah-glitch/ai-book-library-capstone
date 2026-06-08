from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import schemas, crud
from .ai import recommend_books, summarize_notes, ai_agent

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Book Library API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Book Library API is running"
    }


@app.get("/books", response_model=list[schemas.BookOut])
def get_books(db: Session = Depends(get_db)):
    return crud.get_books(db)


@app.post("/books", response_model=schemas.BookOut)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db)
):
    return crud.create_book(db, book)


@app.get("/books/{book_id}", response_model=schemas.BookOut)
def get_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    book = crud.get_book(db, book_id)

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return book


@app.put("/books/{book_id}", response_model=schemas.BookOut)
def update_book(
    book_id: int,
    book_update: schemas.BookUpdate,
    db: Session = Depends(get_db)
):
    book = crud.update_book(db, book_id, book_update)

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return book


@app.delete("/books/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    book = crud.delete_book(db, book_id)

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return {
        "message": "Book deleted successfully"
    }


@app.post("/books/{book_id}/notes", response_model=schemas.ReadingNoteOut)
def create_note(
    book_id: int,
    note: schemas.ReadingNoteCreate,
    db: Session = Depends(get_db)
):
    book = crud.get_book(db, book_id)

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return crud.create_note(db, book_id, note)


@app.get("/books/{book_id}/notes", response_model=list[schemas.ReadingNoteOut])
def get_notes(
    book_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_notes_for_book(db, book_id)


@app.post("/ai/recommend")
def ai_recommend(db: Session = Depends(get_db)):
    result = recommend_books(db)
    return {
        "response": result
    }


@app.post("/ai/summarize-notes")
def ai_summarize(
    request: schemas.AIRequest,
    db: Session = Depends(get_db)
):
    if request.book_id is None:
        raise HTTPException(status_code=400, detail="book_id is required")

    result = summarize_notes(db, request.book_id)

    return {
        "response": result
    }


@app.post("/ai/agent")
def run_ai_agent(
    request: schemas.AIRequest,
    db: Session = Depends(get_db)
):
    if not request.message:
        raise HTTPException(status_code=400, detail="message is required")

    result = ai_agent(db, request.message)

    return result