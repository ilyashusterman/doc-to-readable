import React, { useState } from "react";
import { Navbar, DemoKey } from "./components/Navbar";
import DocToMarkdownDemo from "./components/DocToMarkdownDemo";
import DocToRAGDemo from "./components/DocToRAGDemo";
import "./App.css";

const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoKey>("markdown");

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-muted/60 to-background/80">
      <Navbar active={activeDemo} onSelect={setActiveDemo} />
      <div className="flex-1 w-full mt-14 md:mt-0 md:ml-64">
        {activeDemo === "markdown" && <DocToMarkdownDemo />}
        {activeDemo === "rag" && <DocToRAGDemo />}
      </div>
    </div>
  );
};

export default App;
