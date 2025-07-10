import React from "react";
import MarkDownPreviewer from "./MarkDownPreviewer";
import { Button } from "./ui/button";
import MonacoEditor from "@monaco-editor/react";

interface OutputPreviewProps {
  markdown: string;
  showMarkdownCode: boolean;
  setShowMarkdownCode: (v: boolean) => void;
  handleDownload: (type: "markdown" | "json") => void;
  showStickyButtons?: boolean;
}

const OutputPreview: React.FC<OutputPreviewProps> = ({
  markdown,
  showMarkdownCode,
  setShowMarkdownCode,
  handleDownload,
  showStickyButtons,
}) => {
  if (showStickyButtons) {
    return (
      <Button className="flex-1 min-w-[120px] w-full sm:w-auto" variant="secondary" onClick={() => handleDownload("markdown")} disabled={!markdown}>
        Download Markdown
      </Button>
    );
  }
  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 h-full w-full">
        <div className="flex flex-wrap items-center gap-2 w-full mb-2">
          <span className="font-semibold">Preview</span>
          <Button
            size="sm"
            variant="outline"
            className="ml-2 flex-1 min-w-[120px] w-full sm:w-auto"
            onClick={() => setShowMarkdownCode(!showMarkdownCode)}
          >
            {showMarkdownCode ? "Show Rendered" : "Show Code"}
          </Button>
        </div>
        <div className="flex-1 min-h-[200px] h-full w-full rounded p-0 sm:p-4 bg-muted/10 overflow-auto" style={{ minWidth: 0 }}>
          {showMarkdownCode ? (
            <div className="h-full w-full min-h-[200px]">
              <MonacoEditor
                height="100%"
                width="100%"
                defaultLanguage="markdown"
                value={markdown}
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
          ) : (
            <div className="h-full w-full min-h-[200px]">
              <MarkDownPreviewer markdown={markdown} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OutputPreview; 