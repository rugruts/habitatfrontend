# Habitat Lobby FTP Deployment Script
# Run this script to automatically upload your site to Hostinger

param(
    [Parameter(Mandatory=$true)]
    [string]$FtpPassword
)

$ftpServer = "92.118.18.238"
$ftpUsername = "u148970346.lightcyan-shrew-950743.hostingersite.com"
$localDistPath = "D:\habitat-lobby-trio\dist"
$remotePath = "/public_html/"

Write-Host "🚀 Starting FTP Deployment..." -ForegroundColor Green
Write-Host "📁 Local Path: $localDistPath" -ForegroundColor Yellow
Write-Host "🌐 Server: $ftpServer" -ForegroundColor Yellow
Write-Host "👤 Username: $ftpUsername" -ForegroundColor Yellow

# Check if dist folder exists
if (-not (Test-Path $localDistPath)) {
    Write-Host "❌ Error: dist folder not found at $localDistPath" -ForegroundColor Red
    Write-Host "💡 Make sure you've built the project first with 'npm run build'" -ForegroundColor Yellow
    exit 1
}

# Get all files from dist folder
$files = Get-ChildItem -Path $localDistPath -Recurse -File

Write-Host "📦 Found $($files.Count) files to upload..." -ForegroundColor Cyan

$uploadCount = 0
$errorCount = 0

foreach ($file in $files) {
    try {
        # Calculate relative path
        $relativePath = $file.FullName.Substring($localDistPath.Length).Replace('\', '/')
        $uri = "ftp://$ftpServer$remotePath$relativePath"
        
        Write-Host "⬆️  Uploading: $relativePath" -ForegroundColor White
        
        # Create FTP request
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $FtpPassword)
        $request.UseBinary = $true
        $request.UsePassive = $true
        
        # Read file content
        $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
        $request.ContentLength = $fileContent.Length
        
        # Upload file
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        # Get response
        $response = $request.GetResponse()
        $response.Close()
        
        $uploadCount++
        Write-Host "✅ Uploaded: $relativePath" -ForegroundColor Green
        
    } catch {
        $errorCount++
        Write-Host "❌ Failed to upload: $relativePath" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "✅ Successfully uploaded: $uploadCount files" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "❌ Failed uploads: $errorCount files" -ForegroundColor Red
}

Write-Host "`n🌐 Your site should now be live at:" -ForegroundColor Cyan
Write-Host "   https://lightcyan-shrew-950743.hostingersite.com" -ForegroundColor White

Write-Host "`n🔍 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit your site to test it" -ForegroundColor White
Write-Host "2. Check all pages load correctly" -ForegroundColor White
Write-Host "3. Test the booking flow" -ForegroundColor White
Write-Host "4. Verify Stripe payment integration" -ForegroundColor White
