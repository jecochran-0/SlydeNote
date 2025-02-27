"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-2xl fixed w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-sky-200 hover:scale-105 transition-transform duration-300"
        >
          SlydeNote
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 focus:outline-none hover:text-blue-300 transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            href="/about"
            className="text-lg font-medium hover:text-blue-300 hover:underline underline-offset-4 transition-all duration-300"
          >
            About Me
          </Link>
        </nav>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 px-4 py-2 space-y-4">
          <Link
            href="/about"
            className="block text-lg font-medium hover:text-blue-300 hover:underline underline-offset-4 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
