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

To specify the command to open the PDF file, you can set a config
`_ihep_config_open_cmd_pdf` or `_ihep_config_open_cmd`.  See the descriptions
of respective config variables.

# Commands

- `ihep install`
- PDF
  - `ihep fulltext <paper>`
  - `ihep open <paper>`
  - `ihep store <file>`
- metadata
  - `ihep search <query>`
  - `ihep header <paper>`
  - `ihep abstract <paper>`
- remote
  - `ihep push`
- `ihep eval <shell command>`

# Configurations

Configurations can be put in `~/.config/ihep/config.bash` for the global
settings, and `.ihepconfig.bash` (or `.ihepconfig.sh`, `.ihepconfig`) for local
settings.  The global setting is, if present, sourced first, and a local
setting, if present, is sourced next.

These are the shell variables that can be set in the configuration files:

- `_ihep_config_remote` ... The SSH login specification for the remote `ihep`
  repository. Optionally the data directory for `ihep` can be suffixed with the
  separator `:`.  For example, `user@host` or `user@host:~/.local/share/ihep`.
- `_ihep_config_open_cmd` ... The general solver to open a file.
- `_ihep_config_open_cmd_pdf` ... The PDF viewer to open a PDF.
- `_ihep_config_project_root` ... The project root directory.  This is supposed
  to be set in a local config.  When a local config file is found, this is set
  to be the directory of the local config file by default.  The local config
  file overwrite the value in itself.  When a local config file is not found,
  this is set to be the current working directory by default.
- `_ihep_config_reference_file` ... The filename to store the reference files.
