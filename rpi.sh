#!/bin/sh
cd ~/apps/thread-roon-remote && \
node picker.js && \
forever stop desktop.js && \
forever start -a -l ~/apps/thread-roon-remote/log/forever.log -o ~/apps/thread-roon-remote/log/out.log -e ~/apps/thread-roon-remote/log/err.log desktop.js && \
cd -
