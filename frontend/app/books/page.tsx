"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

type Note = {
  id: number;
  content: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number | null;
  notes: Note[];
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});

  async function loadBooks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Failed to load books");
      }

      const data = await response.json();
      setBooks(data);
    } catch {
      setError("Could not load books. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBook(id: number) {
    await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
    });

    loadBooks();
  }

  async function updateStatus(book: Book, status: string) {
    await fetch(`${API_URL}/books/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        status,
        rating: book.rating,
      }),
    });

    loadBooks();
  }

  async function addNote(bookId: number) {
    const noteText = noteInputs[bookId];

    if (!noteText || !noteText.trim()) return;

    await fetch(`${API_URL}/books/${bookId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: noteText }),
    });

    setNoteInputs({ ...noteInputs, [bookId]: "" });
    loadBooks();
  }

  useEffect(() => {
    loadBooks();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Books</h1>

      {books.length === 0 && <p>No books yet. Add your first book.</p>}

      <div className="space-y-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded-lg space-y-3">
            <h2 className="text-2xl font-semibold">{book.title}</h2>
            <p>Book ID: {book.id}</p>
            <p>Author: {book.author}</p>
            <p>Status: {book.status}</p>
            <p>Rating: {book.rating ?? "No rating"}</p>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => updateStatus(book, "want_to_read")}
                className="bg-gray-700 text-white px-3 py-2 rounded"
              >
                Want to Read
              </button>

              <button
                onClick={() => updateStatus(book, "currently_reading")}
                className="bg-gray-700 text-white px-3 py-2 rounded"
              >
                Currently Reading
              </button>

              <button
                onClick={() => updateStatus(book, "read")}
                className="bg-gray-700 text-white px-3 py-2 rounded"
              >
                Read
              </button>

              <button
                onClick={() => deleteBook(book.id)}
                className="bg-red-600 text-white px-3 py-2 rounded"
              >
                Delete
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Notes</h3>

              {book.notes.length === 0 && <p>No notes yet.</p>}

              <ul className="list-disc ml-6">
                {book.notes.map((note) => (
                  <li key={note.id}>{note.content}</li>
                ))}
              </ul>

              <div className="flex gap-2 mt-2">
                <input
                  value={noteInputs[book.id] || ""}
                  onChange={(e) =>
                    setNoteInputs({
                      ...noteInputs,
                      [book.id]: e.target.value,
                    })
                  }
                  placeholder="Add note"
                  className="border p-2 flex-1"
                />

                <button
                  onClick={() => addNote(book.id)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}