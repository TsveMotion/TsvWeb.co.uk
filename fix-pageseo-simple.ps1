# Simple script to remove PageSEO from all pages
Write-Host "Fixing PageSEO in all pages..." -ForegroundColor Cyan

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

foreach ($page in $pages) {
    $fullPath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $page" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        
        if ($content -match "PageSEO") {
            $content = $content -replace "import PageSEO from '@/components/seo/page-seo'\r?\n", ""
            $content = $content -replace "\s*<PageSEO[^>]*/>", ""
            $content = $content -replace "(?s)\s*<PageSEO[^>]*>.*?</PageSEO>", ""
            $content = $content -replace "(?s)\s*<PageSEO\s+[^/]*?/>", ""
            
            Set-Content -Path $fullPath -Value $content -NoNewline
            
            Write-Host "  Fixed!" -ForegroundColor Green
            $fixed++
        }
    }
}

Write-Host ""
Write-Host "Complete! Fixed $fixed files" -ForegroundColor Green
