"use client";
import { useState } from "react";
import Header from "./components/Header";
import Description from "./components/Description";
import UploadForm from "./components/UploadForm";
import NotesDisplay from "./components/NotesDisplay";
import Footer from "./components/Footer";

export default function Home() {
  const [topics, setTopics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Received topics data:", data);
      setTopics(data.topics || {});
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <main className="font-nunito min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-2xl w-full max-w-5xl">
          <Description />
          <UploadForm onUpload={handleUpload} />
          {isLoading && (
            <div className="flex justify-center items-center mt-8">
              <div className="loader"></div>
            </div>
          )}
          {Object.keys(topics).length > 0 && <NotesDisplay topics={topics} />}
        </div>
      </div>
      <Footer />
    </main>
  );
}
