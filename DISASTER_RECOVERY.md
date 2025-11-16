# Habitat Lobby - Disaster Recovery Plan

## Overview
This document outlines the disaster recovery procedures for the Habitat Lobby backend system. It covers backup strategies, recovery processes, and monitoring procedures to ensure business continuity.

## 1. Backup Strategy

### 1.1 Automated Backups
- **Frequency**: Daily at 2:00 AM UTC
- **Retention**: 30 days of backups retained
- **Storage**: Local storage in `./backups` directory
- **Notification**: Email alerts sent to admin@habitatlobby.com

### 1.2 Backup Contents
- All database tables (bookings, payments, invoices, properties, guests, reviews)
- Configuration files
- Application logs (rotated)

### 1.3 Manual Backup Creation
To create a manual backup:
```bash
curl -X POST https://backendhabitatapi.vercel.app/api/admin/backup/create \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"backupName": "manual-backup-2024-01-01"}'
```

## 2. Recovery Procedures

### 2.1 Identifying Backup to Restore
List available backups:
```bash
curl -X GET https://backendhabitatapi.vercel.app/api/admin/backup/list \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2.2 Restoring from Backup
To restore from a specific backup:
```bash
curl -X POST https://backendhabitatapi.vercel.app/api/admin/backup/restore/backup-2024-01-01T02-00-00 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Note**: The restore process is currently simulated for safety. In a production environment, you would need to:
1. Stop the application
2. Restore the database from backup
3. Restart the application

### 2.3 Verifying Recovery
After restoration:
1. Check application health: `GET /health`
2. Verify critical data integrity
3. Test key functionality (booking creation, payment processing)

## 3. Monitoring & Alerting

### 3.1 System Health Monitoring
- **Endpoint**: `GET /monitoring`
- **Metrics Tracked**:
  - Request count and response times
  - Error rates
  - Uptime

### 3.2 Alert Conditions
Alerts are sent when:
- Error rate exceeds 10% over 100 requests
- Average response time exceeds 5 seconds
- System becomes unresponsive

### 3.3 Alert Notifications
- **Email**: admin@habitatlobby.com
- **Content**: Error details, system metrics, timestamp

## 4. Emergency Procedures

### 4.1 Database Corruption
1. Identify the issue through monitoring alerts
2. Stop all write operations to the database
3. Restore from the most recent clean backup
4. Replay any critical transactions from logs (if available)
5. Verify data integrity
6. Resume normal operations

### 4.2 Application Downtime
1. Check system health: `GET /health`
2. Review recent logs for errors
3. Restart the application if needed
4. If issue persists, rollback to previous deployment
5. Create a new backup after resolution

### 4.3 Security Breach
1. Immediately revoke compromised credentials
2. Review logs for unauthorized access
3. Restore from a clean backup if necessary
4. Implement additional security measures
5. Notify affected parties if required

## 5. Testing & Maintenance

### 5.1 Regular Testing
- Test backup restoration monthly
- Verify alerting system quarterly
- Review and update this document annually

### 5.2 Backup Maintenance
- Clean up old backups automatically (30-day retention)
- Monitor backup storage space
- Verify backup integrity periodically

## 6. Contact Information

### 6.1 Primary Contact
- **Name**: Habitat Lobby Administrator
- **Email**: admin@habitatlobby.com
- **Phone**: +30 243 123 4567

### 6.2 Technical Support
- **Development Team**: info@habitatlobby.com
- **Hosting Provider**: Hostinger Support

## 7. Appendices

### 7.1 Environment Variables
Key environment variables for backup and monitoring:
```env
# Monitoring & Alerting
MONITORING_ALERTS_ENABLED=true
MONITORING_ALERT_EMAIL=admin@habitatlobby.com

# Backup & Recovery
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE_PATH=./backups
BACKUP_NOTIFICATION_EMAIL=admin@habitatlobby.com
```

### 7.2 API Endpoints
Backup and monitoring endpoints:
- `POST /api/admin/backup/create` - Create backup
- `GET /api/admin/backup/list` - List backups
- `POST /api/admin/backup/restore/:backupName` - Restore backup
- `POST /api/admin/backup/cleanup` - Cleanup old backups
- `GET /health` - System health
- `GET /monitoring` - Detailed monitoring data

### 7.3 Recovery Checklist
When performing disaster recovery:
- [ ] Identify the issue and assess impact
- [ ] Stop any processes that might worsen the situation
- [ ] Select appropriate backup for restoration
- [ ] Perform restoration procedure
- [ ] Verify system functionality
- [ ] Update this document with lessons learned
- [ ] Notify stakeholders of resolution