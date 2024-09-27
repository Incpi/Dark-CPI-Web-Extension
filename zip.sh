#!/bin/bash

set -e

MANIFEST="manifest.json"

log_message() {
    local message="$1"
    local timestamp
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $message"
}

log_message "Starting copy readme to docs..."
cp README.md docs/readme/README.md

log_message "----------------------"
log_message "Starting zip creation process"

if [ ! -d "./bin" ]; then
    log_message "Creating bin directory..."
    mkdir -p "./bin"
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

    exclusions=("./docs/*" "*.md" "./node_modules" "*.sh" "./bin/*" "./.*")

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

manifest_version=$(grep -oP '"manifest_version":\s*\K\d+' "$MANIFEST")

if [ "$manifest_version" == "3" ]; then
    log_message "Manifest version 3 detected (Chrome)"
    create_zip "$MANIFEST" "Chrome" "Dark CPI Extension.zip"
else
    log_message "Unknown or unsupported manifest version!"
    exit 1
fi

log_message "Dark CPI Extension.zip created and moved to bin."
