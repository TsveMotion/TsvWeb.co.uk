$old = "src\app\admin\portfolio\[id]\page.tsx"
$new = "src\app\admin\portfolio\[id]\page-new.tsx"

Write-Host "Checking files..."
Write-Host "Old exists: $(Test-Path $old)"
Write-Host "New exists: $(Test-Path $new)"

if (Test-Path $old) {
    Remove-Item $old -Force
    Write-Host "Deleted old file"
}

if (Test-Path $new) {
    Rename-Item $new "page.tsx" -Force
    Write-Host "Activated new file"
}

Write-Host ""
Write-Host "DONE! Refresh browser!"
