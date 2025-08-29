---
title: Teramot MCP API Documentation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

# Teramot MCP API Documentation

## Overview

The Teramot Model Context Protocol (MCP) API provides AI-powered data engineering capabilities through a standardized protocol. Built on the MCP 2025-03-26 specification, it enables seamless integration with MCP-compatible clients while maintaining enterprise security and scalability.

**Base URL**: `https://api.teramot.com/mcp`

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI applications to securely connect to data sources and tools. Teramot's implementation provides:

- ✅ **AI-Powered Data Analysis**: Natural language to SQL query generation
- 🔐 **Enterprise Security**: JWT-based authentication with dynamic scopes
- 📊 **Usage Tracking**: Comprehensive monitoring and billing integration
- 🚀 **Real-time Streaming**: Server-Sent Events for long-running operations
- 🛠️ **Table Expert Agent**: Advanced data engineering capabilities

## Authentication

### JWT Token Requirements

All MCP endpoints (except `initialize`) require a valid JWT token with specific scopes:

**Required Scope**: `mcp:tools:your-usecase-id`

**Example Scopes**:
- `mcp:tools:sales-analysis` - Access to sales analysis data

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
Accept: application/json, text/event-stream
Content-Type: application/json
mcp-session-id: SESSION_UUID  # Optional, for session management
```

### Authentication Flow

<Admonition type="info">
1. **No auth required**: `initialize` method
2. **JWT required**: All other methods (`tools/list`, `tools/call`, `resources/list`, `resources/read`)
3. **Dynamic scopes**: Token must include specific use case access
</Admonition>

## API Endpoints

### Core MCP Endpoint

#### `POST /mcp/`

Main MCP endpoint handling all JSON-RPC 2.0 requests.

**Content Types**:
- Request: `application/json`
- Response: `application/json` or `text/event-stream`

<Tabs>
<TabItem value="request" label="Request Format">

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "method": "METHOD_NAME",
  "params": { }
}
```

</TabItem>
<TabItem value="response" label="Response Format">

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "result": { },
  "error": { }
}
```

</TabItem>
</Tabs>

#### `GET /mcp/`

Opens Server-Sent Events stream for real-time server-to-client communication.

**Requirements**:
- Header: `Accept: text/event-stream`
- Authentication: Required (`mcp:tools` scope)

**Response**: SSE stream with connection status, ready signals, and heartbeat events.

#### `OPTIONS /mcp/`

CORS preflight handling.

#### `DELETE /mcp/`

Client disconnection endpoint.

#### `GET /mcp/tools/list`

List available tools (GET endpoint for backward compatibility).

**Authentication**: Required (`mcp:tools` scope)

#### `GET /mcp/resources/list`

List available resources (GET endpoint for backward compatibility).

**Authentication**: Required (`mcp:tools` scope)

## MCP Methods

### `initialize`

Initialize MCP connection and negotiate capabilities.

<Admonition type="note">
**Authentication**: Not required
</Admonition>

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": {},
      "resources": {}
    },
    "clientInfo": {
      "name": "MyApp",
      "version": "1.0.0"
    }
  }
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": {"listChanged": true},
      "resources": {"listChanged": true, "subscribe": true},
      "logging": {}
    },
    "serverInfo": {
      "name": "Teramot MCP Server",
      "version": "1.0.0"
    },
    "instructions": "Teramot MCP Server - AI-powered data engineering capabilities"
  }
}
```

</TabItem>
</Tabs>

**Session Management**: Response includes `mcp-session-id` header for subsequent requests.

### `tools/list`

List available MCP tools.

