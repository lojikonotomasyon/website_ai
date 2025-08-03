# Simple Version Management Script for Lojikon Website
# Usage: .\version-simple.ps1 [major|minor|patch] [commit_message]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("major", "minor", "patch")]
    [string]$IncrementType,
    
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Version update"
)

$VERSION_FILE = "VERSION"
$CHANGELOG_FILE = "CHANGELOG.md"

# Get current version
function Get-CurrentVersion {
    if (Test-Path $VERSION_FILE) {
        return Get-Content $VERSION_FILE
    } else {
        return "0.0.0"
    }
}

# Increment version
function Increment-Version {
    param([string]$Version, [string]$IncrementType)
    
    $parts = $Version.Split('.')
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]
    
    switch ($IncrementType) {
        "major" { $major++; $minor = 0; $patch = 0 }
        "minor" { $minor++; $patch = 0 }
        "patch" { $patch++ }
    }
    
    return "$major.$minor.$patch"
}

# Update changelog
function Update-Changelog {
    param([string]$NewVersion, [string]$CommitMessage)
    
    $date = Get-Date -Format "yyyy-MM-dd"
    
    if (-not (Test-Path $CHANGELOG_FILE)) {
        $content = "# Changelog`n`nAll notable changes to this project will be documented in this file.`n`n## [Unreleased]`n"
        Set-Content -Path $CHANGELOG_FILE -Value $content
    }
    
    $content = Get-Content $CHANGELOG_FILE -Raw
    $newEntry = "`n## [$NewVersion] - $date`n- $CommitMessage`n`n## [Unreleased]"
    $updated = $content -replace "## \[Unreleased\]", $newEntry
    Set-Content -Path $CHANGELOG_FILE -Value $updated
}

# Main execution
Write-Host "=== Lojikon Website Version Manager ===" -ForegroundColor Cyan

$currentVersion = Get-CurrentVersion
$newVersion = Increment-Version -Version $currentVersion -IncrementType $IncrementType

Write-Host "Current version: $currentVersion" -ForegroundColor Yellow
Write-Host "New version: $newVersion" -ForegroundColor Green
Write-Host "Commit message: $CommitMessage" -ForegroundColor Yellow
Write-Host ""

# Update files
Set-Content -Path $VERSION_FILE -Value $newVersion
Write-Host "Version file updated" -ForegroundColor Green

Update-Changelog -NewVersion $newVersion -CommitMessage $CommitMessage
Write-Host "Changelog updated" -ForegroundColor Green

# Git operations
Write-Host "Adding files to git..." -ForegroundColor Cyan
git add .

$commitMsg = "v$newVersion`: $CommitMessage"
Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m $commitMsg

$tagMsg = "Version $newVersion`: $CommitMessage"
Write-Host "Creating git tag..." -ForegroundColor Cyan
git tag -a "v$newVersion" -m $tagMsg

Write-Host ""
Write-Host "Version $newVersion has been committed and tagged!" -ForegroundColor Green
Write-Host ""
Write-Host "To push to GitHub, run:" -ForegroundColor Cyan
Write-Host "  git push origin main" -ForegroundColor White
Write-Host "  git push origin v$newVersion" -ForegroundColor White 