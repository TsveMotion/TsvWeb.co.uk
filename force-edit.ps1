Set-Location "src/app/admin/portfolio/[id]"

if (Test-Path "page.tsx") {
    Remove-Item "page.tsx" -Force
    Write-Host "Deleted old page.tsx"
}

if (Test-Path "page-new.tsx") {
    Rename-Item "page-new.tsx" "page.tsx" -Force
    Write-Host "Renamed page-new.tsx to page.tsx"
}

Write-Host ""
Write-Host "SUCCESS! Edit page is now using the new beautiful design!"
Write-Host "Refresh your browser to see it!"
