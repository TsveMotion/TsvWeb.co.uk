# Create WordPress plugin zip with correct structure
# The zip must contain: tsvweb-monitor/tsvweb-monitor.php (not just the files)

$ErrorActionPreference = "Stop"

# Paths
$sourceFolder = "wordpress-plugin\tsvweb-monitor"
$tempFolder = "temp-zip-build"
$outputZip = "public\wordpress-plugin\tsvweb-monitor.zip"

# Clean up any existing temp folder
if (Test-Path $tempFolder) {
    Remove-Item $tempFolder -Recurse -Force
}

# Clean up existing zip
if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
}

# Create temp folder structure
New-Item -ItemType Directory -Path $tempFolder -Force | Out-Null
New-Item -ItemType Directory -Path "$tempFolder\tsvweb-monitor" -Force | Out-Null

# Copy all files from source to temp/tsvweb-monitor/
Copy-Item -Path "$sourceFolder\*" -Destination "$tempFolder\tsvweb-monitor\" -Recurse -Force

# Create zip from temp folder (this will have tsvweb-monitor/ at root)
Compress-Archive -Path "$tempFolder\tsvweb-monitor" -DestinationPath $outputZip -Force

# Clean up temp folder
Remove-Item $tempFolder -Recurse -Force

Write-Host "✓ Plugin zip created successfully at: $outputZip" -ForegroundColor Green
Write-Host "✓ Zip structure: tsvweb-monitor/tsvweb-monitor.php" -ForegroundColor Green
