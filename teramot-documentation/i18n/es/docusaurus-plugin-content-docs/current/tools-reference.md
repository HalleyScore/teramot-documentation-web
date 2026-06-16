---
title: Referencia de herramientas
sidebar_position: 4
---

# Referencia de herramientas

El catálogo completo de herramientas expuestas por el servidor MCP de Teramot, agrupadas por dominio.
Descúbrelas en tiempo de ejecución con `tools/list`; invócalas con `tools/call`
(ver la [Introducción](./intro.md#métodos-mcp)).

La mayoría de las herramientas aceptan los argumentos opcionales `workspace_name` y `project_name`.
Si se omiten, el servidor usa tu contexto activo (o el único workspace/proyecto disponible). Si tienes
varios workspaces, nombra el que quieras usar.

Los nombres de las herramientas y de los parámetros se mantienen en inglés porque son identificadores
de la API.

## Workspaces

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_workspaces` | Lista todos los workspaces a los que el usuario tiene acceso. Úsala primero para encontrar el nombre del workspace antes de listar proyectos. | — |
| `create_workspace` | Crea un nuevo workspace — el contenedor de nivel superior que debes crear antes que proyectos o fuentes de datos. | `name` (string, requerido); `index_color` (int); `index_icon` (int) |
| `update_workspace` | Actualiza el nombre o la apariencia de un workspace existente. | `workspace_name` (string, requerido); `name` (string); `index_color` (int); `index_icon` (int) |
| `delete_workspace` | Elimina permanentemente un workspace por nombre. Irreversible; requiere acceso de owner. | `workspace_name` (string, requerido) |
| `get_workspace_owner` | Devuelve el owner (miembro con rol `owner`) de un workspace. | `workspace_name` (string) |
| `get_workspace_members_idp_subs` | Devuelve los sujetos IDP (`idp_sub`) de todos los miembros del workspace. Útil al configurar usuarios de data egress. | `workspace_name` (string) |
| `get_workspace_subscription` | Devuelve la suscripción de facturación activa de un workspace, o null para el plan gratuito. | `workspace_name` (string) |

## Proyectos

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_projects` | Lista todos los proyectos, opcionalmente filtrados por workspace. | `workspace_name` (string) |
| `create_project` | Crea un nuevo proyecto dentro de un workspace. | `workspace_name` (string, requerido); `slug` (string, requerido, 1–28 caracteres URL-safe); `region` (string, requerido); `status` (string, requerido: active \| inactive \| pending) |
| `update_project` | Actualiza el nombre, slug, región o estado de un proyecto. | `project_name` (string, requerido); `workspace_name` (string); `name` (string); `slug` (string); `region` (string); `status` (string) |
| `delete_project` | Elimina permanentemente un proyecto por nombre. Irreversible; requiere acceso de owner. | `project_name` (string, requerido); `workspace_name` (string) |

## Fuentes e ingesta

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_sources` | Lista todas las fuentes de datos ETL de un proyecto. | `workspace_name` (string); `project_name` (string) |
| `create_etl_source` | Crea una fuente de datos ETL conectada a una base de datos o almacenamiento existente. El secret referenciado ya debe existir. | `name` (string, requerido); `secret_name` (string, requerido); `engine` (string, requerido: postgresql \| mysql \| s3 \| bigquery); `slug` (string); `kind` (string); `tables_descriptions` (array); `workspace_name`/`project_name` (string) |
| `get_etl_source` | Recupera los detalles de una fuente ETL (estado, engine, clave de config, tablas descubiertas). | `source_id` o `source_name` (string); `workspace_name`/`project_name` (string) |
| `delete_etl_source` | Elimina una fuente ETL permanentemente. El secret asociado no se elimina. | `source_id` o `source_name` (string, uno requerido); `workspace_name`/`project_name` (string) |
| `discover_schema` | Conecta con la fuente y obtiene sus tablas disponibles. Llamar después de `create_etl_source`. | `source_id` o `source_name` (string); `workspace_name`/`project_name` (string) |
| `update_etl_source_tables` | Selecciona qué tablas ingerir (y descripciones opcionales). Luego llama a `publish_source` + `wait_for_publish_completion`. | `tables_descriptions` (array, requerido); `source_id`/`source_name` (string); `workspace_name`/`project_name` (string) |
| `publish_source` | Publica una fuente ETL, disparando el pipeline asíncrono de ingesta/procesamiento. | `source_id` o `source_name` (string); `workspace_name`/`project_name` (string) |
| `get_etl_source_status` | Estado de ciclo de vida puntual de una fuente ETL (created, disconnected, published, …). | `source_id` o `source_name` (string); `workspace_name`/`project_name` (string) |
| `test_connection` | Prueba la conexión de una fuente creando una fuente temporal y ejecutando discovery. Limpia en caso de fallo salvo `keep_on_failure`. | `name` (string, requerido); `engine` (string, requerido); campos de conexión (`host`, `port`, `database`, `schema`, `user`, `password`, `path`, `bq_project_id`, `dataset`, `credentials_json`); `keep_on_failure` (bool); `workspace_name`/`project_name` (string) |
| `wait_for_publish_completion` | Hace polling del pipeline de publicación. Cuando `completed` es false, vuelve a llamar con los `follow_up_arguments` devueltos. | `source_id` o `source_name` (string); `timeout_seconds` (int); `workspace_name`/`project_name` (string) |

## Secrets

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_secrets` | Lista todas las claves de secrets de un proyecto (solo claves y versiones — los valores nunca se devuelven). | `workspace_name` (string); `project_name` (string) |
| `create_secret` | Crea o actualiza un secret con credenciales de base de datos/S3/BigQuery. Convención: clave `source_<slug>_config`. | `key` (string, requerido); `engine` (string, requerido: postgresql \| mysql \| s3 \| bigquery); campos según engine (`host`, `port`, `database`, `schema`, `user`, `password`, `path`, `bq_project_id`, `dataset`, `credentials_json`); `workspace_name`/`project_name` (string) |

## Archivos y sistema de archivos

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `prepare_file_upload` | Genera URLs S3 PUT prefirmadas para subida directa (`.csv`, `.xls`, `.xlsx`, `.parquet`; hasta 20 archivos; las URLs expiran en 30 min). | `file_names` (array, requerido); `parent_path` (string); `workspace_name`/`project_name` (string) |
| `create_source_from_upload` | Finaliza un lote de subida registrando los archivos como una fuente ETL de S3. No publica automáticamente. | `uploaded_files` (array de `{name, key, s3_uri}`, requerido); `source_name` (string); `mode` (string: concat \| independent); `workspace_name`/`project_name` (string) |
| `list_uploaded_files` | Lista los archivos subidos previamente al bucket S3 del proyecto. | `workspace_name` (string); `project_name` (string) |
| `delete_uploaded_files` | Elimina permanentemente uno o más archivos subidos. No elimina las fuentes ETL que los referencian. | `file_names` (array, requerido); `workspace_name`/`project_name` (string) |
| `download_uploaded_file` | Construye una URL de descarga autenticada para un archivo subido (requiere el token bearer del solicitante). | `file_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `list_fs_nodes` | Lista el árbol de archivos del proyecto (archivos y carpetas) como jerarquía. | `parent_id` (string); `workspace_name`/`project_name` (string) |
| `create_folder` | Crea una carpeta en el sistema de archivos del proyecto. | `name` (string, requerido); `parent_path` (string); `workspace_name`/`project_name` (string) |
| `rename_node` | Renombra un archivo o carpeta (se mantiene bajo el mismo padre — usa `move_node` para reubicar). | `path` (string, requerido); `new_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `rename_uploaded_file` | Alias de `rename_node`, acotado a archivos subidos por el usuario. | `path` (string, requerido); `new_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `move_node` | Mueve un archivo o carpeta bajo un padre distinto. | `path` (string, requerido); `new_parent_path` (string, requerido); `workspace_name`/`project_name` (string) |
| `move_uploaded_file` | Alias de `move_node`, acotado a archivos subidos por el usuario. | `path` (string, requerido); `new_parent_path` (string, requerido); `workspace_name`/`project_name` (string) |
| `delete_node` | Elimina un archivo o carpeta (las carpetas eliminan todos sus descendientes). Irreversible. | `path` (string, requerido); `workspace_name`/`project_name` (string) |

## Tablas y datos

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_available_tables` | Lista las tablas del data warehouse. Filtra por `layer`; incluye columnas con `with_columns`. | `with_columns` (bool); `layer` (string: gold \| silver \| bronze); `workspace_name`/`project_name` (string) |
| `get_sources` | Lista todas las fuentes de datos ETL configuradas para el proyecto actual. | `workspace_name` (string); `project_name` (string) |
| `preview_table` | Previsualiza las primeras 100 filas de una tabla (columnas, tipos, filas de muestra). Acepta nombre físico o lógico. | `table_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `query_data` | Ejecuta una consulta SQL (dialecto TRINO) contra una tabla; devuelve JSON. Soporta paginación con `execution_id` + `page`. | `table_name` (string, requerido); `sql` (string, requerido salvo que se use `execution_id`); `execution_id` (string); `page` (int); `workspace_name`/`project_name` (string) |
| `get_sql_definition` | Recupera el `SELECT` SQL detrás de una tabla de resultados (analysis spec). | `table_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `get_table_code` | Devuelve el SQL generado que produce una tabla de origen o procesada. | `table_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `get_artifacts` | Lista las tablas de origen (artifacts) del proyecto, con descripciones y columnas. Primer paso obligatorio antes de `create_gold_table`. | `workspace_name` (string); `project_name` (string) |
| `profile_table` | Perfila una tabla: total de filas, % de nulos, conteos únicos, valores frecuentes. Opera sobre el proyecto ligado al JWT. | `table_name` (string, requerido) |

## Tablas de resultados (gold)

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `validate_gold_request` | Valida una solicitud de tabla de resultados antes de crearla (nombre, tablas de origen, % de nulos en join keys, …). | `name` (string, requerido); `description` (string); `source_tables` (string); `questions` (string); `join_keys` (string); `workspace_name`/`project_name` (string) |
| `create_gold_table` | Crea una tabla de resultados (analysis spec); genera SQL a partir de las tablas de origen + questions. Llama a `get_artifacts` primero. | `source_tables` (string, requerido, array JSON de `get_artifacts`); `name` (string); `description` (string); `questions` (string); `knowledges` (string); `workspace_name`/`project_name` (string) |
| `list_analysis_specs` | Lista todas las tablas de resultados (analysis specs) del proyecto actual. | `workspace_name` (string); `project_name` (string) |
| `update_gold_table` | Actualiza la descripción de una tabla de resultados (hoy solo la descripción es mutable). | `analysis_spec_name` (string, requerido); `description` (string, requerido); `workspace_name`/`project_name` (string) |
| `delete_gold_table` | Elimina permanentemente una tabla de resultados y todos sus datos. Dos pasos: llamar con `confirmed=false`, mostrar el mensaje, luego `confirmed=true`. | `analysis_spec_name` (string); `confirmed` (bool); `workspace_name`/`project_name` (string) |
| `duplicate_gold_table` | Duplica una tabla de resultados en un nuevo analysis spec en borrador. | `analysis_spec_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `regenerate_gold_table_query` | Regenera el SQL de una tabla de resultados (p. ej. tras editar instrucciones o fuentes). | `analysis_spec_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `get_gold_table_lineage` | Devuelve el grafo de linaje de una tabla de resultados por slug (dependencias de origen y análisis derivados). | `slug` (string, requerido); `workspace_name`/`project_name` (string) |
| `create_gold_table_instructions` | Añade instrucciones de texto libre a una tabla de resultados; dispara una regeneración. | `analysis_spec_name` (string, requerido); `instructions` (array de `{text, id?}`, requerido); `workspace_name`/`project_name` (string) |
| `update_gold_table_instructions` | Actualiza instrucciones existentes (cada ítem debe incluir su id); dispara una regeneración. | `analysis_spec_name` (string, requerido); `instructions` (array de `{text, id}`, requerido); `workspace_name`/`project_name` (string) |
| `replace_gold_table_instructions` | Reemplaza el conjunto completo de instrucciones; dispara una regeneración. | `analysis_spec_name` (string, requerido); `instructions` (array de `{text, id?}`, requerido); `workspace_name`/`project_name` (string) |
| `delete_gold_table_instructions` | Elimina instrucciones específicas por ID; dispara una regeneración. | `analysis_spec_name` (string, requerido); `instruction_ids` (array, requerido); `workspace_name`/`project_name` (string) |

## Estado y monitoreo

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `get_table_status` | Estado detallado de una tabla (gold o silver), incluyendo estado de procesamiento/pipeline. | `table_name` (string, requerido); `include_progress` (bool); `workspace_name`/`project_name` (string) |
| `get_gold_table_progress` | Eventos de progreso de la creación de una tabla de resultados en curso (o reciente). | `table_name` (string, requerido); `limit` (int); `workspace_name`/`project_name` (string) |

## Refresh y programación

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `refresh_gold_table` | Refresh parcial de una sola tabla de resultados para incorporar nuevos datos de origen (genera una nueva revisión). | `table_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `refresh_all_tables` | Refresh ETL completo de todo el proyecto (genera una nueva revisión de cada tabla). | `workspace_name` (string); `project_name` (string) |
| `get_refresh_schedule` | Lista los refresh completos de una sola vez programados para un proyecto. | `workspace_name` (string); `project_name` (string) |
| `schedule_full_refresh_at` | Programa un refresh completo de una sola vez a una hora UTC específica (RFC3339). | `scheduled_at` (string, requerido, RFC3339); `workspace_name`/`project_name` (string) |
| `delete_refresh_schedule` | Elimina por nombre un refresh completo de una sola vez programado. | `name` (string, requerido); `workspace_name`/`project_name` (string) |
| `get_cron_refresh_schedule` | Obtiene el refresh recurrente (cron) del proyecto, si existe. | `workspace_name` (string); `project_name` (string) |
| `set_cron_refresh_schedule` | Crea o actualiza el refresh recurrente. | `frequency` (string, requerido: daily \| weekly \| monthly \| hourly); `time` (string, requerido, HH:MM); `timezone` (string); `interval_hours` (int, requerido para hourly); `enabled` (bool); `workspace_name`/`project_name` (string) |
| `delete_cron_refresh_schedule` | Elimina el refresh recurrente (cron) (idempotente). | `workspace_name` (string); `project_name` (string) |

## Tareas ETL

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_etl_task_chains` | Lista las cadenas de tareas ETL (pipelines de extremo a extremo) del proyecto. | `status` (string); `usecase_id` (string); `correlation_id` (string); `limit` (int); `cursor` (string); `workspace_name`/`project_name` (string) |
| `list_etl_tasks` | Lista las tareas ETL (pasos individuales dentro de una cadena). | `chain_id` (string); `status` (string); `task_id` (string); `usecase_id` (string); `correlation_id` (string); `limit` (int); `cursor` (string); `workspace_name`/`project_name` (string) |

## Data egress y compartición

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `get_data_egress_options` | Devuelve las opciones de autenticación de data egress configuradas para un proyecto. Solo lectura. | `workspace_name` (string); `project_name` (string) |
| `create_egress_user` | Crea/actualiza un usuario en AWS Identity Store y lo asigna a la aplicación Lake Formation del proyecto. | `idp_sub` (string, requerido); `workspace_name`/`project_name` (string) |
| `grant_table_access` | Otorga a un usuario de Lake Formation acceso de lectura a una o más tablas. | `user_id` (string, requerido); `tables` (array, requerido); `workspace_name`/`project_name` (string) |
| `revoke_table_access` | Revoca una única tabla de Lake Formation a un usuario. | `user_id` (string, requerido); `table_name` (string, requerido); `workspace_name`/`project_name` (string) |
| `revoke_database_access` | Revoca todo el acceso a nivel de base de datos en Lake Formation de un usuario (barre todas las tablas). | `user_id` (string, requerido); `workspace_name`/`project_name` (string) |
| `delete_egress_user` | Elimina un usuario de AWS Identity Store y quita sus permisos de egress. | `user_id` (string, requerido); `workspace_name`/`project_name` (string) |
| `get_user_tables` | Lista las tablas de Lake Formation a las que un usuario puede acceder (paginado con `next_token`). | `user_id` (string, requerido); `next_token` (string); `workspace_name`/`project_name` (string) |
| `list_data_shares` | Lista los data shares originados en el proyecto actual. | `workspace_name` (string); `project_name` (string) |
| `create_data_share` | Comparte datos con otro proyecto (consumidor), opcionalmente con límite de tiempo. | `consumer_project_id` (string, requerido); `shared_resources` (array); `expires_at` (string); `workspace_name`/`project_name` (string) |
| `update_data_share` | Actualiza un data share (hoy solo `expires_at` es mutable). | `data_share_id` (string, requerido); `expires_at` (string); `clear_expires_at` (bool); `workspace_name`/`project_name` (string) |
| `delete_data_share` | Elimina permanentemente un data share (el consumidor pierde acceso de inmediato). | `data_share_id` (string, requerido); `workspace_name`/`project_name` (string) |

## Miembros del workspace

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `list_workspace_members` | Lista todos los miembros de un workspace. Requiere rol admin. | `workspace_name` (string, requerido) |
| `get_workspace_member_role` | Obtiene el rol de un miembro (`owner`, `admin`, `member`, `read-only`). | `workspace_name` (string, requerido); `user_id` (string, requerido) |
| `add_workspace_member` | Agrega un usuario por email (lo agrega directo si existe, si no lo invita). Requiere rol admin. | `workspace_name` (string, requerido); `email` (string, requerido) |
| `update_workspace_member_role` | Actualiza el rol de un miembro. Requiere rol admin. | `workspace_name` (string, requerido); `user_id` (string, requerido); `role` (string, requerido) |
| `remove_workspace_member` | Quita un miembro de un workspace. Requiere rol admin. | `workspace_name` (string, requerido); `user_id` (string, requerido) |
| `list_workspace_invitations` | Lista las invitaciones pendientes de un workspace. Requiere rol admin. | `workspace_name` (string, requerido) |

## Chat

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `chat` | Envía un mensaje de chat; la IA entiende la intención y consulta workspaces, proyectos, fuentes y tablas. El alcance de la conversación es inmutable una vez fijado. | `message` (string, requerido); `conversation_id` (string); `workspace_id` (string); `project_id` (string) |

## Memoria

| Herramienta | Descripción | Parámetros |
| --- | --- | --- |
| `memory` | Gestiona archivos de memoria persistente del agente (view, create, str_replace, insert, delete, rename). | `command` (string, requerido: view \| create \| str_replace \| insert \| delete \| rename); `path` (string); `old_path` (string); `new_path` (string); `file_text` (string); `old_str` (string); `new_str` (string); `insert_line` (int); `insert_text` (string); `view_range` (array) |
