# PowerShell script to remove PageSEO from all page.tsx files
# This fixes the Soft 404 issue by removing the broken PageSEO component

Write-Host "🔧 Fixing PageSEO in all pages..." -ForegroundColor Cyan

# List of all page files that need fixing
$pages = @(
    "src\app\services\web-design\page.tsx",
    "src\app\services\web-development\page.tsx",
    "src\app\services\ecommerce\page.tsx",
    "src\app\services\seo\page.tsx",
    "src\app\services\booking\page.tsx",
    "src\app\services\portfolio\page.tsx",
    "src\app\barbers\page.tsx",
    "src\app\builders\page.tsx",
    "src\app\cleaning\page.tsx",
    "src\app\electricians\page.tsx",
    "src\app\plumbers\page.tsx",
    "src\app\removals\page.tsx",
    "src\app\restaurants\page.tsx",
    "src\app\trades\page.tsx",
    "src\app\marketing\page.tsx",
    "src\app\ecommerce\page.tsx",
    "src\app\pages\page.tsx",
    "src\app\information\page.tsx",
    "src\app\request-quote\page.tsx",
    "src\app\privacy-policy\page.tsx",
    "src\app\terms-of-service\page.tsx"
)

$fixed = 0
$skipped = 0

foreach ($page in $pages) {
    $fullPath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $fullPath) {
        Write-Host "  Processing: $page" -ForegroundColor Yellow
        
        # Read the file
        $content = Get-Content $fullPath -Raw
        
        # Check if PageSEO is present
        if ($content -match "PageSEO") {
            # Remove the import line
            $content = $content -replace "import PageSEO from '@/components/seo/page-seo'\r?\n", ""
            
            # Remove the PageSEO component usage (multi-line)
            # Pattern 1: <PageSEO ... /> (single line)
            $content = $content -replace "\s*<PageSEO[^>]*/>", ""
            
            # Pattern 2: <PageSEO ... > ... </PageSEO> (multi-line)
            $content = $content -replace "(?s)\s*<PageSEO[^>]*>.*?</PageSEO>", ""
            
            # Pattern 3: <PageSEO with props spread over multiple lines
            $content = $content -replace "(?s)\s*<PageSEO\s+[^/]*?/>", ""
            
            # Save the file
            Set-Content -Path $fullPath -Value $content -NoNewline
            
            Write-Host "    ✅ Fixed: $page" -ForegroundColor Green
            $fixed++
        } else {
            Write-Host "    ⏭️  Skipped (no PageSEO): $page" -ForegroundColor Gray
            $skipped++
        }
    } else {
        Write-Host "    ⚠️  Not found: $page" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Complete!" -ForegroundColor Green
Write-Host "  Fixed: $fixed files" -ForegroundColor Cyan
Write-Host "  Skipped: $skipped files" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test locally: npm run dev" -ForegroundColor White
Write-Host "  2. Deploy: git add . then git commit then git push" -ForegroundColor White
