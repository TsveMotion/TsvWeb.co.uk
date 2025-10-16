$editOld = "src/app/admin/portfolio/[id]/page-old.tsx.bak"
$editCurrent = "src/app/admin/portfolio/[id]/page.tsx"
$editNew = "src/app/admin/portfolio/[id]/page-new.tsx"

if (Test-Path $editOld) {
    Remove-Item $editOld -Force
    Write-Host "Removed old backup"
}

if (Test-Path $editCurrent) {
    Rename-Item $editCurrent "page-old.tsx.bak" -Force
    Write-Host "Backed up current edit page"
}

if (Test-Path $editNew) {
    Rename-Item $editNew "page.tsx" -Force
    Write-Host "Activated new edit page"
}

Write-Host ""
Write-Host "DONE! Refresh your browser to see the new design!"
