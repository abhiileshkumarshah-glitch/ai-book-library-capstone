import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="max-w-5xl mx-auto flex gap-6">
        <Link href="/" className="font-bold">
          AI Book Library
        </Link>
        <Link href="/books">Books</Link>
        <Link href="/books/new">Add Book</Link>
        <Link href="/ai">AI Assistant</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}