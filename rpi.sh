#!/bin/sh
ROONDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PATH="/usr/local/bin:$PATH"

cd "$ROONDIR" && \
  node picker.js && \
  ./restart-desktop.sh

cd -
