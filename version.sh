#!/bin/bash

# Version Management Script for Lojikon Website
# Usage: ./version.sh [major|minor|patch] [commit_message]

VERSION_FILE="VERSION"
CHANGELOG_FILE="CHANGELOG.md"

# Function to read current version
get_current_version() {
    if [ -f "$VERSION_FILE" ]; then
        cat "$VERSION_FILE"
    else
        echo "0.0.0"
    fi
}

# Function to increment version
increment_version() {
    local version=$1
    local increment_type=$2
    
    IFS='.' read -ra VERSION_PARTS <<< "$version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $increment_type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            echo "Invalid increment type. Use: major, minor, or patch"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Function to update changelog
update_changelog() {
    local new_version=$1
    local commit_message=$2
    local date=$(date +"%Y-%m-%d")
    
    if [ ! -f "$CHANGELOG_FILE" ]; then
        cat > "$CHANGELOG_FILE" << EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

EOF
    fi
    
    # Add new version entry
    sed -i "s/## \[Unreleased\]/## [Unreleased]\n\n## [$new_version] - $date\n- $commit_message\n\n## [Unreleased]/" "$CHANGELOG_FILE"
}

# Main script logic
if [ $# -lt 1 ]; then
    echo "Usage: $0 [major|minor|patch] [commit_message]"
    echo "Examples:"
    echo "  $0 patch 'Fix hero slider animation'"
    echo "  $0 minor 'Add new intralogistics animation'"
    echo "  $0 major 'Complete website redesign'"
    exit 1
fi

increment_type=$1
commit_message=${2:-"Version update"}

current_version=$(get_current_version)
new_version=$(increment_version "$current_version" "$increment_type")

echo "Current version: $current_version"
echo "New version: $new_version"
echo "Commit message: $commit_message"

# Update version file
echo "$new_version" > "$VERSION_FILE"

# Update changelog
update_changelog "$new_version" "$commit_message"

# Git operations
echo "Adding files to git..."
git add .

echo "Committing changes..."
git commit -m "v$new_version: $commit_message"

echo "Creating git tag..."
git tag -a "v$new_version" -m "Version $new_version: $commit_message"

echo "Version $new_version has been committed and tagged!"
echo "To push to GitHub, run:"
echo "  git push origin main"
echo "  git push origin v$new_version" 