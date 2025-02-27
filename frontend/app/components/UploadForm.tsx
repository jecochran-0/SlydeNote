"use client";

import { useState } from "react";

interface UploadFormProps {
  onUpload: (file: File) => void;
}

export default function UploadForm({ onUpload }: UploadFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      setFileName(file.name);
      onUpload(file);
    } else {
      alert("Please upload a valid .pptx file.");
      setFileName(null);
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-center text-gray-200 mb-4 text-xl">
        Upload Your Presentation
      </label>
      <div className="flex items-center justify-center">
        <label className="bg-orange-400 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
          <input
            type="file"
            accept=".pptx"
            onChange={handleFileChange}
            className="hidden"
          />
          Choose File
        </label>
        {fileName && (
          <span className="ml-4 text-gray-200 text-lg">{fileName}</span>
        )}
      </div>
    </div>
  );
}
