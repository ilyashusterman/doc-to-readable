import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkDownPreviewerProps {
  markdown: string;
  style?: React.CSSProperties;
}

const MarkDownPreviewer: React.FC<MarkDownPreviewerProps> = ({ markdown, style={} }) => {
  return (
    <div className={"markdown-unstyled"} style={style}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDownPreviewer; 