# -*- mode: sh-bash -*-

function _comp_cmd_ihep {
  local cur prev words cword comp_args
  _comp_initialize "$@" || return

  if ((cword == 1)); then
    _comp_compgen_split -l -- "$(ihep help list-subcommand)"
  elif ((cword >= 2)); then
    case ${words[1]} in
    (open)
      _comp_compgen_split -l -- "$(ihep help list-texkey)" ;;
    esac
  fi
}
complete -F _comp_cmd_ihep -o default ihep
