const fs = require("fs");

function print_variable(var_name, val) {
  val = val.replace(/'/g, '\'\\\'\'');
  console.log(`${var_name}='${val}'`);
}

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

if (!hit.id) {
  console.error("FATAL hit.id is not found");
  process.exit(3);
}

if (!hit.metadata) {
  console.error("FATAL hit.metadata is not found");
  process.exit(3);
}
const metadata = hit.metadata;

// print inspirehep literature id
print_variable('inspire', hit.id);

// texkey
if (metadata.texkeys && metadata.texkeys[0]) {
  const texkey = metadata.texkeys[0];
  print_variable('texkey', texkey);
}

// url: the URL to the full text
if (metadata.arxiv_eprints && metadata.arxiv_eprints[0]) {
  const arxiv_number = metadata.arxiv_eprints[0].value;
  print_variable('url', `https://arxiv.org/pdf/${arxiv_number}`);
  print_variable('arxiv', arxiv_number);
} else if (metadata.documents) {
  const fulls = metadata.documents.filter(e => e.fulltext);
  if (fulls[0])
    print_variable('url', fulls[0].url);
}

// title
if (metadata.titles && metadata.titles[0]) {
  print_variable('title', metadata.titles[0].title);
}

// authors
if (metadata.authors && metadata.authors.length) {
  const authors = [];
  metadata.authors.forEach(author => {
    if (author.full_name) {
      var full_name = author.full_name;
      const m = full_name.match(/^(.*), (.*)$/);
      if (m) full_name = `${m[2]} ${m[1]}`;
      authors.push(full_name);
    }
  });
  if (authors.length)
    print_variable('authors', authors.join(', '));
}

// abstract
if (metadata.abstracts && metadata.abstracts[0]) {
  print_variable('abstract', metadata.abstracts[0].value);
}
