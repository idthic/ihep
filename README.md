# ihep

A small CLI tool to download and open PDF files of papers.

Do you download the PDF file of the same paper many times because you forgot
where you store the specific PDF?  This small tool defines the central
repository of the PDF files in your home directory and allow managing the PDF
files.

# Prerequisites

- `rsync`
- `node` (Node.js)

In Windows, Node.js can be set up by following Ref. [1]:

- [1] [Set up Node.js on native Windows | Microsoft Learn](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)

# Usage

## Download PDF

If the PDF hasn't yet been downloaded, it will be downloaded in the cache
directory. Then the path to the PDF file is printed.

```bash
# using arXiv number
ihep fulltext 1904.11217

# using INSPIRE texkey
ihep fulltext Murase:2019cwc
```

## Open PDF

You can directory open the PDF file.  If the PDF file is not found, it
automatically downloads the PDF from arXiv (or another repository if
available) and then open the PDF file.

```bash
ihep open Murase:2019cwc
```

To specify the command to open the PDF file, you can set a variable
`_ihep_config_open_cmd_pdf` in `~/.config/ihep/config.bash`.  One may instead
set a variable `_ihep_config_open_cmd` for a general resolver.
