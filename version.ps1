# Version Management Script for Lojikon Website (PowerShell)
# Usage: .\version.ps1 [major|minor|patch] [commit_message]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("major", "minor", "patch")]
    [string]$IncrementType,
    
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Version update"
)

$VERSION_FILE = "VERSION"
$CHANGELOG_FILE = "CHANGELOG.md"

# Function to read current version
function Get-CurrentVersion {
    if (Test-Path $VERSION_FILE) {
        return Get-Content $VERSION_FILE
    } else {
        return "0.0.0"
    }
}

# Function to increment version
function Increment-Version {
    param(
        [string]$Version,
        [string]$IncrementType
    )
    
    $versionParts = $Version.Split('.')
    $major = [int]$versionParts[0]
    $minor = [int]$versionParts[1]
    $patch = [int]$versionParts[2]
    
    switch ($IncrementType) {
        "major" {
            $major++
            $minor = 0
            $patch = 0
        }
        "minor" {
            $minor++
            $patch = 0
        }
        "patch" {
            $patch++
        }
    }
    
    return "$major.$minor.$patch"
}

# Function to update changelog
function Update-Changelog {
    param(
        [string]$NewVersion,
        [string]$CommitMessage
    )
    
    $date = Get-Date -Format "yyyy-MM-dd"
    
    if (-not (Test-Path $CHANGELOG_FILE)) {
        $changelogContent = @"
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

"@
        Set-Content -Path $CHANGELOG_FILE -Value $changelogContent
    }
    
    $changelogContent = Get-Content $CHANGELOG_FILE -Raw
    $newEntry = @"

## [$NewVersion] - $date
- $CommitMessage

## [Unreleased]
"@
    
    $updatedContent = $changelogContent -replace "## \[Unreleased\]", $newEntry
    Set-Content -Path $CHANGELOG_FILE -Value $updatedContent
}

# Main script logic
Write-Host "=== Lojikon Website Version Manager ===" -ForegroundColor Cyan

$currentVersion = Get-CurrentVersion
$newVersion = Increment-Version -Version $currentVersion -IncrementType $IncrementType

Write-Host "Current version: $currentVersion" -ForegroundColor Yellow
Write-Host "New version: $newVersion" -ForegroundColor Green
Write-Host "Commit message: $CommitMessage" -ForegroundColor Yellow
Write-Host ""

# Update version file
Set-Content -Path $VERSION_FILE -Value $newVersion
Write-Host "✓ Version file updated" -ForegroundColor Green

# Update changelog
Update-Changelog -NewVersion $newVersion -CommitMessage $CommitMessage
Write-Host "✓ Changelog updated" -ForegroundColor Green

# Git operations
Write-Host "Adding files to git..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
$commitMsg = "v$newVersion`: $CommitMessage"
git commit -m $commitMsg

Write-Host "Creating git tag..." -ForegroundColor Cyan
$tagMsg = "Version $newVersion`: $CommitMessage"
git tag -a "v$newVersion" -m $tagMsg

Write-Host ""
Write-Host "✓ Version $newVersion has been committed and tagged!" -ForegroundColor Green
Write-Host ""
Write-Host "To push to GitHub, run:" -ForegroundColor Cyan
Write-Host "  git push origin main" -ForegroundColor White
Write-Host ("  git push origin v" + $newVersion) -ForegroundColor White 