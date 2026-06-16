---
title: Autenticación
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Autenticación

El servidor MCP de Teramot admite dos modos de autenticación. Ambos envían un token Bearer al
servidor; elige el que admita tu cliente.

| Modo | Úsalo para |
| --- | --- |
| **OAuth 2.0 + PKCE** | Claude (Code, Desktop, Browser), ChatGPT y cualquier cliente que pueda completar un flujo OAuth |
| **API key estática** | Cursor, v0.dev, Antigravity y cualquier cliente que solo admita un token Bearer estático |

Ambos modos coexisten en el mismo endpoint y otorgan el mismo acceso. Los métodos de descubrimiento
`initialize` y `tools/list` no requieren ningún token (ver
[Introducción → Métodos de arranque](./intro.md#métodos-de-arranque-sin-autenticación)).

<Admonition type="info">
Tu conexión es **a nivel de cuenta**: las mismas credenciales aplican a todos los workspaces y
proyectos de tu cuenta Teramot. No necesitas un token distinto por workspace.
</Admonition>

## OAuth 2.0 + PKCE

Es la opción recomendada para los clientes que la admiten. Solo configuras dos valores —
la **URL del MCP** (`https://mcp.teramot.com/mcp`) y el **Client ID**
(`5nldf3wj83yz9f6zbrsjx`). El cliente abre una ventana del navegador, inicias sesión en Teramot
y el cliente recibe y renueva los tokens automáticamente.

Internamente, el servidor expone los metadatos y endpoints estándar de OAuth 2.0, de modo que la
mayoría de los clientes MCP se configuran solos sin datos adicionales:

- `GET /.well-known/oauth-authorization-server` — metadatos del servidor de autorización (RFC 8414)
- `GET /.well-known/oauth-protected-resource` — metadatos del recurso protegido (RFC 9728)
- `GET /authorize` — endpoint de autorización
- `POST /token` — endpoint de token
- `POST /register` — registro dinámico de clientes

El flujo usa PKCE (`S256`) y los scopes `openid email access offline_access`. Consulta
**[Conectar tu cliente](./connect-clients.md)** para los pasos por cliente.

## API key estática

Para los clientes que no pueden completar el handshake de OAuth (Cursor, v0.dev, Antigravity),
genera una API key estática y envíala como token Bearer.

### Generar una key

1. Abre la app de Teramot y ve a la página **MCP**.
2. En la sección **API Keys**, escribe un nombre (p. ej. `cursor-work`) y haz clic en **Generate Key**.
3. **Copia la key ahora — no se volverá a mostrar.**

Puedes crear varias keys (una por cliente/máquina) y eliminar cualquiera de ellas más tarde desde
la misma página.

### Usar la key

Envíala en el encabezado `Authorization`:

```http
Authorization: Bearer YOUR_API_KEY
```

La mayoría de los clientes MCP aceptan un encabezado personalizado en su configuración de servidor:

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

<Admonition type="caution">
Trata las API keys como contraseñas. Otorgan acceso completo a los datos de tu cuenta. Si una key
se filtra, elimínala desde la página **MCP → API Keys** y genera una nueva.
</Admonition>

## Errores

| Situación | Resultado |
| --- | --- |
| Sin token en un método autenticado | `401 Unauthorized` |
| Token expirado o inválido | `401 Unauthorized` |
| Falta `Mcp-Session-Id` en `GET /mcp` | `401 Unauthorized` (`missing Mcp-Session-Id; re-initialize via POST`) |
