const fs = require("fs");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");

async function extractTextFromFile(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed?.text || "";
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  }

  return "";
}

module.exports = { extractTextFromFile };
