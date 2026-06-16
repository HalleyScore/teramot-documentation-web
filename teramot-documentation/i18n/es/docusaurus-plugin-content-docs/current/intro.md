---
title: Teramot MCP — Introducción
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Teramot MCP — Introducción

El servidor Model Context Protocol (MCP) de Teramot permite que cualquier cliente de IA
compatible con MCP (Claude, ChatGPT, Cursor y otros) trabaje directamente con tu plataforma
de datos Teramot. Una vez conectado, el cliente puede explorar tus workspaces, proyectos y
fuentes de datos, previsualizar y consultar tablas, y crear nuevas tablas de resultados (gold)
— todo mediante lenguaje natural.

Implementa el transporte MCP **Streamable HTTP** con OAuth 2.0 (o un token estático) para la
autenticación.

## Datos esenciales de conexión

| | |
| --- | --- |
| **Endpoint** | `https://mcp.teramot.com/mcp` |
| **Transporte** | Streamable HTTP (`POST` para JSON-RPC, `GET` para el stream SSE) |
| **Client ID** | `5nldf3wj83yz9f6zbrsjx` |
| **Autenticación** | OAuth 2.0 + PKCE, o una API key estática (token Bearer) |
| **Servidor** | `teramot-mcp` `v0.1.0` |

<Admonition type="tip">
La mayoría de los usuarios no necesita tocar el protocolo directamente — consulta
**[Conectar tu cliente](./connect-clients.md)** para la configuración lista para copiar y pegar
de Claude, ChatGPT, Cursor, v0.dev y Antigravity. Esta página documenta el protocolo subyacente
para integraciones personalizadas.
</Admonition>

## Cómo funciona la conexión

1. El cliente apunta a `https://mcp.teramot.com/mcp` y (para clientes OAuth) al Client ID anterior.
2. El cliente llama a `initialize` y `tools/list` para descubrir capacidades — esto **no requiere autenticación**.
3. Para cualquier trabajo real (`tools/call`), el cliente se autentica con un token Bearer, obtenido
   mediante el flujo automático de OAuth o una API key estática. Ver **[Autenticación](./authentication.md)**.

## Transporte y endpoints

Todo el tráfico va a un único endpoint: `https://mcp.teramot.com/mcp`.

### `POST /mcp`

Transporta solicitudes JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`, …). Las respuestas
se devuelven como `application/json` o, para operaciones en streaming, como `text/event-stream`.

```http
POST /mcp HTTP/1.1
Host: mcp.teramot.com
Authorization: Bearer YOUR_TOKEN
Accept: application/json, text/event-stream
Content-Type: application/json
Mcp-Session-Id: SESSION_UUID   # devuelto tras initialize
```

### `GET /mcp`

Abre un stream Server-Sent Events para mensajes del servidor al cliente. Requiere el encabezado
`Mcp-Session-Id` devuelto por `initialize`; sin él, el servidor responde `401 Unauthorized`
(`missing Mcp-Session-Id; re-initialize via POST`).

### Métodos de arranque (sin autenticación)

Para permitir que los clientes descubran el servidor antes de autorizar, tres métodos omiten la autenticación:

- `initialize`
- `tools/list`
- `notifications/initialized`

Cualquier otro método requiere un token Bearer válido.

## Gestión de sesión

`initialize` devuelve un encabezado de respuesta `Mcp-Session-Id`. Inclúyelo en las solicitudes
posteriores y en el stream `GET /mcp`. Las sesiones se mantienen en memoria y se reinician cuando
el servidor se reinicia — si se pierde una sesión, simplemente vuelve a llamar a `initialize`.

## Métodos MCP

### `initialize`

Negocia la versión del protocolo y las capacidades. **No requiere autenticación.**

<Tabs>
<TabItem value="request" label="Solicitud">

```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "clientInfo": { "name": "MyApp", "version": "1.0.0" }
  }
}
```

</TabItem>
<TabItem value="response" label="Respuesta">

```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": { "listChanged": true } },
    "serverInfo": { "name": "teramot-mcp", "version": "v0.1.0" },
    "instructions": "You are connected to the Teramot data platform. Help users explore their workspaces, projects, data sources, tables, and create results tables."
  }
}
```

</TabItem>
</Tabs>

La respuesta incluye el encabezado `Mcp-Session-Id` para las solicitudes posteriores.

### `tools/list`

Lista las herramientas disponibles. **No requiere autenticación** (parte del flujo de arranque).
Consulta el catálogo completo en **[Referencia de herramientas](./tools-reference.md)**.

<Tabs>
<TabItem value="request" label="Solicitud">

```json
{
  "jsonrpc": "2.0",
  "id": "list-tools",
  "method": "tools/list"
}
```

</TabItem>
<TabItem value="response" label="Respuesta">

```json
{
  "jsonrpc": "2.0",
  "id": "list-tools",
  "result": {
    "tools": [
      {
        "name": "list_workspaces",
        "description": "Lists all workspaces the user has access to.",
        "inputSchema": { "type": "object", "properties": {} }
      },
      {
        "name": "preview_table",
        "description": "Preview the first 100 rows of a data table.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "table_name": { "type": "string", "description": "Name of the table to preview" }
          },
          "required": ["table_name"]
        }
      }
    ]
  }
}
```

</TabItem>
</Tabs>

### `tools/call`

Ejecuta una herramienta. **Requiere autenticación** (token Bearer).

<Tabs>
<TabItem value="request" label="Solicitud">

```json
{
  "jsonrpc": "2.0",
  "id": "call-tool",
  "method": "tools/call",
  "params": {
    "name": "preview_table",
    "arguments": { "table_name": "sales" }
  }
}
```

</TabItem>
<TabItem value="response" label="Respuesta">

```json
{
  "jsonrpc": "2.0",
  "id": "call-tool",
  "result": {
    "content": [
      { "type": "text", "text": "{ \"columns\": [...], \"rows\": [...] }" }
    ]
  }
}
```

</TabItem>
</Tabs>

## Manejo de errores

Aplican los códigos de error estándar de JSON-RPC 2.0:

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "error": { "code": -32602, "message": "Invalid params" }
}
```

| Código | Significado |
| --- | --- |
| `-32700` | Error de parseo (JSON inválido) |
| `-32600` | Solicitud inválida (JSON-RPC mal formado) |
| `-32601` | Método no encontrado |
| `-32602` | Parámetros inválidos |
| `-32000` | Error interno / de autenticación |

En la capa HTTP, un token ausente o expirado devuelve `401 Unauthorized`.

## Próximos pasos

- **[Autenticación](./authentication.md)** — OAuth 2.0 y API keys estáticas.
- **[Conectar tu cliente](./connect-clients.md)** — Claude, ChatGPT, Cursor, v0.dev, Antigravity.
- **[Referencia de herramientas](./tools-reference.md)** — el catálogo completo de herramientas disponibles.
