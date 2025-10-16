$old = "src\app\admin\portfolio\`[id`]\page.tsx"
$new = "src\app\admin\portfolio\`[id`]\page-new.tsx"

Write-Host "Files found:"
Write-Host "  Old: $(Test-Path $old)"
Write-Host "  New: $(Test-Path $new)"
Write-Host ""

if (Test-Path $old) {
    Remove-Item $old -Force
    Write-Host "Deleted old edit page"
}

if (Test-Path $new) {
    Rename-Item $new "page.tsx" -Force
    Write-Host "Activated new edit page!"
    Write-Host ""
    Write-Host "SUCCESS! The edit page now has:"
    Write-Host "  - Beautiful modern design"
    Write-Host "  - Working image uploads"
    Write-Host "  - Preview mode"
    Write-Host "  - Same style as create page"
    Write-Host ""
    Write-Host "Refresh your browser to see it!"
}
