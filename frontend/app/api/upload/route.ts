import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const pythonBackendUrl = "http://localhost:6000/parse-pptx";
  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  try {
    console.log("Sending file to Python backend:", file.name);
    const response = await axios.post(pythonBackendUrl, uploadFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Response from Python backend:", response.data);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error uploading file to Python backend:", error.message);
      if (error.response) {
        console.error("Backend response:", error.response.data);
        return NextResponse.json(
          {
            error:
              "Backend parsing failed: " +
              (error.response.data.error || error.message),
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: "Failed to connect to backend: " + error.message },
        { status: 500 }
      );
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      return NextResponse.json(
        { error: "Unexpected error occurred: " + error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
