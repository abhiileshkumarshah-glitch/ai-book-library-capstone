export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">AI Book Library Assistant</h1>

      <p className="text-lg">
        Track your books, reading notes, and ratings. Then use AI to get
        personalized recommendations and summaries.
      </p>

      <div className="p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">What this app does</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Add, update, and delete books</li>
          <li>Add reading notes for each book</li>
          <li>Ask AI for book recommendations</li>
          <li>Ask AI to summarize your notes</li>
          <li>Use AI agent commands to update your library</li>
        </ul>
      </div>
    </div>
  );
}