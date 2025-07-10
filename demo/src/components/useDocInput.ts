import { useState } from "react";

export function useDocInput(defaultType: string = "url") {
  const [inputType, setInputType] = useState<string>(defaultType);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputType = (type: string) => {
    setInputType(type);
    setHtml("");
    setFile(null);
    setUrl("");
    setError("");
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setHtml("");
    setError("");
  };
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setHtml("");
    setFile(null);
    setError("");
  };
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement> | { target: { value: string } }) => {
    setHtml(e.target.value);
    setFile(null);
    setError("");
  };

  return {
    inputType,
    setInputType: handleInputType,
    file,
    setFile,
    url,
    setUrl,
    html,
    setHtml,
    error,
    setError,
    loading,
    setLoading,
    handleFileChange,
    handleUrlChange,
    handleHtmlChange,
  };
} 