---
title: FAQ
---

# Frequently Asked Questions

Common questions and answers about getting started with Teramot integration.

## General Questions

### What is Teramot?

Teramot is an AI-powered platform that helps organizations unlock insights from their corporate data through intelligent APIs, automated processing, and seamless integrations.

### How long does initial setup take?

Typical setup times:
- **Quick Demo**: 30 minutes with sample data
- **Basic Integration**: 1-2 weeks with your data
- **Full Production Setup**: 4-6 weeks including testing and optimization

### What types of data does Teramot support?

Teramot supports:
- **Text**: Documents, emails, chat logs, reports
- **Structured Data**: Databases, CSV files, JSON
- **Semi-structured**: XML, logs, web data
- **Images**: Documents, screenshots, charts (OCR)

## Data Integration

### How do I connect my database to Teramot?

1. Ensure network connectivity (whitelist Teramot IPs if needed)
2. Create a read-only database user for Teramot
3. Provide connection details in the Teramot dashboard
4. Test the connection and configure sync preferences

See [Connect Your Data](./connect-your-data) for detailed steps.

### Is my data secure?

**Yes.** Teramot implements enterprise-grade security:
- All data transmitted via encrypted channels (TLS 1.3)
- Data encrypted at rest using AES-256
- SOC 2 Type II compliance
- GDPR and CCPA compliant
- Regular security audits and penetration testing

### Can I use my existing AWS/Azure/GCP infrastructure?

**Yes.** Teramot supports:
- Bring Your Own Cloud (BYOC) deployments
- VPC peering for secure connections
- Cross-account IAM roles
- Private endpoints and dedicated instances

### What if my data is on-premises?

Options for on-premises data:
1. **VPN Connection**: Secure tunnel to Teramot cloud
2. **Hybrid Deployment**: On-premises edge nodes with cloud orchestration
3. **Data Export**: Periodic secure data exports to cloud storage
4. **Air-Gapped**: Fully on-premises deployment (Enterprise plan)

## Model and API Questions

### How accurate are Teramot's AI models?

Model accuracy varies by use case:
- **Document Classification**: 85-95% typical accuracy
- **Sentiment Analysis**: 80-90% accuracy
- **Entity Recognition**: 90-95% for common entities
- **Custom Models**: Performance depends on training data quality

### Can I use custom models?

**Yes.** Teramot supports:
- Fine-tuning pre-trained models with your data
- Training custom models from scratch
- Importing models from popular frameworks (TensorFlow, PyTorch)
- A/B testing different model versions

### What's the API rate limit?

Rate limits by plan:
- **Starter**: 100 requests/minute
- **Professional**: 1,000 requests/minute  
- **Enterprise**: 10,000 requests/minute (customizable)
- **Dedicated**: No limits on dedicated infrastructure

### How do I handle API authentication?

Teramot uses API keys for authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.teramot.com/v1/models/predict
```

For enhanced security, use:
- Short-lived tokens with refresh mechanism
- IP whitelisting
- Role-based access control

## Technical Issues

### My API calls are timing out. What should I do?

**Common causes and solutions:**

1. **Large payload**: Break into smaller batches
   ```python
   # Instead of processing 1000 documents at once
   batch_size = 50
   for i in range(0, len(documents), batch_size):
       batch = documents[i:i + batch_size]
       process_batch(batch)
   ```

2. **Network issues**: Implement retry logic with exponential backoff
   ```python
   import time
   import random
   
   def api_call_with_retry(max_retries=3):
       for attempt in range(max_retries):
           try:
               return teramot_api_call()
           except TimeoutError:
               if attempt == max_retries - 1:
                   raise
               time.sleep(2 ** attempt + random.uniform(0, 1))
   ```

3. **Model complexity**: Use simpler models for faster responses

### How do I monitor model performance?

Teramot provides several monitoring tools:
- **Dashboard Metrics**: Real-time performance charts
- **API Endpoints**: Programmatic access to metrics
- **Webhooks**: Alerts for performance degradation
- **Logs**: Detailed request/response logging

```python
# Get model performance metrics
metrics = client.models.get_metrics('model-id', 
                                   start_date='2024-01-01',
                                   end_date='2024-01-31')
