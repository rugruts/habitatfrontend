interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: Record<string, unknown>;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
}

interface PaymentEvent {
  eventType: 'payment_started' | 'payment_succeeded' | 'payment_failed' | 'payment_cancelled';
  bookingId?: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  errorCode?: string;
  errorMessage?: string;
  timestamp: string;
  duration?: number;
}

interface BookingEvent {
  eventType: 'booking_created' | 'booking_confirmed' | 'booking_cancelled' | 'booking_updated';
  bookingId: string;
  propertyId?: string;
  customerEmail?: string;
  amount?: number;
  timestamp: string;
  details?: Record<string, unknown>;
}

interface EmailEvent {
  eventType: 'email_sent' | 'email_failed' | 'email_queued' | 'email_retry';
  emailType: string;
  bookingId?: string;
  recipientEmail?: string;
  provider?: string;
  errorMessage?: string;
  timestamp: string;
  attempt?: number;
}

export class MonitoringService {
  private sessionId: string;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    // Track uncaught errors
    window.addEventListener('error', (event) => {
      this.logError('uncaught_error', 'Uncaught JavaScript error', {
        message: event.error?.message || event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('unhandled_rejection', 'Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.logInfo('page_visibility', `Page ${document.hidden ? 'hidden' : 'visible'}`);
    });

    // Track network status
    window.addEventListener('online', () => {
      this.logInfo('network', 'Connection restored');
    });

    window.addEventListener('offline', () => {
      this.logWarn('network', 'Connection lost');
    });
  }

  // General logging methods
  logInfo(category: string, message: string, data?: Record<string, unknown>): void {
    this.addLog('info', category, message, data);
  }

  logWarn(category: string, message: string, data?: Record<string, unknown>): void {
    this.addLog('warn', category, message, data);
  }

  logError(category: string, message: string, data?: Record<string, unknown>): void {
    this.addLog('error', category, message, data);
  }

  logDebug(category: string, message: string, data?: Record<string, unknown>): void {
    this.addLog('debug', category, message, data);
  }

  private addLog(level: LogEntry['level'], category: string, message: string, data?: Record<string, unknown>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.push(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Console output with formatting
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] ${category}: ${message}`, data || '');

    // Send critical errors to external monitoring
    if (level === 'error') {
      this.sendToExternalMonitoring(logEntry);
    }
  }

  // Payment-specific monitoring
  trackPaymentEvent(event: PaymentEvent): void {
    this.logInfo('payment', `Payment ${event.eventType}`, event);

    // Track payment funnel metrics
    this.updatePaymentMetrics(event);
  }

  // Booking-specific monitoring
  trackBookingEvent(event: BookingEvent): void {
    this.logInfo('booking', `Booking ${event.eventType}`, event);

    // Track booking conversion metrics
    this.updateBookingMetrics(event);
  }

  // Email-specific monitoring
  trackEmailEvent(event: EmailEvent): void {
    const level = event.eventType === 'email_failed' ? 'error' : 'info';
    this.addLog(level, 'email', `Email ${event.eventType}`, event);
  }

  // Performance monitoring
  trackPerformance(operation: string, duration: number, metadata?: Record<string, unknown>): void {
    this.logInfo('performance', `${operation} completed in ${duration}ms`, {
      duration,
      ...metadata
    });

    // Track slow operations
    if (duration > 5000) { // 5 seconds
      this.logWarn('performance', `Slow operation detected: ${operation}`, {
        duration,
        ...metadata
      });
    }
  }

  // User interaction tracking
  trackUserAction(action: string, details?: Record<string, unknown>): void {
    this.logInfo('user_action', action, details);
  }

  // API call monitoring
  trackApiCall(
    endpoint: string, 
    method: string, 
    statusCode: number, 
    duration: number, 
    error?: string
  ): void {
    const level = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'info';
    
    this.addLog(level, 'api', `${method} ${endpoint} - ${statusCode}`, {
      endpoint,
      method,
      statusCode,
      duration,
      error
    });
  }

  // Get logs for debugging
  getLogs(category?: string, level?: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => {
      if (category && log.category !== category) return false;
      if (level && log.level !== level) return false;
      return true;
    });
  }

  // Get system information for debugging
  getSystemInfo(): Record<string, unknown> {
    return {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as Record<string, unknown>).connection ? {
        effectiveType: (navigator as Record<string, unknown>).connection?.effectiveType,
        downlink: (navigator as Record<string, unknown>).connection?.downlink,
        rtt: (navigator as Record<string, unknown>).connection?.rtt
      } : undefined
    };
  }

  // Export logs for debugging
  exportLogs(): string {
    const exportData = {
      systemInfo: this.getSystemInfo(),
      logs: this.logs,
      metrics: this.getMetrics()
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Payment metrics tracking
  private updatePaymentMetrics(event: PaymentEvent): void {
    const metrics = this.getStoredMetrics();
    
    if (!metrics.payment) {
      metrics.payment = {
        total_attempts: 0,
        successful: 0,
        failed: 0,
        cancelled: 0,
        by_method: {},
        errors: {}
      };
    }

    switch (event.eventType) {
      case 'payment_started':
        metrics.payment.total_attempts++;
        break;
      case 'payment_succeeded':
        metrics.payment.successful++;
        if (event.paymentMethod) {
          metrics.payment.by_method[event.paymentMethod] = 
            (metrics.payment.by_method[event.paymentMethod] || 0) + 1;
        }
        break;
      case 'payment_failed':
        metrics.payment.failed++;
        if (event.errorCode) {
          metrics.payment.errors[event.errorCode] = 
            (metrics.payment.errors[event.errorCode] || 0) + 1;
        }
        break;
      case 'payment_cancelled':
        metrics.payment.cancelled++;
        break;
    }

    this.storeMetrics(metrics);
  }

  // Booking metrics tracking
  private updateBookingMetrics(event: BookingEvent): void {
    const metrics = this.getStoredMetrics();
    
    if (!metrics.booking) {
      metrics.booking = {
        created: 0,
        confirmed: 0,
        cancelled: 0,
        conversion_rate: 0
      };
    }

    switch (event.eventType) {
      case 'booking_created':
        metrics.booking.created++;
        break;
      case 'booking_confirmed':
        metrics.booking.confirmed++;
        break;
      case 'booking_cancelled':
        metrics.booking.cancelled++;
        break;
    }

    // Calculate conversion rate
    metrics.booking.conversion_rate = metrics.booking.created > 0 
      ? (metrics.booking.confirmed / metrics.booking.created) * 100 
      : 0;

    this.storeMetrics(metrics);
  }

  private getStoredMetrics(): Record<string, unknown> {
    try {
      const stored = localStorage.getItem('app_metrics');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private storeMetrics(metrics: Record<string, unknown>): void {
    try {
      localStorage.setItem('app_metrics', JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  getMetrics(): Record<string, unknown> {
    return this.getStoredMetrics();
  }

  // Send to external monitoring service
  private sendToExternalMonitoring(logEntry: LogEntry): void {
    // In production, send to services like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - DataDog for monitoring
    // - Custom analytics endpoint

    // Example implementation:
    if (process.env.NODE_ENV === 'production') {
      // try {
      //   fetch('/api/monitoring/error', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(logEntry)
      //   }).catch(err => console.error('Failed to send to monitoring:', err));
      // } catch (error) {
      //   console.error('Monitoring service error:', error);
      // }
    }
  }
}

export const monitoringService = new MonitoringService();

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  (window as Record<string, unknown>).monitoring = monitoringService;
}


