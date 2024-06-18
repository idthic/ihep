const fs = require("fs");

if (process.argv.length < 2) {
  console.error("usage: node download-pdf.js <search.json>");
  process.exit(2);
}
const input_filename = process.argv[2];

const json = JSON.parse(fs.readFileSync(input_filename, "utf8"));

if (!json.hits || !json.hits.hits || !json.hits.hits[0]) {
  console.error("no item is found");
  process.exit(1);
} else if (json.hits.hits.length != 1) {
  console.error("Query is ambiguous. Multiple articles are found.");
  process.exit(1);
}
const hit = json.hits.hits[0];

if (!hit.metadata) {
  console.error("FATAL hit.metadata is not found");
  process.exit(3);
}
const metadata = hit.metadata;

// determine the key
if (metadata.texkeys && metadata.texkeys[0]) {
  const key = metadata.texkeys[0];
  console.log(`key='${key}'`);
}

// determine the URL to the full text
if (metadata.arxiv_eprints && metadata.arxiv_eprints[0]) {
  const arxiv_number = metadata.arxiv_eprints[0].value;
  console.log(`url='https://arxiv.org/pdf/${arxiv_number}'`);
} else if (metadata.documents) {
  const fulls = metadata.documents.filter(e => e.fulltext);
  if (fulls[0])
    console.log(`url='${fulls[0].url}'`);
}
