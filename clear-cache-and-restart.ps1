# Clear Next.js cache and restart dev server
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Cyan

# Remove .next directory
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Removed .next directory" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next directory not found" -ForegroundColor Yellow
}

# Remove node_modules/.cache if it exists
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Removed node_modules/.cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now restart your dev server with:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or if it's already running, stop it (Ctrl+C) and restart it." -ForegroundColor Cyan
