import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// @ts-expect-error: No types for react-syntax-highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error: No types for prism theme
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { FileIcon, Link2Icon, CodeIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

interface InputAreaProps {
  inputType: string;
  setInputType: (type: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  url: string;
  setUrl: (url: string) => void;
  html: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHtmlChange: (e: React.ChangeEvent<HTMLTextAreaElement> | { target: { value: string } }) => void;
  handleConvert: () => void;
  loading: boolean;
  error: string;
  onConvert?: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  inputType,
  setInputType,
  url,
  html,
  handleFileChange,
  handleUrlChange,
  handleHtmlChange,
  handleConvert,
  loading,
  error,
  onConvert,
}) => {
  React.useEffect(() => {}, [inputType]);

  // Always render the full input area and Convert button
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Input Document</CardTitle>
        <CardDescription className="text-muted-foreground">Choose your input type and provide your document below.</CardDescription>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-6">
        <div className="mb-4">
          <Select value={inputType} onValueChange={setInputType}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select input type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="html">HTML/Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {inputType === "file" && (
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2"><FileIcon className="w-4 h-4" /> File Upload</div>
            <Input
              type="file"
              accept=".html,.htm,.txt"
              onChange={handleFileChange}
              className="w-full min-w-0"
            />
            <div className="text-xs text-muted-foreground">Upload an HTML or text file to convert.</div>
          </div>
        )}
        {inputType === "url" && (
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2"><Link2Icon className="w-4 h-4" /> URL</div>
            <Input
              type="text"
              placeholder="Enter URL to HTML file"
              value={url}
              onChange={handleUrlChange}
              className="w-full min-w-0"
            />
            <div className="text-xs text-muted-foreground">Paste a URL to an HTML page to convert.</div>
          </div>
        )}
        {inputType === "html" && (
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2"><CodeIcon className="w-4 h-4" /> HTML/Text</div>
            <textarea
              value={html}
              onChange={handleHtmlChange}
              className="block w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[120px] max-h-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-auto font-mono"
              style={{ resize: 'vertical', minHeight: '120px', minWidth: 0 }}
              rows={6}
            />
            <div className="text-xs text-muted-foreground">Paste or type HTML/text to convert.</div>
          </div>
        )}
        {error && <div className="text-destructive mb-2 w-full min-w-0">{error}</div>}
        <Button
          className="w-full mt-4 text-base py-3 font-semibold"
          onClick={() => {
            handleConvert();
            if (onConvert) onConvert();
          }}
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InputArea; 