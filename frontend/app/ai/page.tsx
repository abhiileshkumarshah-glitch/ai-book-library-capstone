"use client";

import { useState } from "react";

const API_URL = "http://localhost:8000";

export default function AIPage() {
  const [recommendation, setRecommendation] = useState("");
  const [summary, setSummary] = useState("");
  const [agentMessage, setAgentMessage] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRecommendation() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/ai/recommend`, {
        method: "POST",
      });

      const data = await response.json();
      setRecommendation(data.response || JSON.stringify(data));
    } catch {
      setError("Could not get recommendation. Check your API key and backend.");
    } finally {
      setLoading(false);
    }
  }

  async function summarizeNotes() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/ai/summarize-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: Number(bookId),
        }),
      });

      const data = await response.json();
      setSummary(data.response || JSON.stringify(data));
    } catch {
      setError("Could not summarize notes. Check your API key and backend.");
    } finally {
      setLoading(false);
    }
  }

  async function runAgent() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/ai/agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: agentMessage,
        }),
      });

      const data = await response.json();
      setAgentResponse(data.message || JSON.stringify(data));
    } catch {
      setError("Could not run AI agent. Check your API key and backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Assistant</h1>

      {loading && <p>AI is thinking...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <section className="border p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">
          AI Book Recommendation
        </h2>

        <button
          onClick={getRecommendation}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Recommend Next Book
        </button>

        {recommendation && (
          <p className="mt-4 whitespace-pre-wrap">{recommendation}</p>
        )}
      </section>

      <section className="border p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Summarize Book Notes</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Enter Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />

        <button
          onClick={summarizeNotes}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Summarize Notes
        </button>

        {summary && <p className="mt-4 whitespace-pre-wrap">{summary}</p>}
      </section>

      <section className="border p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">AI Agent</h2>

        <textarea
          className="border p-2 w-full"
          rows={4}
          placeholder="Example: I finished 1984. Mark it as read and give it 4 stars."
          value={agentMessage}
          onChange={(e) => setAgentMessage(e.target.value)}
        />

        <button
          onClick={runAgent}
          className="bg-black text-white px-4 py-2 rounded mt-2"
        >
          Run Agent
        </button>

        {agentResponse && (
          <p className="mt-4 whitespace-pre-wrap">{agentResponse}</p>
        )}
      </section>
    </div>
  );
}