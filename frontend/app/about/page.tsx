export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">About This Project</h1>

      <p>
        AI Book Library Assistant is a full-stack AI-powered web application.
        Users can manage their personal book library, add reading notes, and use
       Gemini API to get personalized recommendations and summaries.
      </p>

      <p>
        The AI is meaningful because it uses real application data from the
        PostgreSQL database, not just a generic chatbot.
      </p>

      <h2 className="text-2xl font-semibold">Tech Stack</h2>

      <ul className="list-disc ml-6">
        <li>Frontend: Next.js</li>
        <li>Backend: FastAPI</li>
        <li>Database: PostgreSQL</li>
        <li>AI: Gemini API</li>
        <li>Deployment: Docker Compose</li>
      </ul>
    </div>
  );
}