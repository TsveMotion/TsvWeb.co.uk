$source = "src/app/admin/blog/[id]/page-new.tsx"
$dest = "src/app/admin/blog/[id]/page.tsx"

if (Test-Path $dest) {
    Remove-Item $dest -Force
}

if (Test-Path $source) {
    Copy-Item $source $dest -Force
    Write-Host "Successfully copied new blog edit page!"
} else {
    Write-Host "Source file not found: $source"
}
