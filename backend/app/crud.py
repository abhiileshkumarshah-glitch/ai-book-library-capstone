from sqlalchemy.orm import Session
from . import models, schemas


def get_books(db: Session):
    return db.query(models.Book).all()


def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
        title=book.title,
        author=book.author,
        status=book.status,
        rating=book.rating
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, book_id: int, book_update: schemas.BookUpdate):
    db_book = get_book(db, book_id)

    if db_book is None:
        return None

    update_data = book_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_book, key, value)

    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: int):
    db_book = get_book(db, book_id)

    if db_book is None:
        return None

    db.delete(db_book)
    db.commit()
    return db_book


def create_note(db: Session, book_id: int, note: schemas.ReadingNoteCreate):
    db_note = models.ReadingNote(
        book_id=book_id,
        content=note.content
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def get_notes_for_book(db: Session, book_id: int):
    return db.query(models.ReadingNote).filter(
        models.ReadingNote.book_id == book_id
    ).all()