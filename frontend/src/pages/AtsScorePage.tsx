import React, { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import axios from "axios";
import { useTheme } from "@/contexts/ThemeContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AtsScorePage: React.FC = () => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [ats, setAts] = useState<{ score: number; suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Drag & Drop handlers
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (newFile: File | null) => {
    setAts(null);
    setError(null);
    if (!newFile) return;
    if (
      !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
        newFile.type
      )
    ) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    if (newFile.size > 2 * 1024 * 1024) {
      setError("File must be under 2MB.");
      return;
    }
    setFile(newFile);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleCardClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setAts(null);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await axios.post(`${API}/api/ats/score`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAts(res.data);
    } catch {
      setError("Failed to analyze resume. Please try again.");
    }
    setLoading(false);
  };

  // Theme styles
  const cardBg =
    theme === "dark"
      ? "bg-gray-900 text-gray-100 border-gray-800"
      : "bg-white text-gray-900 border-gray-200";
  const dropZoneClass = dragActive
    ? "border-primary bg-primary/10"
    : "border-dashed border-2";

  return (
    <Card className={`max-w-xl mx-auto my-8 border ${cardBg}`}>
      <CardHeader>
        <CardTitle>Need ATS Score?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div
            className={`flex flex-col items-center justify-center rounded-lg cursor-pointer py-12 px-4 mb-4 text-center transition-colors ${dropZoneClass}`}
            onClick={handleCardClick}
            onDrop={onDrop}
            onDragOver={e => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={e => {
              e.preventDefault();
              setDragActive(false);
            }}
            tabIndex={0}
            aria-label="Resume upload area"
            style={{
              outline: dragActive
                ? `2px solid var(--color-primary, #4f46e5)`
                : "none",
            }}
          >
            <Upload size={40} className="mx-auto mb-2 text-primary" />
            <div>
              <span className="font-medium">Drag &amp; drop resume here,</span> or <span className="underline">click to choose a file</span>
            </div>
            <div className="text-xs text-muted-foreground">
              PDF or DOCX only &middot; Max 2MB file size
            </div>
            <div className="text-[10px] text-success mt-1">100% privacy</div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={onInputChange}
              aria-label="Upload resume"
            />
          </div>
          {file && (
            <div className="mb-2 text-sm flex items-center gap-2">
              <span className="font-semibold">Selected:</span>
              <span>{file.name}</span>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          )}
          {error && <div className="text-red-600 text-sm py-1">{error}</div>}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={!file || loading}
          >
            {loading ? "Analyzing..." : "Check ATS Score"}
          </Button>
        </form>
        {ats && (
          <div className="mt-5">
            <div
              className={`font-bold text-lg ${
                ats.score >= 80
                  ? "text-green-600"
                  : ats.score >= 60
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              ATS Score: {ats.score}/100
            </div>
            <ul className="mt-2 list-disc pl-5">
              {ats.suggestions.map((sug, i) => (
                <li key={i} className="text-muted-foreground">{sug}</li>
              ))}
            </ul>
            <div className="mt-2 text-xs text-muted-foreground">
              Guidance provided based on your resume for ATS optimization.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AtsScorePage;