<Admonition type="warning">
**Authentication**: Required (`mcp:tools` scope)
</Admonition>

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "jsonrpc": "2.0",
  "id": "list-tools",
  "method": "tools/list"
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "jsonrpc": "2.0",
  "id": "list-tools",
  "result": {
    "tools": [
      {
        "name": "query_table_expert",
        "description": "Query the Table Expert Agent for data analysis and insights.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "The question or request to analyze"
            },
            "topic": {
              "type": "string", 
              "description": "The topic or domain for the analysis"
            }
          },
          "required": ["message", "topic"]
        }
      }
    ]
  }
}
```

</TabItem>
</Tabs>

### `tools/call`

Execute a specific tool.

<Admonition type="warning">
**Authentication**: Required (`mcp:tools` scope)
</Admonition>

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "jsonrpc": "2.0",
  "id": "call-tool",
  "method": "tools/call",
  "params": {
    "name": "query_table_expert",
    "arguments": {
      "message": "Show me the top 10 customers by revenue this quarter",
      "topic": "sales-analysis"
    }
  }
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "jsonrpc": "2.0",
  "id": "call-tool",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Based on Q4 2024 data, here are the top 10 customers by revenue:\n\n1. Acme Corp - $1,245,000\n2. GlobalTech Solutions - $987,500\n...\n\n**Execution Details:**\n\n**SQL Query:**\n```sql\nSELECT customer_name, SUM(revenue) as total_revenue\nFROM sales_data \nWHERE quarter = 'Q4-2024'\nGROUP BY customer_name\nORDER BY total_revenue DESC\nLIMIT 10;\n```\n\n**Execution Time:** 0.234 seconds"
      }
    ]
  }
}
```

</TabItem>
</Tabs>

**Features**:
- Automatic `usecase_id` injection from JWT token
- Usage tracking and billing integration
- SQL query generation and execution
- Performance monitoring
- Plot generation (when applicable)

### `resources/list`

List available MCP resources.

<Admonition type="warning">
**Authentication**: Required (`mcp:tools` scope)
</Admonition>

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "jsonrpc": "2.0",
  "id": "list-resources",
  "method": "resources/list"
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "jsonrpc": "2.0",
  "id": "list-resources", 
  "result": {
    "resources": [
      {
        "uri": "teramot://table-expert/capabilities",
        "name": "Table Expert Capabilities",
        "description": "Documentation about Table Expert tool capabilities and usage"
      }
    ]
  }
}
```

</TabItem>
</Tabs>

### `resources/read`

Read a specific resource.

<Admonition type="warning">
**Authentication**: Required (`mcp:tools` scope)
</Admonition>

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "jsonrpc": "2.0",
  "id": "read-resource",
  "method": "resources/read",
  "params": {
    "uri": "teramot://table-expert/capabilities"
  }
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "jsonrpc": "2.0",
  "id": "read-resource",
  "result": {
    "contents": [
      {
        "uri": "teramot://table-expert/capabilities",
        "text": "# Table Expert Capabilities\n\nThe Table Expert provides:\n- SQL Query Generation\n- Data Analysis\n- Visualization\n- Performance Monitoring..."
      }
    ]
  }
}
```

</TabItem>
</Tabs>

## Available Tools

### Table Expert (`query_table_expert`)

AI-powered data analysis agent that converts natural language queries into SQL and provides insights.

**Parameters**:
- `message` (string, required): Natural language question or analysis request
- `topic` (string, required): Domain or topic for contextual understanding

**Capabilities**:
- **SQL Generation**: Natural language to optimized SQL queries
- **Data Analysis**: Statistical analysis and insights
- **Visualization**: Automatic plot generation for visual data
- **Performance Tracking**: Execution time monitoring
- **Context Awareness**: Topic-based analysis optimization

**Example Use Cases**:

<Tabs>
<TabItem value="sales" label="Sales Analysis">

```json
{
  "message": "Show monthly revenue trends for the last 12 months",
  "topic": "revenue-analysis"
}
```

</TabItem>
<TabItem value="customer" label="Customer Segmentation">

```json
{
  "message": "Segment customers by purchase frequency and lifetime value",
  "topic": "customer-analytics"
}
```

</TabItem>
<TabItem value="product" label="Product Performance">

```json
{
  "message": "Which products have the highest profit margins?", 
  "topic": "product-analysis"
}
```

</TabItem>
</Tabs>

**Response Format**:
- Formatted analysis with insights
- Generated SQL queries (when applicable)
- Execution time and performance metrics
- Plot URLs for visualizations
- Metadata about the analysis process

## Session Management

### Session Lifecycle

1. **Initialize**: Call `initialize` method to create session
2. **Session ID**: Server returns `mcp-session-id` header
3. **Subsequent Requests**: Include session ID in all requests
4. **Validation**: Server validates session for non-initialize methods

