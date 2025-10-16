# Activate new portfolio pages

# 1. Activate list page
$listOld = "src/app/admin/portfolio/page.tsx"
$listNew = "src/app/admin/portfolio/page-new.tsx"

if (Test-Path $listOld) {
    Rename-Item $listOld "page-old.tsx.bak" -Force
    Write-Host "✓ Backed up old list page"
}

if (Test-Path $listNew) {
    Rename-Item $listNew "page.tsx" -Force
    Write-Host "✓ Activated new list page"
}

# 2. Activate edit page
$editOld = "src/app/admin/portfolio/[id]/page.tsx"
$editNew = "src/app/admin/portfolio/[id]/page-new.tsx"

if (Test-Path $editOld) {
    Rename-Item $editOld "page-old.tsx.bak" -Force
    Write-Host "✓ Backed up old edit page"
}

if (Test-Path $editNew) {
    Rename-Item $editNew "page.tsx" -Force
    Write-Host "✓ Activated new edit page"
}

Write-Host ""
Write-Host "✅ Portfolio pages upgraded successfully!"
Write-Host "   - List page: Modern design with stats & filters"
Write-Host "   - Create page: Beautiful form with image uploads"
Write-Host "   - Edit page: Same design with data loading"
