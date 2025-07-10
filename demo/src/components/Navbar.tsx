import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

export type DemoKey = "markdown" | "rag";

interface NavbarProps {
  active: DemoKey;
  onSelect: (key: DemoKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ active, onSelect }) => {
  return (
    <nav
      className={
        [
          // Sidebar on md+, topbar on mobile
          "fixed z-30 bg-background/95 border-border",
          "flex md:flex-col items-center md:items-stretch justify-center md:justify-start",
          "w-full md:w-64",
          "h-14 md:h-full",
          "top-0 left-0",
          "border-b md:border-b-0 md:border-r",
        ].join(" ")
      }
    >
      {/* Logo/Title */}
      <div className="hidden md:flex items-center justify-center h-16 border-b border-border px-6">
        <span className="text-xl font-bold tracking-tight">Doc2Readable</span>
      </div>
      {/* Mobile logo/title */}
      <div className="md:hidden flex-1 flex items-center justify-center h-full">
        <span className="text-lg font-bold tracking-tight">Doc2Readable</span>
      </div>
      {/* Nav buttons */}
      <div className="flex-1 flex md:flex-col gap-2 md:gap-4 md:py-8 md:px-4 px-2 md:items-stretch items-center justify-center">
        <Button
          variant={active === "markdown" ? "default" : "outline"}
          className="text-base font-semibold px-4 w-full md:w-auto"
          onClick={() => onSelect("markdown")}
        >
          Doc to Markdown
        </Button>
        <Button
          variant={active === "rag" ? "default" : "outline"}
          className="text-base font-semibold px-4 w-full md:w-auto"
          onClick={() => onSelect("rag")}
        >
          Doc to RAG-Doc
        </Button>
      </div>
      {/* Mode toggle: right on mobile, bottom on sidebar */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 md:static md:translate-y-0 md:mt-auto md:mb-6 md:flex md:justify-center">
        <ModeToggle />
      </div>
    </nav>
  );
};
