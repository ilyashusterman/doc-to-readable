import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import InputArea from "./InputArea";
import MonacoEditor from "@monaco-editor/react";
import { docToMarkdown, splitReadableDocs } from 'doc-to-readable';
import { useDocInput } from './useDocInput';

export const DocToRAGDemo: React.FC = () => {
  const {
    inputType, setInputType, file, setFile, url, setUrl, html, error, setError, loading, setLoading,
    handleFileChange, handleUrlChange, handleHtmlChange
  } = useDocInput();
  const [json, setJson] = useState<string>("");
  const [showOutputOnly, setShowOutputOnly] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<{ markdown: number; split: number }>({ markdown: 0, split: 0 });

  // Download logic
  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = `output.json`;
    a.click();
    URL.revokeObjectURL(urlObj);
  };

  // Main conversion logic: extract markdown, split, and stringify
  const handleConvert = async () => {
    setLoading(true);
    setError("");
    setExecutionTime({ markdown: 0, split: 0 });
    
    try {
      let markdown = "";
      let markdownTime = 0;
      let splitTime = 0;
      
      if (inputType === "file" && file) {
        const text = await file.text();
        const markdownStart = performance.now();
        markdown = await docToMarkdown(text, { type: 'html' });
        markdownTime = performance.now() - markdownStart;
        
        const splitStart = performance.now();
        const sections = await splitReadableDocs(markdown);
        splitTime = performance.now() - splitStart;
        
        setJson(JSON.stringify(sections, null, 2));
      } else if (inputType === "url" && url) {
        const markdownStart = performance.now();
        markdown = await docToMarkdown(url, { type: 'url' });
        markdownTime = performance.now() - markdownStart;
        
        const splitStart = performance.now();
        const sections = await splitReadableDocs(markdown);
        splitTime = performance.now() - splitStart;
        
        setJson(JSON.stringify(sections, null, 2));
      } else if (inputType === "html" && html) {
        const markdownStart = performance.now();
        markdown = await docToMarkdown(html, { type: 'html' });
        markdownTime = performance.now() - markdownStart;
        
        const splitStart = performance.now();
        const sections = await splitReadableDocs(markdown);
        splitTime = performance.now() - splitStart;
        
        setJson(JSON.stringify(sections, null, 2));
      } else {
        throw new Error("No input provided");
      }
      
      setExecutionTime({ markdown: markdownTime, split: splitTime });
      setShowOutputOnly(true);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <InputArea
                inputType={inputType}
                setInputType={setInputType}
                file={file}
                setFile={setFile}
                url={url}
                setUrl={setUrl}
                html={html}
                handleFileChange={handleFileChange}
                handleUrlChange={handleUrlChange}
                handleHtmlChange={handleHtmlChange}
                handleConvert={handleConvert}
                loading={loading}
                error={error}
                onConvert={handleConvert}
              />
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
              Preview and download your JSON output.
            </CardDescription>
            {executionTime.markdown > 0 && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                ⚡ Converted in {executionTime.markdown.toFixed(0)}ms | Split in {executionTime.split.toFixed(0)}ms
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
            <div className="flex flex-col flex-1 min-h-0 h-full w-full">
              <div className="flex flex-wrap items-center gap-2 w-full mb-2">
                <span className="font-semibold">Preview</span>
              </div>
              <div className="flex-1 min-h-[200px] h-full w-full rounded p-0 sm:p-4 bg-muted/10 overflow-auto" style={{ minWidth: 0 }}>
                <div className="h-full w-full min-h-[200px]">
                  <MonacoEditor
                    height="100%"
                    width="100%"
                    defaultLanguage="json"
                    value={json}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      wordWrap: "on",
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      lineNumbers: "on",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 left-0 w-full bg-background z-10 flex flex-wrap gap-2 p-2 border-t">
            <button
              className="flex-1 min-w-[120px] w-full sm:w-auto btn btn-secondary"
              onClick={handleDownload}
              disabled={!json}
            >
              Download JSON
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default DocToRAGDemo; 