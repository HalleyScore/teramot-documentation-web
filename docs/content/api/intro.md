---
title: Teramot MCP API Documentation
weight: 1
---

## Overview

The Teramot Model Context Protocol (MCP) API provides AI-powered data engineering capabilities through a standardized protocol. Built on the MCP 2025-11-25 specification, it enables seamless integration with MCP-compatible clients while maintaining enterprise security and scalability.

**Base URL**: `https://api.teramot.com/mcp`

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI applications to securely connect to data sources and tools. Teramot's implementation provides:

- ✅ **AI-Powered Data Analysis**: Natural language to SQL query generation
- 🔐 **Enterprise Security**: JWT-based authentication with dynamic scopes
- 📊 **Usage Tracking**: Comprehensive monitoring and billing integration
- 🚀 **Real-time Streaming**: Server-Sent Events for long-running operations

## Authentication

### JWT Token Requirements

All MCP endpoints (except `initialize` and `tools/list`) require a valid JWT token with specific scopes:

**Required Scope Pattern**: `mcp:tools:your-usecase-id`

**Example Scopes**:
- `mcp:tools:sales-analysis` — Access to sales analysis data

**Unauthenticated Methods** (bootstrap flow):
- `initialize` — Always accessible without token
- `tools/list` — Accessible without token to enable connector bootstrap

**Scope Validation**:
- Token must include `mcp:tools` base scope
- Additional usecase-specific scope: `mcp:tools:{usecase_id}`
- Server extracts `usecase_id` from token claims
- All tool calls automatically receive the authenticated `usecase_id`

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
Accept: application/json, text/event-stream
Content-Type: application/json
mcp-session-id: SESSION_UUID
```

### Authentication Flow

{{< callout type="info" >}}
1. **No auth required**: `initialize` and `tools/list` methods (bootstrap flow)
2. **JWT required**: All other methods (`tools/call`, `resources/list`, `resources/read`)
3. **Dynamic scopes**: Token must include specific use case access
{{< /callout >}}

## API Endpoints

### Core MCP Endpoint

#### `POST /mcp/`

Main MCP endpoint handling all JSON-RPC 2.0 requests.

**Content Types**:
- Request: `application/json`
- Response: `application/json` or `text/event-stream`

{{< tabs items="Request Format,Response Format" >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "method": "METHOD_NAME",
  "params": { }
}
```
  {{< /tab >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "result": { },
  "error": { }
}
```
  {{< /tab >}}
{{< /tabs >}}

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

**Authentication**: Not required (part of bootstrap flow)

#### `GET /mcp/resources/list`

List available resources (GET endpoint for backward compatibility).

**Authentication**: Required (`mcp:tools` scope)

## MCP Methods

### `initialize`

Initialize MCP connection and negotiate capabilities.

{{< callout >}}
**Authentication**: Not required
{{< /callout >}}

{{< tabs items="Request,Response" >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
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
  {{< /tab >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "result": {
    "protocolVersion": "2025-11-25",
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
  {{< /tab >}}
{{< /tabs >}}

**Session Management**: Response includes `mcp-session-id` header for subsequent requests.

### `tools/list`

List available MCP tools.

{{< callout >}}
**Authentication**: Not required (part of bootstrap flow)
{{< /callout >}}

{{< tabs items="Request,Response" >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "list-tools",
  "method": "tools/list"
}
```
  {{< /tab >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "list-tools",
  "result": {
    "tools": [
      {
        "name": "list_gold_tables",
        "description": "List all GOLD (analytical) tables in the data warehouse.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "usecase_id": {
              "type": "string",
              "description": "Optional usecase identifier. If not provided, uses the usecase from your token."
            }
          }
        }
      },
      {
        "name": "list_silver_tables",
        "description": "List all SILVER (processed) tables in the data warehouse.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "usecase_id": {
              "type": "string",
              "description": "Optional usecase identifier. If not provided, uses the usecase from your token."
            }
          }
        }
      },
      {
        "name": "peek",
        "description": "Preview a table by showing its structure and sample rows.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "table_name": {"type": "string", "description": "Name of the table to preview"},
            "limit": {"type": "integer", "description": "Number of rows to preview (default: 5, max: 20)"},
            "usecase_id": {"type": "string", "description": "Optional usecase identifier"}
          },
          "required": ["table_name"]
        }
      },
      {
        "name": "validate_gold_request",
        "description": "Validates a create_gold_table request.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "name": {"type": "string", "description": "Proposed name for the gold table"},
            "description": {"type": "string", "description": "Description of the table content"},
            "source_tables": {"type": "string", "description": "Comma-separated list of silver table names"},
            "questions": {"type": "string", "description": "Explicit SQL instructions derived from the user's request"}
          },
          "required": ["name", "description"]
        }
      },
      {
        "name": "create_gold_table",
        "description": "Create a new gold table using AI to generate SQL.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "name": {"type": "string", "description": "Name for the new table"},
            "description": {"type": "string", "description": "What the table should contain"},
            "questions": {"type": "string", "description": "Explicit SQL instructions that drive the generated query"},
            "source_tables": {"type": "string", "description": "Comma-separated list of silver table names to use"}
          },
          "required": ["name", "description"]
        }
      }
    ]
  }
}
```
  {{< /tab >}}
{{< /tabs >}}

### `tools/call`

Execute a specific tool.

{{< callout type="warning" >}}
**Authentication**: Required (`mcp:tools` scope)
{{< /callout >}}

{{< tabs items="Request,Response" >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "call-tool",
  "method": "tools/call",
  "params": {
    "name": "peek",
    "arguments": {
      "table_name": "ventas_mensuales",
      "limit": 3
    }
  }
}
```
  {{< /tab >}}
  {{< tab >}}
