#!/bin/bash

BASE_DIR="./public/filaments"
MAP_FILE="./rename_map.txt"

while IFS="|" read -r src target; do
    if [ -f "$BASE_DIR/$src" ]; then
        echo "Renaming '$src' → '$target'"
        mv "$BASE_DIR/$src" "$BASE_DIR/$target"
    else
        echo "⚠️  Source file not found: $src"
    fi
done < "$MAP_FILE"

echo "Rename complete."
