#!/bin/bash

# 2024-06-18
_arx_user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
_arx_archive=./archive
_arx_base_run=./tmp

function string#match { [[ $1 =~ $2 ]]; }

function mkd {
  if [[ $1 && ! -d $1 ]]; then
    mkdir -p "$1"
  fi
}
function mkfd {
  if [[ $1 == */* ]]; then
    mkd "${1%/*}"
  fi
}

function dl {
  local url=$1 dst=$2
  local referer=
  if [[ $_arx_cookies ]]; then
    mkfd "$_arx_cookies"
    >> "$_arx_cookies"
  fi
  wget \
    --no-verbose --show-progress \
    --user-agent="$_arx_user_agent" ${referer:+--referer="$REFERER"} \
    ${_arx_cookies:+--load-cookies "$_arx_cookies" --save-cookies "$_arx_cookies" --keep-session-cookies} \
    -4 --retry-on-http-error=522,524 -t 5 \
    "$url" -O "$dst.part" &&
    mv "$dst.part" "$dst"
}

function dl-inspirehep {
  local _arx_cookies=$_arx_base_run/inspirehep.cookies.txt
  dl "$@"
}

function main {
  local search_url=
  if string#match "$1" '^(ar[Xx]iv:)?([0-9]{4}\.[0-9]{4,5})$'; then
    # arXiv
    search_url='https://inspirehep.net/api/literature?sort=mostrecent&size=25&page=1&q=arXiv%3A'${BASH_REMATCH[2]}
  elif string#match "$1" '^([A-Z][a-zA-Z0-9]+):?((19|20)[0-9]{2}[a-z]{3})$'; then
    # inspirehep TeX key
    local key=${BASH_REMATCH[1]}:${BASH_REMATCH[2]}
    search_url='https://inspirehep.net/api/literature?sort=mostrecent&size=25&page=1&q='$key
  else
    printf '%s\n' "unrecognized query '$1'" >&2
    return 2
  fi
  
  local tmp1=$_arx_base_run/search.json
  mkfd "$tmp1"
  dl-inspirehep "$search_url" "$tmp1"

  local metadata
  if ! metadata=$(node inspirehep-extract-metadata.js "$tmp1"); then
    printf '%s\n' "failed to call inspirehep-extract-metadata" >&2
    return 1
  fi

  local key= url=
  builtin eval -- "$metadata"

  if [[ ! $key ]]; then
    printf '%s\n' 'failed to determine the key' >&2
    return 1
  fi
  local filename=$_arx_archive/${key//:}.pdf
  if [[ -s $filename ]]; then
    # file already exists
    printf '%s\n' "$filename"
    return 0
  fi

  if [[ ! $url ]]; then
    printf '%s\n' 'failed to determine the full text URL' >&2
    return 1
  fi
  mkd "$_arx_archive"
  if ! dl "$url" "$filename"; then
    printf '%s\n' 'failed to download the file.' >&2
    printf '%s\n' "url=$url" >&2
    return 1
  fi
  printf '%s\n' "$filename"
}

main "$@"
