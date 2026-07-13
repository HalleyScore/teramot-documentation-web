---
title: Tools Reference
sidebar_position: 4
---

# Tools Reference

The complete catalog of tools exposed by the Teramot MCP server, grouped by domain.
Discover them at runtime with `tools/list`; invoke them with `tools/call`
(see the [Overview](./intro.md#mcp-methods)).

Most tools accept optional `workspace_name` and `project_name` arguments. When omitted, the
server uses your active context (or the only workspace/project available). If you have multiple
workspaces, name the one you mean.

## Workspaces

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_workspaces` | List all workspaces the user has access to. | — |
| `create_workspace` | Create a new workspace, the top-level container for projects and data sources. | `name` (string, required); `index_color` (int) |
| `delete_workspace` | Permanently delete a workspace by name. Irreversible; requires owner access. Two-step confirm gate. | `workspace_name` (string, required); `confirmed` (bool) |

## Projects

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_projects` | List all projects, optionally filtered by workspace. | `workspace_name` (string) |
| `create_project` | Create a new project inside a workspace. | `workspace_name` (string, required); `slug` (string, required, 1–28 URL-safe chars); `region` (string, required); `status` (string, required: active \| inactive \| pending) |
| `delete_project` | Permanently delete a project by name. Irreversible; requires owner access. Two-step confirm gate. | `project_name` (string, required); `workspace_name` (string); `confirmed` (bool) |

## Tables & data

| Tool | Description | Parameters |
| --- | --- | --- |
| `explore_tables` | List or inspect data-warehouse tables. **Listing** (no `table_name`): table names, filterable by `layer`. **Detail** (`table_name` set): one table's SQL, build status, lineage, data-quality profile, and column findings. `with_build_context` returns candidate source tables + join keys for a new results table. | `table_name` (string, required if `with_sql`, `with_quality`, or `with_status` is used); `layer` (string: gold \| silver \| bronze); `with_columns` (bool); `with_instructions` (bool); `with_sql` (bool); `with_information` (bool); `with_quality` (bool); `with_status` (bool); `with_build_context` (bool); `build_context_table_names` (array of string); `workspace_name`/`project_name` (string) |
| `preview_table` | Preview the first 100 rows of a table (columns, types, sample rows). Accepts physical or logical name. | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `query_data` | Execute a SQL query (TRINO dialect) against a table; returns JSON. Supports pagination via `execution_id` + `page`. | `table_name` (string, required); `sql` (string, required unless `execution_id` set); `execution_id` (string); `page` (int); `workspace_name`/`project_name` (string) |

## Results (gold) tables

| Tool | Description | Parameters |
| --- | --- | --- |
| `create_gold_table` | Create a results table (analysis spec) — generates SQL from source tables + questions. `validate_only=true` runs preflight checks only, without creating anything. | `source_tables` (string, required; table names as CSV or a JSON array of `{name, description, columns}`, from `explore_tables`); `name` (string); `description` (string); `questions` (string); `knowledges` (string); `join_keys` (string); `validate_only` (bool); `workspace_name`/`project_name` (string) |
| `update_gold_table` | Update an existing results table: update its description, manage instructions, or regenerate its query. | `analysis_spec_name` (string, required); `action` (string, required: update_description \| create_instruction \| update_instruction \| replace_instruction \| delete_instruction \| regenerate_query); `description` (string, required if `action`=update_description); `instructions` (array of `{id?, text}`, required for create_instruction/update_instruction/replace_instruction — each item needs `id` for update_instruction); `instruction_ids` (array of string, required if `action`=delete_instruction); `workspace_name`/`project_name` (string) |
| `delete_gold_table` | Permanently delete a results table and all its data. Two-step confirm gate. | `analysis_spec_name` (string); `confirmed` (bool); `workspace_name`/`project_name` (string) |
| `duplicate_gold_table` | Duplicate a results table into a new draft analysis spec. | `analysis_spec_name` (string, required); `dry_run` (bool — verify the source table exists without creating the copy); `workspace_name`/`project_name` (string) |

## Refresh & scheduling

| Tool | Description | Parameters |
| --- | --- | --- |
| `refresh_tables` | Trigger an ETL refresh — one table's pipeline or the whole project — to pick up new source data (produces a new revision). | `action` (string, required: refresh_table \| refresh_all); `table_name` (string, required if `action` = refresh_table); `workspace_name`/`project_name` (string) |
