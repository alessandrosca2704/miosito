import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function pageItemsToLines(items) {
  const rows = new Map();

  items.forEach((item) => {
    if (!item.str || !item.str.trim()) {
      return;
    }

    const transform = item.transform || [];
    const x = transform[4] || 0;
    const y = transform[5] || 0;
    const key = Math.round(y * 2) / 2;

    if (!rows.has(key)) {
      rows.set(key, []);
    }

    rows.get(key).push({ x, text: item.str.trim() });
  });

  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, row]) =>
      row
        .sort((a, b) => a.x - b.x)
        .map((part) => part.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}

export async function extractPdfText(file) {
  const data = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data,
    disableFontFace: true,
    isEvalSupported: false,
  });
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = pageItemsToLines(content.items);
    pages.push(`--- Pagina ${pageNumber} ---\n${lines.join("\n")}`);
  }

  return pages.join("\n\n");
}
