#!/bin/sh
cd "$(pwd)/src"
export PYTHONPATH="$(pwd):$PYTHONPATH"
PYTHONBUFFERED=1 python commands/crawl.py
