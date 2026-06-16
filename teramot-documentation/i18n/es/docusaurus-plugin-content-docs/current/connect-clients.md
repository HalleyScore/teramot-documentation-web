---
title: Conectar tu cliente
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Conectar tu cliente

Usa estos valores para conectar tu cliente MCP al servidor MCP de Teramot.

| | |
| --- | --- |
| **URL del MCP** | `https://mcp.teramot.com/mcp` |
| **Client ID** | `5nldf3wj83yz9f6zbrsjx` |

<Admonition type="info">
**Claude** y **ChatGPT** se autentican con OAuth — solo necesitan la URL del MCP (y el Client ID
si se les solicita). **Cursor**, **v0.dev** y **Antigravity** usan una API key estática — genera una
primero en la página **MCP → API Keys** (ver [Autenticación](./authentication.md#api-key-estática)).
</Admonition>

<Tabs>

<TabItem value="claude-code" label="Claude Code">

Ejecuta este comando en tu terminal:

```bash
claude mcp add --transport http --client-id 5nldf3wj83yz9f6zbrsjx --callback-port 8090 teramot https://mcp.teramot.com/mcp
```

Se abre una ventana del navegador para que autorices con Teramot. Después, las herramientas
`teramot` quedan disponibles en Claude Code.

</TabItem>

<TabItem value="claude-desktop" label="Claude Desktop / Browser">

1. Abre **Settings → Developer → MCP Servers** (o **Edit Config**).
2. Agrega un nuevo servidor con estos valores:
   - **Name:** `teramot`
   - **Transport:** `HTTP`
   - **URL:** `https://mcp.teramot.com/mcp`
   - **Client ID:** `5nldf3wj83yz9f6zbrsjx` (si es necesario)
3. Guarda y reinicia Claude Desktop.
4. Abre un nuevo chat y activa el conector **teramot**.

</TabItem>

<TabItem value="chatgpt" label="ChatGPT">

En ChatGPT, abre **Settings → Apps** (o **Apps & Connectors**), agrega una app MCP personalizada
y usa estos valores:

- **Server URL:** `https://mcp.teramot.com/mcp`
- **Client ID:** `5nldf3wj83yz9f6zbrsjx`

Paso a paso en ChatGPT Desktop / Browser:

1. Abre ChatGPT y ve a **Settings**.
2. Abre **Apps** (o **Apps & Connectors**) y crea/importa una app MCP personalizada.
3. Configura la app con estos valores:
   - **Name:** `teramot`
   - **Transport:** `HTTP`
   - **URL:** `https://mcp.teramot.com/mcp`
   - **Client ID:** `5nldf3wj83yz9f6zbrsjx` (si es necesario)
4. Guarda la configuración y completa la autorización si se solicita.
5. Abre un nuevo chat y habilita la app **teramot**.

</TabItem>

<TabItem value="cursor" label="Cursor">

Cursor usa una **API key estática**. Primero genera una en la página **MCP → API Keys**
(ver [Autenticación](./authentication.md#api-key-estática)), luego agrega el servidor a tu
configuración MCP (Settings → MCP, o `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "teramot": {
      "url": "https://mcp.teramot.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

</TabItem>

<TabItem value="v0" label="v0.dev">

v0.dev usa una **API key estática**. Genera una en la página **MCP → API Keys**
(ver [Autenticación](./authentication.md#api-key-estática)) y agrega el servidor con el
encabezado `Authorization: Bearer`:

```json
{
  "mcpServers": {
    "teramot": {
      "url": "https://mcp.teramot.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

</TabItem>

<TabItem value="antigravity" label="Antigravity">

Antigravity usa una **API key estática**. Genera una en la página **MCP → API Keys**
(ver [Autenticación](./authentication.md#api-key-estática)) y configura el servidor MCP con el
encabezado `Authorization: Bearer`:

```json
{
  "mcpServers": {
    "teramot": {
      "url": "https://mcp.teramot.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

</TabItem>

</Tabs>

## Verificar la conexión

Una vez conectado, pídele a tu cliente que **liste tus workspaces** — debería llamar a
`list_workspaces` y devolverlos. A partir de ahí puedes explorar proyectos, previsualizar tablas y
crear tablas de resultados. Consulta la **[Referencia de herramientas](./tools-reference.md)** completa.
