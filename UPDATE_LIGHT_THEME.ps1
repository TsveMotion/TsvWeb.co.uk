# Update Settings page for light theme support
$file = "src\app\admin\settings\page.tsx"
$content = Get-Content $file -Raw

# Replace all instances
$content = $content -replace 'text-gray-300 mb-2">', 'text-gray-700 dark:text-gray-300 mb-2">'
$content = $content -replace 'bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500', 'bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
$content = $content -replace 'bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover', 'bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-6 hover shadow-lg dark:shadow-none'

Set-Content $file $content
Write-Host "Light theme support added!" -ForegroundColor Green