```json
{
  "jsonrpc": "2.0",
  "id": "call-tool",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"table_name\": \"ventas_mensuales\",\n  \"columns\": [\n    {\"name\": \"mes\", \"type\": \"varchar\"},\n    {\"name\": \"total_ventas\", \"type\": \"decimal\"}\n  ],\n  \"preview\": [\n    {\"mes\": \"2024-01\", \"total_ventas\": 145230.50},\n    {\"mes\": \"2024-02\", \"total_ventas\": 158940.75}\n  ],\n  \"total_rows\": 12\n}"
      }
    ]
  }
}
```
  {{< /tab >}}
{{< /tabs >}}

## Available Tools

### Data Warehouse Query Tools

#### `list_gold_tables`

List all GOLD (analytical) tables in the data warehouse.

**Parameters**:
- `usecase_id` (string, optional): Usecase identifier. Uses token value if not provided.

**Returns**: Table names, column schemas, status, row counts and metadata.

#### `list_silver_tables`

List all SILVER (processed) tables in the data warehouse.

**Parameters**:
- `usecase_id` (string, optional): Usecase identifier

**Returns**: Table names, columns, data types, foreign key relationships, processing status.

#### `peek`

Preview a table by showing its structure and sample rows.

**Parameters**:
- `table_name` (string, required): Name of the table to preview
- `limit` (integer, optional): Number of rows to return (default: 5)
- `usecase_id` (string, optional): Usecase identifier

**Works With**: Both SILVER and GOLD tables

**Example Workflow**:
1. Call `list_silver_tables()` to see available tables
2. Call `peek('tablename')` to preview its data

#### `get_gold_sql`

Get the SQL query definition for a gold table.

**Parameters**:
- `table_name` (string, required): Name of the gold table
- `usecase_id` (string, optional): Usecase identifier

#### `get_table_relationships`

Get foreign key relationships between silver tables.

**Parameters**:
- `usecase_id` (string, optional): Usecase identifier

**Use Case**: Helps choose related tables when creating gold tables.

---

### Table Management Tools

#### `validate_gold_request`

Validates a create_gold_table request.

