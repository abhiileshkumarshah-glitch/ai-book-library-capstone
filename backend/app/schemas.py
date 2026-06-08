from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReadingNoteBase(BaseModel):
    content: str


class ReadingNoteCreate(ReadingNoteBase):
    pass


class ReadingNoteOut(ReadingNoteBase):
    id: int
    book_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class BookBase(BaseModel):
    title: str
    author: str
    status: str = "want_to_read"
    rating: Optional[int] = None


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[int] = None


class BookOut(BookBase):
    id: int
    created_at: datetime
    notes: List[ReadingNoteOut] = []

    class Config:
        from_attributes = True


class AIRequest(BaseModel):
    message: Optional[str] = None
    book_id: Optional[int] = None