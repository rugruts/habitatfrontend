# Habitat Lobby Frontend Deployment Script
# Deploy to Hostinger via SSH

Write-Host "🚀 Starting Habitat Lobby Frontend Deployment..." -ForegroundColor Green

# Configuration
$SSH_HOST = "92.113.18.238"
$SSH_PORT = "65002"
$SSH_USER = "u149170346"
$SSH_PASS = "J5*sRUm6E"
$REMOTE_PATH = "/domains/habitatlobby.com/public_html"
$LOCAL_DIST = "dist"

Write-Host "📦 Preparing deployment package..." -ForegroundColor Yellow

# Create deployment archive
if (Test-Path "habitat-lobby-frontend-production.zip") {
    Remove-Item "habitat-lobby-frontend-production.zip" -Force
}

Compress-Archive -Path "$LOCAL_DIST\*" -DestinationPath "habitat-lobby-frontend-production.zip" -Force
Write-Host "✅ Deployment package created: habitat-lobby-frontend-production.zip" -ForegroundColor Green

# Upload via SCP
Write-Host "📤 Uploading to Hostinger..." -ForegroundColor Yellow

# Using pscp (PuTTY SCP) if available, otherwise use scp
$scpCommand = "scp -P $SSH_PORT habitat-lobby-frontend-production.zip ${SSH_USER}@${SSH_HOST}:$REMOTE_PATH/"

Write-Host "Command: $scpCommand" -ForegroundColor Cyan
Write-Host "Password: $SSH_PASS" -ForegroundColor Cyan

# SSH commands to execute on server
$sshCommands = @"
cd $REMOTE_PATH
echo "📁 Current directory: `$(pwd)"
echo "📋 Files before deployment:"
ls -la

echo "🗑️ Backing up existing files..."
if [ -f index.html ]; then
    mkdir -p backup_`$(date +%Y%m%d_%H%M%S)
    mv *.html *.css *.js *.ico *.txt *.xml assets backup_`$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
fi

echo "📦 Extracting new deployment..."
unzip -o habitat-lobby-frontend-production.zip
rm habitat-lobby-frontend-production.zip

echo "🔧 Setting permissions..."
chmod -R 755 .
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type f -name "*.css" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;

echo "✅ Deployment complete!"
echo "📋 Files after deployment:"
ls -la

echo "🌐 Your site should now be live at: https://habitatlobby.com"
"@

Write-Host "🔧 SSH Commands to execute:" -ForegroundColor Yellow
Write-Host $sshCommands -ForegroundColor Cyan

Write-Host "`n🎯 Manual Steps:" -ForegroundColor Yellow
Write-Host "1. Run: scp -P $SSH_PORT habitat-lobby-frontend-production.zip ${SSH_USER}@${SSH_HOST}:$REMOTE_PATH/" -ForegroundColor White
Write-Host "2. Password: $SSH_PASS" -ForegroundColor White
Write-Host "3. Run: ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST}" -ForegroundColor White
Write-Host "4. Execute the SSH commands above" -ForegroundColor White

Write-Host "`n🚀 Deployment package ready!" -ForegroundColor Green