### Session Headers

```http
mcp-session-id: 550e8400-e29b-41d4-a716-446655440000
```

### Session Persistence

- Sessions maintain context across requests
- Required for all methods except `initialize`
- Automatic session creation during initialization
- Session validation for security

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| `200 OK` | Successful request |
| `400 Bad Request` | Invalid JSON or malformed request |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Insufficient scope permissions |
| `404 Not Found` | Session not found or invalid endpoint |
| `500 Internal Server Error` | Server-side processing error |

### JSON-RPC Error Codes

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "error": {
    "code": -32000,
    "message": "Error description"
  }
}
```

**Common Error Codes**:
- `-32700`: Parse error (invalid JSON)
- `-32600`: Invalid request (malformed JSON-RPC)
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32000`: Internal error

### Authentication Errors

<Tabs>
<TabItem value="missing" label="Missing Authentication">

```json
{
  "error": {
    "code": -32000,
    "message": "Authentication required"
  }
}
```

</TabItem>
<TabItem value="scope" label="Insufficient Scope">

```json
{
  "error": {
    "code": -32000, 
    "message": "Insufficient scope: requires mcp:tools:your-usecase-id"
  }
}
```

</TabItem>
<TabItem value="session" label="Session Not Found">

```json
{
  "error": {
    "code": -32000,
    "message": "Session not found"
  }
}
```

</TabItem>
</Tabs>

## Batch Requests

MCP supports JSON-RPC batch requests for multiple operations:

<Tabs>
<TabItem value="batch-request" label="Request">

```json
[
  {
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/list"
  },
  {
    "jsonrpc": "2.0", 
    "id": "2",
    "method": "resources/list"
  }
]
```

</TabItem>
<TabItem value="batch-response" label="Response">

```json
[
  {
    "jsonrpc": "2.0",
    "id": "1",
    "result": {"tools": [...]}
  },
  {
    "jsonrpc": "2.0",
    "id": "2", 
    "result": {"resources": [...]}
  }
]
```

</TabItem>
</Tabs>

<Admonition type="caution" title="Batch Limitations">
- `initialize` method cannot be part of batch requests
- All requests in batch must have valid authentication (except initialize)
- Batch processing is atomic - either all succeed or appropriate errors returned
</Admonition>

## Streaming Responses

### Server-Sent Events (SSE)

For real-time updates and long-running operations:

**Request Headers**:
```http
Accept: text/event-stream
```

**Response Format**:
```
id: event-12345
event: message
data: {"jsonrpc": "2.0", "id": "request-id", "result": {...}}

```

**Event Types**:
- `connection`: Connection established
- `ready`: Server ready for requests
- `ping`: Heartbeat events (every 30 seconds)
- `message`: Actual response data
- `error`: Error events

### Streaming Use Cases

- Long-running data analysis queries
- Real-time progress updates
- Large result set processing
- Connection keep-alive

## Usage Tracking

All tool executions are automatically tracked for:

### Billing Integration
- Cost allocation per use case
- Resource consumption monitoring
- Usage pattern analysis

### Performance Monitoring  
- Execution time tracking
- Success/failure rates
- Query optimization insights

### Audit Trails
- Complete request/response logging
- User activity tracking
- Security event monitoring

## Rate Limiting

- Authentication required for all non-initialize methods
- Usage tracked per use case and user
- Enterprise customers: Higher rate limits available
- Streaming connections: Independent rate limiting

## Security Features

### Token Validation
- JWT signature verification
- Scope-based authorization
- Use case isolation
- Token expiration handling

### Data Access Control
- Use case-specific data access
- Dynamic scope validation
- Secure data processing pipeline
- Audit logging

### Transport Security
- HTTPS required for all requests
- Secure WebSocket connections for streaming
- CORS protection
- Request/response logging

## Support

For technical support:
- **API Issues**: Include request ID for faster resolution
- **Authentication**: Contact your Teramot administrator
- **Enterprise Support**: Priority support available

---

**Specification Compliance**: This implementation follows the MCP 2025-03-26 specification with enterprise security enhancements.