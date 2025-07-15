import { fetchHtml } from "../fetch-html.js";
import { splitReadableDocs } from "../doc-to-readable.js";

async function runTest() {
  const url =
    "https://raw.githubusercontent.com/ilyashusterman/doc-to-readable/refs/heads/main/docs/index.html";
  try {
    const html = await fetchHtml(url);
    if (typeof html !== "string") throw new Error("Result is not a string");
    if (!/<html[\s>]/i.test(html))
      throw new Error("HTML does not contain <html> tag");
    if (!/doc-to-readable/i.test(html))
      throw new Error("HTML does not contain project name");
    console.debug("\n✅ fetch-html standalone test passed!");
    console.debug("--- HTML snippet ---\n", html.slice(0, 300), "...\n");

    const docs = await splitReadableDocs(url, { type: "url" });
    console.debug("\n✅ splitReadableDocs output:");
    console.debug(JSON.stringify(docs, null, 2));
  } catch (err) {
    console.debug("\n❌ fetch-html standalone test failed:");
    console.debug(err);
    process.exit(1);
  }
}

runTest();
