# Activate new portfolio pages

# 1. List page
if (Test-Path "src/app/admin/portfolio/page-old.tsx.bak") {
    Remove-Item "src/app/admin/portfolio/page-old.tsx.bak" -Force
}

if (Test-Path "src/app/admin/portfolio/page.tsx") {
    Rename-Item "src/app/admin/portfolio/page.tsx" "page-old.tsx.bak" -Force
    Write-Host "✓ Backed up old list page"
}

if (Test-Path "src/app/admin/portfolio/page-new.tsx") {
    Rename-Item "src/app/admin/portfolio/page-new.tsx" "page.tsx" -Force
    Write-Host "✓ Activated new list page"
}

# 2. Edit page
if (Test-Path "src/app/admin/portfolio/[id]/page-old.tsx.bak") {
    Remove-Item "src/app/admin/portfolio/[id]/page-old.tsx.bak" -Force
}

if (Test-Path "src/app/admin/portfolio/[id]/page.tsx") {
    Rename-Item "src/app/admin/portfolio/[id]/page.tsx" "page-old.tsx.bak" -Force
    Write-Host "✓ Backed up old edit page"
}

if (Test-Path "src/app/admin/portfolio/[id]/page-new.tsx") {
    Rename-Item "src/app/admin/portfolio/[id]/page-new.tsx" "page.tsx" -Force
    Write-Host "✓ Activated new edit page"
}

Write-Host ""
Write-Host "✅ ALL PORTFOLIO PAGES UPGRADED!"
Write-Host ""
Write-Host "Features:"
Write-Host "  ✓ Modern card-based UI"
Write-Host "  ✓ Working image uploads (blob storage)"
Write-Host "  ✓ Preview mode with HTML rendering"
Write-Host "  ✓ Stats dashboard"
Write-Host "  ✓ Advanced filters"
Write-Host "  ✓ Dark mode support"
Write-Host "  ✓ Responsive design"
