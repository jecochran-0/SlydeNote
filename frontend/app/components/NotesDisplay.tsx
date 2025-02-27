"use client";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // Use jsPDF with TypeScript support

interface NotesDisplayProps {
  topics: {
    [key: string]: {
      guiding_questions: string[];
      definitions: string[];
      specific_topics: { [key: string]: string[] };
      key_phrases?: string[];
      summary?: string;
      notes: string[]; // Store meaningful, complete content
      image_references: string[];
    };
  };
  isLoading?: boolean;
}

export default function NotesDisplay({
  topics,
  isLoading = false,
}: NotesDisplayProps) {
  console.log("Rendering NotesDisplay with topics:", topics);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading delay to show spinner
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isVisible) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  // Extract notes from the single "All Notes" topic, fallback to empty object if undefined
  const notes = topics["All Notes"] || {
    guiding_questions: [],
    definitions: [],
    specific_topics: {},
    notes: [],
    image_references: [],
  };

  // Check if there’s any data to display
  const hasData =
    notes.guiding_questions.length > 0 ||
    notes.notes.length > 0 ||
    notes.image_references.length > 0;

  if (!hasData) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen p-8 text-white font-sans text-center">
        <p className="text-2xl text-gray-400">No notes available.</p>
      </div>
    );
  }

  // Function to generate and download PDF using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add title
    doc.setFontSize(18);
    doc.text("Academic Notes", 105, yPos, { align: "center" });
    yPos += 10;

    // Add Guiding Questions
    if (notes.guiding_questions.length > 0) {
      doc.setFontSize(14);
      doc.text("Guiding Questions", 20, yPos);
      yPos += 10;
      notes.guiding_questions.forEach((question, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${question}`, 20, yPos);
        yPos += 10;
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      yPos += 10;
    }

    // Add Notes
    if (notes.notes.length > 0) {
      doc.setFontSize(14);
      doc.text("Notes", 20, yPos);
      yPos += 10;
      notes.notes.forEach((note, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${note}`, 20, yPos);
        yPos += 10;
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Add Image References
    if (notes.image_references.length > 0) {
      doc.setFontSize(14);
      doc.text("Image References", 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(notes.image_references.join(", "), 20, yPos);
    }

    doc.save("academic_notes.pdf");
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen p-4 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-100">
          PPT to Academic Notes
        </h1>
        <div className="mb-4 text-right">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-400 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Download Notes as PDF
          </button>
        </div>
        <div
          id="notes-content"
          className="p-8 bg-gray-800 rounded-xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-200">
            Your Academic Notes
          </h2>
          <div className="space-y-16">
            {/* Guiding Questions Section - Use numbered paragraphs for minimalistic look */}
            {notes.guiding_questions.length > 0 && (
              <section className="animate-fade-in">
                <h3 className="text-2xl font-semibold mb-6 text-blue-300">
                  Guiding Questions
                </h3>
                <ol className="list-decimal list-inside space-y-6 text-2xl leading-relaxed">
                  {notes.guiding_questions.map((question, index) => (
                    <li
                      key={index}
                      className="text-gray-200 hover:text-blue-300 transition-colors duration-300"
                    >
                      {question}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Notes Section - Use numbered paragraphs, expand vertically, minimalistic */}
            {notes.notes.length > 0 && (
              <section className="min-h-[70vh] animate-fade-in">
                <h3 className="text-2xl font-semibold mb-6 text-gray-200">
                  Notes
                </h3>
                <ol className="list-decimal list-inside space-y-8 text-2xl leading-relaxed">
                  {notes.notes.map((note, index) => (
                    <li
                      key={index}
                      className="text-gray-200 hover:text-blue-300 transition-colors duration-300"
                    >
                      {note}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Image References Section - Use paragraph format, minimalistic */}
            {notes.image_references.length > 0 && (
              <section className="animate-fade-in">
                <h3 className="text-2xl font-semibold mb-6 text-green-300">
                  Image References
                </h3>
                <p className="text-2xl text-gray-200 hover:text-blue-300 transition-colors duration-300">
                  {notes.image_references.join(", ")}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
