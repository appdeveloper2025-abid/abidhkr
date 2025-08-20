# PowerShell script to update all USA Hunter references to ABID HACKER
$rootPath = "C:\Users\Abid Mehmood\Desktop\kali linux\usa-hunter-website"

# Get all HTML, JS, CSS, MD, and YML files
$files = Get-ChildItem -Path $rootPath -Recurse -Include *.html,*.js,*.css,*.md,*.yml

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -and $content -match "USA Hunter") {
        Write-Host "Updating: $($file.FullName)"
        $updatedContent = $content -replace "USA Hunter", "ABID HACKER"
        Set-Content -Path $file.FullName -Value $updatedContent -NoNewline
    }
}

Write-Host "Branding update completed!"
