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

The Teramot Model Context Protocol (MCP) API provides AI-powered data engineering capabilities through a standardized protocol. Built on the MCP 2025-11-25 specification, it enables seamless integration with MCP-compatible clients while maintaining enterprise security and scalability.

**Base URL**: `https://api.teramot.com/mcp`

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI applications to securely connect to data sources and tools. Teramot's implementation provides:

- ✅ **AI-Powered Data Analysis**: Natural language to SQL query generation
- 🔐 **Enterprise Security**: JWT-based authentication with dynamic scopes
- 📊 **Usage Tracking**: Comprehensive monitoring and billing integration
- 🚀 **Real-time Streaming**: Server-Sent Events for long-running operations
<!-- - 🛠️ **Table Expert Agent**: Advanced data engineering capabilities -->

## Authentication

### JWT Token Requirements

All MCP endpoints (except `initialize` and `tools/list`) require a valid JWT token with specific scopes:

**Required Scope Pattern**: `mcp:tools:your-usecase-id`

**Example Scopes**:
- `mcp:tools:sales-analysis` - Access to sales analysis data

**Unauthenticated Methods** (bootstrap flow):
- `initialize` - Always accessible without token
- `tools/list` - Accessible without token to enable connector bootstrap

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
mcp-session-id: SESSION_UUID  # Optional, for session management
```

### Authentication Flow

<Admonition type="info">
1. **No auth required**: `initialize` and `tools/list` methods (bootstrap flow)
2. **JWT required**: All other methods (`tools/call`, `resources/list`, `resources/read`)
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

**Authentication**: Not required (part of bootstrap flow)

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

</TabItem>
<TabItem value="response" label="Response">

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

</TabItem>
</Tabs>

**Session Management**: Response includes `mcp-session-id` header for subsequent requests.

### `tools/list`

List available MCP tools.

<Admonition type="note">
**Authentication**: Not required (part of bootstrap flow)
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
            "table_name": {
              "type": "string",
              "description": "Name of the table to preview"
            },
            "limit": {
              "type": "integer",
              "description": "Number of rows to preview (default: 5, max: 20)"
            },
            "usecase_id": {
              "type": "string",
              "description": "Optional usecase identifier"
            }
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
            "name": {
              "type": "string",
              "description": "Proposed name for the gold table"
            },
            "description": {
              "type": "string",
              "description": "Description of the table content"
            },
            "source_tables": {
              "type": "string",
              "description": "Comma-separated list of silver table names"
            },
            "questions": {
              "type": "string",
              "description": "Explicit SQL instructions derived from the user's request"
            }
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
            "name": {
              "type": "string",
              "description": "Name for the new table"
            },
            "description": {
              "type": "string",
              "description": "What the table should contain"
            },
            "questions": {
              "type": "string",
              "description": "Explicit SQL instructions that drive the generated query"
            },
            "source_tables": {
              "type": "string",
              "description": "Comma-separated list of silver table names to use"
            }
          },
          "required": ["name", "description"]
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
    "name": "peek",
    "arguments": {
      "table_name": "ventas_mensuales",
      "limit": 3
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
        "text": "{\n  \"table_name\": \"ventas_mensuales\",\n  \"layer\": \"gold\",\n  \"usecase_id\": \"sales-analysis\",\n  \"columns\": [\n    {\"name\": \"mes\", \"type\": \"varchar\"},\n    {\"name\": \"total_ventas\", \"type\": \"decimal\"},\n    {\"name\": \"numero_pedidos\", \"type\": \"bigint\"},\n    {\"name\": \"ticket_promedio\", \"type\": \"decimal\"}\n  ],\n  \"preview\": [\n    {\"mes\": \"2024-01\", \"total_ventas\": 145230.50, \"numero_pedidos\": 342, \"ticket_promedio\": 424.68},\n    {\"mes\": \"2024-02\", \"total_ventas\": 158940.75, \"numero_pedidos\": 389, \"ticket_promedio\": 408.59},\n    {\"mes\": \"2024-03\", \"total_ventas\": 172815.20, \"numero_pedidos\": 401, \"ticket_promedio\": 431.04}\n  ],\n  \"total_rows\": 12,\n  \"retrieved_at\": \"2024-04-15T14:22:00Z\"\n}"
      }
    ]
  }
}
```

</TabItem>
</Tabs>

<!-- **Features**:
- Automatic `usecase_id` injection from JWT token
- Usage tracking and billing integration
- SQL query generation and execution
- Performance monitoring
- Plot generation (when applicable) -->

<!--
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
-->

## Available Tools

### Data Warehouse Query Tools

#### `list_gold_tables`

List all GOLD (analytical) tables in the data warehouse.

**Parameters**:
- `usecase_id` (string, optional): Usecase identifier. If not provided, uses the usecase from your token.

