$file = "src/app/admin/portfolio/[id]/page.tsx"
if (Test-Path $file) {
    Remove-Item $file -Force
    Write-Host "Deleted $file"
} else {
    Write-Host "File not found: $file"
}
