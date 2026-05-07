---
title: Connect Your Data
---

# Connect Your Data Sources

Learn how to connect various data sources to Teramot for AI-powered analysis and processing.

## Supported Data Sources

### Databases
- PostgreSQL
- MySQL
- MongoDB
- Microsoft SQL Server
- Oracle Database

### APIs
- REST APIs
- GraphQL endpoints
- Custom webhooks

### File Sources
- CSV files
- JSON files
- Excel spreadsheets
- Parquet files

## Connection Methods

### Database Connection

1. Navigate to Data Sources in your Teramot dashboard
2. Select "Add Database Connection"
3. Provide connection details:
   ```
   Host: your-database-host.com
   Port: 5432
   Database: your_database_name
   Username: your_username
   Password: your_password
   ```
4. Test the connection
5. Configure data sync preferences

### API Integration

1. Go to Data Sources > API Connections
2. Enter your API endpoint URL
3. Configure authentication:
   - API Key
   - OAuth 2.0
   - Basic Authentication
4. Set up data polling intervals
5. Map API response fields

### File Upload

1. Access the File Upload section
2. Drag and drop files or browse to select
3. Preview data structure
4. Configure parsing options
5. Schedule automatic updates (for recurring files)

## Security Considerations

- All connections use encrypted channels (TLS/SSL)
- Credentials are stored securely and encrypted at rest
- Network access controls can be configured
- Audit logs track all data access

## Troubleshooting

### Common Issues

**Connection Timeout**
- Check network connectivity
- Verify firewall settings
- Ensure correct host and port

**Authentication Failed**
- Double-check credentials
- Verify user permissions
- Check for expired tokens

**Data Sync Issues**
- Review sync logs
- Check data format compatibility
- Verify source data availability

## Next Steps

Once your data sources are connected, proceed to [AWS S3 Setup](./aws-bucket-setup) to configure secure cloud storage.