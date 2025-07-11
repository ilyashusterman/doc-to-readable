import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import OutputPreview from "./OutputPreview";
import InputArea from "./InputArea";
import { docToMarkdown } from 'doc-to-readable';
import { useDocInput } from './useDocInput';

export const DocToMarkdownDemo: React.FC = () => {
  const {
    inputType, setInputType, file, setFile, url, setUrl, html, setHtml, error, setError, loading, setLoading,
    handleFileChange, handleUrlChange, handleHtmlChange
  } = useDocInput();
  const [markdown, setMarkdown] = useState<string>("");
  const [json] = useState<string>("");
  const [showMarkdownCode, setShowMarkdownCode] = useState<boolean>(true);
  const [showOutputOnly, setShowOutputOnly] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number>(0);

  // Download logic
  const handleDownload = (type: "markdown" | "json") => {
    const blob = new Blob([
      type === "markdown" ? markdown : json
    ], { type: type === "markdown" ? "text/markdown" : "application/json" });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = `output.${type === "markdown" ? "md" : "json"}`;
    a.click();
    URL.revokeObjectURL(urlObj);
  };

  // Main conversion logic
  const handleConvert = async () => {
    setLoading(true);
    setError("");
    setExecutionTime(0);
    
    const startTime = performance.now();
    
    try {
      let htmlContent = html;
      let md: string = "";
      if (inputType === "file" && file) {
        htmlContent = await file.text();
        md = await docToMarkdown(htmlContent, { type: 'html' });
      } else if (inputType === "url" && url) {
        md = await docToMarkdown(url, { type: 'url' });
        try {
          const res = await fetch(url);
          htmlContent = await res.text();
        } catch {}
      } else if (inputType === "html" && html) {
        md = await docToMarkdown(html, { type: 'html' });
      } else {
        throw new Error("No HTML content to process");
      }
      
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      
      setHtml(htmlContent);
      setMarkdown(md);
      setShowMarkdownCode(false);
      setShowOutputOnly(true);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Helper for input area props
  const inputAreaProps = {
    inputType,
    setInputType,
    file,
    setFile,
    url,
    setUrl,
    html,
    handleFileChange,
    handleUrlChange,
    handleHtmlChange,
    handleConvert,
    loading,
    error,
    onConvert: handleConvert,
  };

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-muted/60 to-background/80 overflow-hidden">
      <main className="flex flex-col md:flex-row gap-4 h-[100dvh] p-2 md:p-6 w-full max-w-full">
        {/* Input Section */}
        {!showOutputOnly && (
          <section className="flex-1 min-w-0 h-[60vh] md:h-auto">
            <Card className="flex flex-col h-full min-w-0">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-2xl md:text-3xl font-bold">Input</CardTitle>
                <CardDescription className="text-base md:text-lg text-muted-foreground">
                  Upload a file, enter a URL, or paste HTML/text to convert.
                </CardDescription>
              </CardHeader>
              <div className="flex-1 overflow-auto min-h-0 p-4">
                <InputArea {...inputAreaProps} />
              </div>
            </Card>
          </section>
        )}
        {/* Output Section */}
        <section className="flex-1 min-w-0 h-[60vh] md:h-auto">
          <Card className="flex flex-col h-full min-w-0">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-2xl md:text-3xl font-bold">Output</CardTitle>
              <CardDescription className="text-base md:text-lg text-muted-foreground">
                View and download your Markdown or JSON output.
              </CardDescription>
              {executionTime > 0 && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  ⚡ Converted in {executionTime.toFixed(0)}ms
                </div>
              )}
              {showOutputOnly && (
                <div className="mt-2">
                  <button
                    className="inline-flex items-center px-3 py-1 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted transition-colors"
                    onClick={() => setShowOutputOnly(false)}
                  >
                    ← Back to Edit
                  </button>
                </div>
              )}
            </CardHeader>
            <div className="flex-1 overflow-auto min-h-0 p-4">
              <OutputPreview
                markdown={markdown}
                showMarkdownCode={showMarkdownCode}
                setShowMarkdownCode={setShowMarkdownCode}
                handleDownload={handleDownload}
              />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default DocToMarkdownDemo; 