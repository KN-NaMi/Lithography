#!/bin/bash

browser="chromium-browser"
arguments="--kiosk --incognito"
log_file="display.log"
prev_log_file="display.log.bak"

while getopts "hb:a:l:p:" opt; do
	case "$opt" in
		h) echo "$0 [-h] [-b <browser>] [-a <browser arguments>] [-l <log file>] [-p <backup log file>]"; exit 0 ;;
		b) browser="$OPTARG" ;;
		a) arguments="$OPTARG" ;;
		l) log_file="$OPTARG" ;;
		p) prev_log_file="$OPTARG" ;;
		*) echo "$0 is not an argument ;/"; exit 1 ;;
	esac
done

if [[ -n "$DISPLAY" ]]; then
	echo "Display $DISPLAY found"
	if [[ -f "$log_file" ]]; then
		mv "$log_file" "$prev_log_file"
	fi
	echo "Logging to $log_file"
	"$browser" $arguments "http://localhost:8000/mask/view" &> "$log_file"
else
	echo "No display found"
fi

