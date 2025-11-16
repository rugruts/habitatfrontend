/**
 * Email Automation Cron Job Setup
 * Handles scheduled email processing for Habitat Lobby
 * 
 * This script should be run as a cron job every 5 minutes in production
 * Example crontab entry:
 * Run every 5 minutes: (asterisk)/5 (asterisk) (asterisk) (asterisk) (asterisk) /usr/bin/node /path/to/email-automation-cron-setup.js
 */

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  API_BASE_URL: process.env.CORS_ORIGIN || 'https://habitatlobby.com',
  API_KEY: process.env.API_KEY,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Initialize Supabase client
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

// Logging utility
const log = {
  info: (message, data = {}) => {
    if (config.LOG_LEVEL === 'info' || config.LOG_LEVEL === 'debug') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    }
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  debug: (message, data = {}) => {
    if (config.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
    }
  }
};

/**
 * Process scheduled emails
 */
async function processScheduledEmails() {
  try {
    log.info('Starting scheduled email processing...');
    
    const response = await fetch(`${config.API_BASE_URL}/api/email/process-scheduled`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    log.info('Scheduled emails processed successfully', {
      totalProcessed: result.totalProcessed,
      successCount: result.successCount,
      failureCount: result.failureCount
    });

    return result;
  } catch (error) {
    log.error('Failed to process scheduled emails', error);
    throw error;
  }
}

/**
 * Check for approaching check-ins and trigger automations
 */
async function checkApproachingCheckIns() {
  try {
    log.info('Checking for approaching check-ins...');
    
    // Get confirmed bookings with check-in within the next 72 hours
    const now = new Date();
    const seventyTwoHoursFromNow = new Date();
    seventyTwoHoursFromNow.setHours(now.getHours() + 72);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, check_in, customer_name, customer_email')
      .eq('status', 'confirmed')
      .gte('check_in', now.toISOString())
      .lte('check_in', seventyTwoHoursFromNow.toISOString());

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    log.info(`Found ${bookings?.length || 0} bookings with approaching check-ins`);

    let triggeredCount = 0;
    for (const booking of bookings || []) {
      const checkInDate = new Date(booking.check_in);
      const hoursUntilCheckIn = Math.round((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      // Trigger automation for 48-hour mark
      if (hoursUntilCheckIn <= 48 && hoursUntilCheckIn > 24) {
        try {
          const response = await fetch(`${config.API_BASE_URL}/api/email/automation-trigger`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': config.API_KEY
            },
            body: JSON.stringify({
              triggerType: 'check_in_approaching',
              bookingId: booking.id,
              metadata: {
                hours_until_checkin: hoursUntilCheckIn,
                triggered_by: 'cron_job',
                trigger_time: now.toISOString()
              }
            })
          });

          if (response.ok) {
            log.info(`Pre-arrival automation triggered for booking ${booking.id}`, {
              hoursUntilCheckIn,
              customerName: booking.customer_name
            });
            triggeredCount++;
          } else {
            const errorData = await response.json().catch(() => ({}));
            log.error(`Failed to trigger pre-arrival automation for booking ${booking.id}`, errorData);
          }
        } catch (error) {
          log.error(`Error triggering pre-arrival automation for booking ${booking.id}`, error);
        }
      }
    }

    log.info(`Pre-arrival automations triggered: ${triggeredCount}`);
    return { checked: bookings?.length || 0, triggered: triggeredCount };
  } catch (error) {
    log.error('Failed to check approaching check-ins', error);
    throw error;
  }
}

/**
 * Check for completed check-outs and trigger automations
 */
async function checkCompletedCheckOuts() {
  try {
    log.info('Checking for completed check-outs...');
    
    // Get confirmed bookings with check-out within the last 48 hours
    const now = new Date();
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(now.getHours() - 48);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, check_out, customer_name, customer_email')
      .eq('status', 'confirmed')
      .gte('check_out', fortyEightHoursAgo.toISOString())
      .lte('check_out', now.toISOString());

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    log.info(`Found ${bookings?.length || 0} recently completed bookings`);

    let triggeredCount = 0;
    for (const booking of bookings || []) {
      const checkOutDate = new Date(booking.check_out);
      const hoursAfterCheckOut = Math.round((now.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60));
      
      // Trigger automation for 24+ hours after check-out
      if (hoursAfterCheckOut >= 24) {
        try {
          const response = await fetch(`${config.API_BASE_URL}/api/email/automation-trigger`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': config.API_KEY
            },
            body: JSON.stringify({
              triggerType: 'check_out_completed',
              bookingId: booking.id,
              metadata: {
                hours_after_checkout: hoursAfterCheckOut,
                triggered_by: 'cron_job',
                trigger_time: now.toISOString()
              }
            })
          });

          if (response.ok) {
            log.info(`Post-stay automation triggered for booking ${booking.id}`, {
              hoursAfterCheckOut,
              customerName: booking.customer_name
            });
            triggeredCount++;
          } else {
            const errorData = await response.json().catch(() => ({}));
            log.error(`Failed to trigger post-stay automation for booking ${booking.id}`, errorData);
          }
        } catch (error) {
          log.error(`Error triggering post-stay automation for booking ${booking.id}`, error);
        }
      }
    }

    log.info(`Post-stay automations triggered: ${triggeredCount}`);
    return { checked: bookings?.length || 0, triggered: triggeredCount };
  } catch (error) {
    log.error('Failed to check completed check-outs', error);
    throw error;
  }
}

