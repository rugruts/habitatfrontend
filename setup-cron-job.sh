#!/bin/bash

# ===================================================================
# EMAIL AUTOMATION CRON JOB SETUP
# Sets up automated email processing for Habitat Lobby
# ===================================================================

echo "🚀 Setting up Email Automation Cron Job..."
echo "==============================================="

# Check if we're on a Linux/Unix system
if [[ "$OSTYPE" != "linux-gnu"* ]] && [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for Linux/Unix systems."
    echo "For Windows, please set up Task Scheduler manually."
    exit 1
fi

# Get the current directory (where the script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRON_SCRIPT="$SCRIPT_DIR/email-automation-cron-setup.js"
LOG_FILE="/var/log/email-automation.log"

# Check if the cron script exists
if [ ! -f "$CRON_SCRIPT" ]; then
    echo "❌ Cron script not found at: $CRON_SCRIPT"
    echo "Please ensure email-automation-cron-setup.js is in the same directory."
    exit 1
fi

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH."
    echo "Please install Node.js first."
    exit 1
fi

echo "✅ Found cron script at: $CRON_SCRIPT"
echo "✅ Node.js is available"

# Create log directory if it doesn't exist
sudo mkdir -p /var/log
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"

echo "✅ Log file created at: $LOG_FILE"

# Check current crontab
echo ""
echo "📋 Current crontab entries:"
crontab -l || echo "(no crontab for current user)"

# Add the cron job
echo ""
echo "⏰ Adding cron job to run every 5 minutes..."

# Create a temporary file with current crontab plus new entry
CRON_ENTRY="*/5 * * * * /usr/bin/node \"$CRON_SCRIPT\" >> \"$LOG_FILE\" 2>&1"

# Add to crontab (this will overwrite existing crontab, so we need to preserve existing entries)
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo "✅ Cron job added successfully!"
echo ""
echo "📋 New crontab entry:"
echo "   $CRON_ENTRY"
echo ""
echo "📋 Full crontab now contains:"
crontab -l
echo ""

# Test the cron job immediately
echo "🧪 Testing cron job..."
/usr/bin/node "$CRON_SCRIPT"

if [ $? -eq 0 ]; then
    echo "✅ Cron job test successful!"
else
    echo "⚠️  Cron job test had issues (check log file)"
fi

echo ""
echo "📊 You can monitor the cron job by checking:"
echo "   tail -f $LOG_FILE"
echo ""
echo "🔄 The cron job will run every 5 minutes and:"
echo "   • Check for scheduled emails that are due"
echo "   • Process booking check-in/check-out triggers"
echo "   • Send automated emails based on your rules"
echo "   • Log all activity to $LOG_FILE"
echo ""
echo "🎉 Email automation is now running automatically!"
echo ""
echo "💡 To remove the cron job later, run: crontab -r"
echo "💡 To edit the cron job, run: crontab -e"