print(f"Average accuracy: {metrics.accuracy}")
print(f"Average latency: {metrics.latency_p95}ms")
```

### My model accuracy is decreasing. Why?

**Common reasons:**

1. **Data Drift**: Input data patterns have changed
   - Solution: Retrain with recent data

2. **Concept Drift**: Business rules or categories changed
   - Solution: Update training labels and retrain

3. **Model Decay**: General degradation over time
   - Solution: Implement regular retraining schedule

4. **Data Quality Issues**: Corrupted or inconsistent input
   - Solution: Implement data validation pipelines

## Billing and Pricing

### How is Teramot usage billed?

Pricing is based on:
- **API Calls**: Per request or per batch
- **Data Processing**: Per GB processed
- **Model Training**: Per training hour
- **Storage**: Per GB stored per month

### Can I estimate costs before starting?

**Yes.** Use the cost calculator in your dashboard:
1. Enter expected API call volume
2. Estimate data processing needs
3. Select required features
4. Get monthly cost projection

### Are there any hidden fees?

**No.** All costs are transparent:
- No setup fees
- No minimum commitments (except Enterprise)
- No data egress charges within reasonable limits
- Clear per-unit pricing

## Getting Help

### What support is available?

**Support levels by plan:**
- **Starter**: Community forum, documentation
- **Professional**: Email support (24-hour response)
- **Enterprise**: Phone support, dedicated account manager
- **Dedicated**: 24/7 support, solution architects

### How do I report a bug or issue?

1. **Dashboard**: Use the "Report Issue" button
2. **Email**: support@teramot.com with:
   - Detailed description
   - Steps to reproduce
   - Error messages/logs
   - Your account ID

3. **Emergency**: For production issues, call enterprise hotline

### Where can I find more documentation?

- **API Reference**: [/api](/api) - Complete API documentation
- **Compliance**: [/compliance](/compliance) - Security and legal docs
- **Blog**: [/updates](/updates) - Technical articles and updates
- **Status**: [/status](/status) - System status and incidents

### Can I get training for my team?

**Yes.** Training options:
- **Self-paced**: Online courses and tutorials
- **Webinars**: Regular group training sessions
- **Custom Training**: On-site or virtual team training
- **Certification**: Teramot certified developer program

## Advanced Topics

### Can I deploy Teramot on-premises?

**Yes, for Enterprise customers:**
- Full on-premises deployment available
- Hybrid cloud-on-premises configurations
- Air-gapped environments supported
- Kubernetes-based deployment

### How do I implement CI/CD with Teramot?

```yaml
# Example GitHub Actions workflow
name: Teramot Model Deployment
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Model
        run: |
          teramot auth login --api-key ${{ secrets.TERAMOT_API_KEY }}
          teramot models deploy --config model-config.yaml
          teramot models test --model-id ${{ env.MODEL_ID }}
```

### Can I integrate with my existing ML pipeline?

**Yes.** Teramot integrates with:
- **MLflow**: Model versioning and experiment tracking
- **Kubeflow**: Kubernetes-native ML workflows
- **Airflow**: Data pipeline orchestration
- **Databricks**: Unified analytics platform

### How do I handle sensitive data?

Best practices for sensitive data:
1. **Data Classification**: Tag sensitive fields
2. **Field-level Encryption**: Encrypt PII before sending
3. **Tokenization**: Replace sensitive values with tokens
4. **Access Controls**: Restrict who can access models
5. **Audit Logs**: Track all data access

```python
# Example: Mask sensitive data before processing
def mask_sensitive_data(text):
    # Replace SSNs with tokens
    text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[SSN]', text)
    # Replace credit cards with tokens
    text = re.sub(r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b', '[CARD]', text)
    return text
```

## Still Have Questions?

If you can't find an answer here:

1. **Search Documentation**: Use the search bar at the top
2. **Community Forum**: Ask the community
3. **Contact Support**: Email support@teramot.com
4. **Schedule a Call**: Book time with a solution architect

**Emergency Support**: For production issues affecting business operations, use the emergency contact information provided in your Enterprise support agreement.