**Parameters**:
- `name` (string, required): Proposed name for the gold table
- `description` (string, required): Description of the table content
- `source_tables` (string, optional): Comma-separated list of silver table names
- `questions` (string, optional): Explicit SQL instructions

{{< callout type="warning" >}}
Must be called and results shown to the user **before** calling `create_gold_table`.
{{< /callout >}}

#### `create_gold_table`

Create a new gold table using AI to generate SQL.

**Parameters**:
- `name` (string, required): Name for the new gold table
- `description` (string, required): What the table should contain
- `questions` (string, optional): Explicit SQL instructions that drive the generated query
- `source_tables` (string, optional): Comma-separated silver table names to use

**Required Workflow**:
1. Call `list_silver_tables()` to see available data
2. Call `get_table_relationships()` to see how tables connect
3. Call `validate_gold_request()` → show results to user
4. Call `create_gold_table()` with selected source tables

#### `get_table_status`

Get detailed status of a specific table.

**Parameters**:
- `table_name` (string, required): Name of the table
- `usecase_id` (string, optional): Usecase identifier

---

## Session Management

### Session Lifecycle

1. **Initialize**: Call `initialize` method to optionally create a session
2. **Session ID**: Server returns `mcp-session-id` header if session is created
3. **Subsequent Requests**: Optionally include session ID in requests
4. **Validation**: Server validates session only if `mcp-session-id` header is provided

### Session Headers

```http
mcp-session-id: 550e8400-e29b-41d4-a716-446655440000
```

Sessions are **optional** for the current implementation. Session validation only occurs when `mcp-session-id` header is present.

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

{{< tabs items="Missing Auth,Insufficient Scope,Session Not Found" >}}
  {{< tab >}}
```json
{
  "error": {
    "code": -32000,
    "message": "Authentication required"
  }
}
```
  {{< /tab >}}
  {{< tab >}}
```json
{
  "error": {
    "code": -32000,
    "message": "Insufficient scope: requires mcp:tools:your-usecase-id"
  }
}
```
  {{< /tab >}}
  {{< tab >}}
```json
{
  "error": {
    "code": -32000,
    "message": "Session not found"
  }
}
```
  {{< /tab >}}
{{< /tabs >}}

## Batch Requests

MCP supports JSON-RPC batch requests for multiple operations:

{{< tabs items="Request,Response" >}}
  {{< tab >}}
```json
[
  {"jsonrpc": "2.0", "id": "1", "method": "tools/list"},
  {"jsonrpc": "2.0", "id": "2", "method": "resources/list"}
]
```
  {{< /tab >}}
  {{< tab >}}
```json
[
  {"jsonrpc": "2.0", "id": "1", "result": {"tools": [...]}},
  {"jsonrpc": "2.0", "id": "2", "result": {"resources": [...]}}
]
```
  {{< /tab >}}
{{< /tabs >}}

{{< callout type="warning" >}}
- `initialize` method cannot be part of batch requests
- Methods `initialize` and `tools/list` do not require authentication
- All other methods in batch must have valid authentication (JWT with `mcp:tools` scope)
- Batch processing is not strictly atomic — each request is processed independently
{{< /callout >}}

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

## Usage Tracking

All tool executions are automatically tracked for billing integration, performance monitoring, and audit trails.

## Rate Limiting

- Authentication required for all methods except `initialize` and `tools/list`
- Usage tracked per use case and user
- Enterprise customers: Higher rate limits available
- Streaming connections: Independent rate limiting

## Security Features

| Feature | Details |
|---------|---------|
| Token Validation | JWT signature verification, scope-based authorization |
| Data Access Control | Use case-specific data access, dynamic scope validation |
| Transport Security | HTTPS required, CORS protection, request/response logging |
| Audit Logging | Complete request/response logging, user activity tracking |

## Support

For technical support:
- **API Issues**: Include request ID for faster resolution
- **Authentication**: Contact your Teramot administrator
- **Enterprise Support**: Priority support available

---

**Specification Compliance**: This implementation follows the MCP 2025-11-25 specification with enterprise security enhancements.
