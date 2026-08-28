#!/usr/bin/env bash
# Weekly backup of local GitHub working copies → Google Drive.
# Source of truth is GitHub + ~/Documents/Mkweli.tech. Drive is backup only.
set -euo pipefail

SRC="${MKWELI_SRC:-$HOME/Documents/Mkweli.tech}"
DEST="${MKWELI_GDRIVE_BACKUP:-$HOME/GoogleDrive/master folder/mkweli-weekly-backup}"
STAMP="$(date +%Y-%m-%d)"
LOG="$DEST/backup.log"

mkdir -p "$DEST"

rsync -a --delete \
  --exclude '.gradle/' \
  --exclude 'build/' \
  --exclude 'node_modules/' \
  --exclude '.kotlin/' \
  --exclude '*.apk' \
  --exclude 'local.properties' \
  --exclude 'keystore.properties' \
  --exclude '*.jks' \
  --exclude '*.keystore' \
  "$SRC/" "$DEST/current/"

{
  echo "$STAMP  backup ok  $(hostname)  $SRC -> $DEST/current"
} >> "$LOG"

# Keep a dated snapshot of git HEADs so restore knows what was on disk.
{
  echo "# $STAMP"
  for repo in "$SRC"/*/.git; do
    [ -d "$repo" ] || continue
    dir="$(dirname "$repo")"
    name="$(basename "$dir")"
    printf '%s  %s\n' "$name" "$(git -C "$dir" rev-parse --short HEAD 2>/dev/null || echo none)"
  done
} > "$DEST/current/BACKUP_HEADS.txt"
