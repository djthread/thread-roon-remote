#!/bin/sh
ROONDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

forever stop desktop.js ; \
forever start -a \
  -l "$ROONDIR/log/forever.log" \
  -o "$ROONDIR/log/out.log" \
  -e "$ROONDIR/log/err.log" \
  desktop.js