**Returns**:
- Table names and IDs
- Column schemas with data types
- Table status (ready, processing, error)
- Row counts and metadata

#### `list_silver_tables`

List all SILVER (processed) tables in the data warehouse.

**Parameters**:
- `usecase_id` (string, optional): Usecase identifier

**Returns**:
- Table names, columns, and data types
- Foreign key relationships
- Processing status and metadata

**Note**: SILVER tables are automatically created when data sources are connected and represent cleaned, processed data.

#### `peek`

Preview a table by showing its structure and sample rows.

**Parameters**:
- `table_name` (string, required): Name of the table to preview
- `limit` (integer, optional): Number of rows to return (default: 5)
- `usecase_id` (string, optional): Usecase identifier

**Works With**: Both SILVER and GOLD tables

**Returns**:
- Column names and data types
- Sample rows (up to specified limit)
- Total row count

**Example Workflow**:
1. Call `list_silver_tables()` to see available tables
2. Call `peek('tablename')` to preview its data

#### `get_gold_sql`

Get the SQL query definition for a gold table.

**Parameters**:
- `table_name` (string, required): Name of the gold table
- `usecase_id` (string, optional): Usecase identifier

**Returns**:
- Complete SQL SELECT statement
- All filters, joins, and transformations
- Table status and columns
- Creation metadata

#### `get_table_relationships`

Get foreign key relationships between silver tables.

**Parameters**:
- `usecase_id` (string, optional): Usecase identifier

**Returns**:
- Foreign key mappings
- Referenced tables and columns
- Relationship types

**Use Case**: Helps choose related tables when creating gold tables.

---

### Table Management Tools

#### `validate_gold_request`

Validates a create_gold_table request.

**Parameters**:
- `name` (string, required): Proposed name for the gold table
- `description` (string, required): Description of the table content
- `source_tables` (string, optional): Comma-separated list of silver table names
- `questions` (string, optional): Explicit SQL instructions derived from the user's request

**Required Workflow**:
Must be called and results shown to the user BEFORE calling `create_gold_table`.

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
   - high certainty → proceed to step 4
   - low certainty → ask user, then re-validate
4. Call `create_gold_table()` with selected source tables

**Implementation**: Triggers async Celery task in auto-etl for SQL generation and table creation.

#### `get_table_status`

Get detailed status of a specific table.

**Parameters**:
- `table_name` (string, required): Name of the table
- `usecase_id` (string, optional): Usecase identifier

**Returns**:
- Table metadata and columns
- Processing status
- Preview data
- Error information (if any)

---

### Project/Usecase Tools

**Note**: These tools are currently not active in the implementation.

#### `list_projects`

List all available projects/usecases.

**Returns**:
- Project IDs and names
- Status information
- Creation metadata

#### `get_project`

Get detailed information about a specific project.

**Parameters**:
- `usecase_id` (string, required): Usecase identifier

**Returns**:
- Complete project details
- Associated tables and sources
- Configuration and status -->


<!-- ---

### Table Expert Agent Tools

#### `call_table_expert_a2a`

Invoke the Table Expert Agent via A2A (Agent-to-Agent) protocol.

**Parameters**:
- `message` (string, required): Natural language question or analysis request
- `topic` (string, optional): Topic or domain for analysis
- `usecase_id` (string, optional): Usecase identifier

**Capabilities**:
- **SQL Generation**: Natural language to optimized SQL queries
- **Data Analysis**: Statistical analysis and insights
- **Visualization**: Automatic plot generation for visual data
- **Performance Tracking**: Execution time monitoring

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
- Metadata about the analysis process -->

---

<!--
### Core Integration Tools

#### `search`

ChatGPT-required search tool. Returns summarized insights for a query.

**Parameters**:
- `query` (string, required): Search query
- `limit` (int, optional): Number of results

---

#### `fetch`

ChatGPT-required fetch tool. Returns a specific resource by identifier.

**Parameters**:
- `resource_id` (string, required): Resource to fetch

---

#### `schema`

Return a minimal schema description for the current usecase.

---

#### `explain`

Provide a short explanation for a resource or query identifier.

**Parameters**:
- `id` (string, required): Identifier to explain
-->


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

### Session Behavior

- Sessions are **optional** for the current implementation
- If provided, the session will be validated
- `initialize` method can create a session, but it's not mandatory
- Session validation only occurs when `mcp-session-id` header is present

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
- Methods `initialize` and `tools/list` do not require authentication
- All other methods in batch must have valid authentication (JWT with `mcp:tools` scope)
- Batch processing is not strictly atomic - each request is processed independently
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

- Authentication required for all methods except `initialize` and `tools/list`
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

**Specification Compliance**: This implementation follows the MCP 2025-11-25 specification with enterprise security enhancements.