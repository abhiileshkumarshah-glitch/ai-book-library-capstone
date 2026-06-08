"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000";

export default function NewBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("want_to_read");
  const [rating, setRating] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          status,
          rating: rating ? Number(rating) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      router.push("/books");
    } catch {
      setError("Could not add book. Make sure backend is running.");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1">Title</label>
          <input
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Author</label>
          <input
            className="border p-2 w-full"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            className="border p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="want_to_read">Want to Read</option>
            <option value="currently_reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Rating</label>
          <input
            className="border p-2 w-full"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Add Book
        </button>
      </form>
    </div>
  );
}