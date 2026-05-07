---
title: AWS S3 Bucket Setup
---

# AWS S3 Bucket Setup

Learn how to create and configure an Amazon S3 bucket for secure data storage and sharing with Teramot.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed (optional but recommended)
- Understanding of AWS IAM policies

## Step 1: Create S3 Bucket

### Via AWS Console

1. Log into your AWS Management Console
2. Navigate to S3 service
3. Click "Create bucket"
4. Configure bucket settings:
   - **Bucket name**: `teramot-data-[your-company]`
   - **Region**: Choose closest to your location
   - **Block public access**: Keep enabled for security

### Via AWS CLI

```bash
aws s3 mb s3://teramot-data-your-company --region us-east-1
```

## Step 2: Configure Bucket Policies

### Create IAM Policy for Teramot Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::teramot-data-your-company/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::teramot-data-your-company"
    }
  ]
}
```

### Create IAM User for Teramot

1. Go to IAM service in AWS Console
2. Create new user: `teramot-service-user`
3. Select "Programmatic access"
4. Attach the policy created above
5. Save Access Key ID and Secret Access Key

## Step 3: Enable Encryption

### Server-Side Encryption

1. Select your bucket in S3 console
2. Go to Properties tab
3. Click "Default encryption"
4. Choose "AES-256" or "AWS KMS"
5. Save configuration

### Bucket Policy for Encryption

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::teramot-data-your-company/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    }
  ]
}
```

## Step 4: Configure Versioning and Lifecycle

### Enable Versioning

```bash
aws s3api put-bucket-versioning \
  --bucket teramot-data-your-company \
  --versioning-configuration Status=Enabled
```

### Lifecycle Policy

```json
{
  "Rules": [
    {
      "ID": "TeramotDataLifecycle",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

## Step 5: Share Credentials with Teramot

### Secure Credential Sharing

1. **Never share credentials via email or chat**
2. Use Teramot's secure credential portal
3. Provide:
   - Bucket name
   - Access Key ID
   - Secret Access Key
   - Region

### Alternative: Cross-Account IAM Role

For enhanced security, set up cross-account access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::TERAMOT-ACCOUNT-ID:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "your-unique-external-id"
        }
      }
    }
  ]
}
```

## Monitoring and Logging

### Enable CloudTrail

1. Navigate to CloudTrail service
2. Create new trail for S3 bucket
3. Enable data events for your bucket
4. Configure log file delivery

### S3 Access Logging

```bash
aws s3api put-bucket-logging \
  --bucket teramot-data-your-company \
  --bucket-logging-status file://logging.json
```

## Cost Optimization

### Storage Classes
- **Standard**: Frequent access
- **Standard-IA**: Infrequent access
- **Glacier**: Archive storage

### Monitoring Costs
- Use AWS Cost Explorer
- Set up billing alerts
- Review storage analytics

## Next Steps

With your S3 bucket configured, proceed to [Model Deployment](./model-deployment) to set up AI models with your data.