/**
 * Health check - verify system is operational
 */
async function healthCheck() {
  try {
    log.debug('Performing health check...');
    
    // Check database connectivity
    const { data, error } = await supabase
      .from('email_templates')
      .select('count')
      .single();
    
    if (error) {
      throw new Error(`Database health check failed: ${error.message}`);
    }

    // Check API connectivity
    const response = await fetch(`${config.API_BASE_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.API_KEY
      },
      body: JSON.stringify({
        to: 'health-check@habitatlobby.com',
        subject: 'Health Check',
        htmlBody: '<p>System health check</p>',
        metadata: { health_check: true }
      })
    });

    log.debug('Health check completed', {
      databaseStatus: 'ok',
      apiStatus: response.ok ? 'ok' : 'error',
      timestamp: new Date().toISOString()
    });

    return {
      database: 'ok',
      api: response.ok ? 'ok' : 'error',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    log.error('Health check failed', error);
    return {
      database: 'error',
      api: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now();
  
  try {
    log.info('=== EMAIL AUTOMATION CRON JOB STARTING ===');
    
    // Validate configuration
    if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY || !config.API_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Run all tasks
    const results = {
      scheduledEmails: await processScheduledEmails(),
      approachingCheckIns: await checkApproachingCheckIns(),
      completedCheckOuts: await checkCompletedCheckOuts(),
      healthCheck: await healthCheck()
    };

    const executionTime = Date.now() - startTime;
    
    log.info('=== EMAIL AUTOMATION CRON JOB COMPLETED ===', {
      executionTimeMs: executionTime,
      results: {
        emailsProcessed: results.scheduledEmails.totalProcessed || 0,
        checkInsTriggered: results.approachingCheckIns.triggered,
        checkOutsTriggered: results.completedCheckOuts.triggered,
        systemHealth: results.healthCheck.database === 'ok' && results.healthCheck.api === 'ok' ? 'healthy' : 'degraded'
      }
    });

    // Log to database for monitoring
    await supabase
      .from('automation_logs')
      .insert({
        run_time: new Date().toISOString(),
        execution_duration_ms: executionTime,
        emails_processed: results.scheduledEmails.totalProcessed || 0,
        check_ins_triggered: results.approachingCheckIns.triggered,
        check_outs_triggered: results.completedCheckOuts.triggered,
        system_health: results.healthCheck.database === 'ok' && results.healthCheck.api === 'ok' ? 'healthy' : 'degraded',
        results: results
      })
      .single();

    process.exit(0);
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    log.error('=== EMAIL AUTOMATION CRON JOB FAILED ===', {
      executionTimeMs: executionTime,
      error: error.message,
      stack: error.stack
    });

    // Log error to database
    try {
      await supabase
        .from('automation_logs')
        .insert({
          run_time: new Date().toISOString(),
          execution_duration_ms: executionTime,
          emails_processed: 0,
          check_ins_triggered: 0,
          check_outs_triggered: 0,
          system_health: 'error',
          error_message: error.message,
          results: { error: error.message }
        })
        .single();
    } catch (logError) {
      log.error('Failed to log error to database', logError);
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = {
  processScheduledEmails,
  checkApproachingCheckIns,
  checkCompletedCheckOuts,
  healthCheck,
  main
};