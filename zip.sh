#!/bin/bash

set -e

MANIFEST="manifest.json"
MANIFEST_V2="manifest.json_v2"
MANIFEST_V3="manifest.json_v3"
Extension_NAME="Dark_CPI"
BIN_DIR="./bin"

log_message() {
    local message="$1"
    local timestamp
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $message"
}

log_message "Copy readme to docs. Readme.md"
cp README.md docs/readme/README.md

log_message "----------------------"
log_message "Starting zip creation process"

if [ ! -d "$BIN_DIR" ]; then
    log_message "Creating bin directory..."
    mkdir -p "$BIN_DIR"
fi

if [ -d "$BIN_DIR" ]; then
  # delete all files and subdirectories in the directory
  log_message "deleting zip files from bin directory..."
  rm -rf "$BIN_DIR"/*
fi

create_zip() {
    local manifest_file="$1"
    local version_name="$2"
    local output_zip="$3"

    log_message "Creating ZIP for $version_name using $manifest_file..."

    name=""
    version=""

    while IFS='' read -r line || [[ -n "$line" ]]; do
        if [[ "$line" == *"\"name\":"* ]]; then
            name=$(echo "$line" | awk -F'"' '{print $4}')
        elif [[ "$line" == *"\"version\":"* ]]; then
            version=$(echo "$line" | awk -F'"' '{print $4}' | tr -d ',')
        fi
    done < "$manifest_file"

    name="${name//,/}"
    name="${name// /_}"

    exclusions=("./docs/*" "./node_modules" "*.sh" "./bin/*" "*.md" "./.*")

    exclude_args=()
    for pattern in "${exclusions[@]}"; do
        exclude_args+=(-o -path "$pattern")
    done
    exclude_args=( "${exclude_args[@]:1}" )

    rm -f "./bin/$output_zip"

    files_to_zip=$(find . -type f ! \( "${exclude_args[@]}" \))
    
    if [ -z "$files_to_zip" ]; then
        log_message "No files found to zip for $version_name. Exiting."
        exit 1
    fi

    echo "$files_to_zip" | zip -@ "bin/$output_zip"

    log_message "ZIP file created: bin/$output_zip"
}

process_manifest() {
    local manifest_file="$1"
    local version_name="$2"
    local output_zip="$3"

    if [ -f "$manifest_file" ]; then
        log_message "$version_name manifest found."
        create_zip "$manifest_file" "$version_name" "$output_zip"
    else
        log_message "$version_name manifest not found. Skipping."
    fi
}

log_message "Checking manifest.json for version"
manifest_version=$(jq -r '.manifest_version' manifest.json)

if [ "$manifest_version" == "3" ]; then
    log_message "Manifest version 3 detected (Chrome)"
    create_zip "$MANIFEST" "Chrome" ""$Extension_NAME".zip"
elif [ "$manifest_version" == "2" ]; then
    log_message "Manifest version 2 detected (Firefox)"
    create_zip "$MANIFEST" "Firefox" ""$Extension_NAME"_v2.zip"
else
    log_message "Unknown or unsupported manifest version in manifest.json!"
    exit 1
fi

# Process optional manifest.json_v2 and manifest.json_v3 files if they exist
process_manifest "$MANIFEST_V2" "Firefox" ""$Extension_NAME"_v2.zip"
process_manifest "$MANIFEST_V3" "Chrome" ""$Extension_NAME".zip"

log_message "ZIP creation process completed."
