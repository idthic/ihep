const fs = require("fs");

if (process.argv.length < 2) {
  console.error("usage: node inspire-print-search-resut.js <search.json>");
  process.exit(2);
}
const input_filename = process.argv[2];

const json = JSON.parse(fs.readFileSync(input_filename, "utf8"));

if (!json.hits || !json.hits.hits || !json.hits.hits.length) {
  console.error("no item is found");
  process.exit(1);
}

json.hits.hits.forEach(hit => {
  if (!hit.id) {
    console.error("FATAL hit.id is not found");
    process.exit(3);
  }

  if (!hit.metadata) {
    console.error("FATAL hit.metadata is not found");
    process.exit(3);
  }
  const metadata = hit.metadata;

  //print_variable('inspire', hit.id);

  // texkey
  if (!metadata.texkeys || !metadata.texkeys[0]) return;
  const texkey = metadata.texkeys[0];

  // title
  const title = metadata.titles && metadata.titles[0] && metadata.titles[0].title || '<unknown>';

  // authors
  var authors = '';
  if (metadata.authors && metadata.authors.length) {
    const author_list = [];
    metadata.authors.forEach(author => {
      if (author.full_name) {
        var full_name = author.full_name;
        const m = full_name.match(/^(.*), (.*)$/);
        if (m) full_name = `${m[2]} ${m[1]}`;
        author_list.push(full_name);
      }
    });
    authors = author_list.join(', ');

    if (authors.length > 200)
      authors = authors.slice(0, 200).replace(/, [^,]*$/, "") + ' et al.';
  }

  // // abstract
  // if (metadata.abstracts && metadata.abstracts[0]) {
  //   print_variable('abstract', metadata.abstracts[0].value);
  // }

  console.log(`\x1b[1;35m${texkey}\x1b[m \x1b[1m${title}\x1b[m`);
  console.log(`  \x1b[34m${authors}\x1b[m`);
});
