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
| `list_workspaces` | Lists all workspaces the user has access to. Use this first to find the workspace name before listing projects. | — |
| `create_workspace` | Create a new workspace — the top-level container you must create before projects or data sources. | `name` (string, required); `index_color` (int) |
| `delete_workspace` | Permanently delete a workspace by name. Irreversible; requires owner access. Two-step confirm gate. | `confirmed` (bool); `workspace_name` (string, required) |

## Projects

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_projects` | Lists all projects, optionally filtered by workspace. | `workspace_name` (string) |
| `create_project` | Create a new project inside a workspace. | `workspace_name` (string, required); `slug` (string, required, 1–28 URL-safe chars); `region` (string, required); `status` (string, required: active \| inactive \| pending) |
| `delete_project` | Permanently delete a project by name. Irreversible; requires owner access. Two-step confirm gate. | `confirmed` (bool); `project_name` (string, required); `workspace_name` (string) |

## Tables & data

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_available_tables` | List tables in the data warehouse. Filter by `layer`; include columns with `with_columns`; inlcude gold instructions with `with_instructions`. | `with_columns` (bool); `with_instructions` (bool); `layer` (string: gold \| silver \| bronze); `workspace_name`/`project_name` (string) |
| `preview_table` | Preview the first 100 rows of a table (columns, types, sample rows). Accepts physical or logical name. | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `query_data` | Execute a SQL query (TRINO dialect) against a table; returns JSON. Supports pagination via `execution_id` + `page`. | `table_name` (string, required); `sql` (string, required unless `execution_id` set); `execution_id` (string); `page` (int); `workspace_name`/`project_name` (string) |
| `get_sql_definition` | Retrieve the SQL `SELECT` behind a results table (analysis spec). | `table_name` (string, required); `workspace_name`/`project_name` (string) |

## Results (gold) tables

| Tool | Description | Parameters |
| --- | --- | --- |
| `create_gold_table` | Create a results table (analysis spec); generates SQL from source tables + questions. Validation is built in; `validate_only=true` runs just the preflight checks without creating anything. | `source_tables` (string, required, JSON array from `list_available_tables`); `name` (string); `description` (string); `questions` (string); `knowledges` (string); `join_keys` (string); `validate_oly` (bool); `workspace_name`/`project_name` (string) |
| `update_gold_table` | Update an existing results table: update description, manage instructions, or regenrate query. | `analysis_spec_name` (string, required); `action` (string, required: `update_description` | `create_instruction` | `update_instruction` | `replace_instruction` | `delete_instruction` | `regenerate_query`); `description` (string, required if `update_description`); `instructions` (array of `{id?, text}`, required for instructions actions except delete); `instruction_id` (array of string, required if `delete_instruction`); `workspace_name`/`project_name` (string) |
| `delete_gold_table` | Permanently delete a results table and all its data. Two-step: call with `confirmed=false`, show the message, then `confirmed=true`. | `analysis_spec_name` (string); `confirmed` (bool); `workspace_name`/`project_name` (string) |
| `duplicate_gold_table` | Duplicate a results table into a new draft analysis spec. | `analysis_spec_name` (string, required); `workspace_name`/`project_name` (string) |

## Status & monitoring

| Tool | Description | Parameters |
| --- | --- | --- |
| `get_table_status` | Detailed status of a table (gold or silver). | `table_name` (string, required); `workspace_name`/`project_name` (string) |

## Refresh & scheduling

| Tool | Description | Parameters |
| --- | --- | --- |
| `refresh_tables` | Trigger an ETL refresh: a single table's pipeline or the whole project to pick up new source data (produces a new revision). | `action` (string, required: `refresh_table` | `refresh_all`); `table_name` (string, required if `refresh_table`); `workspace_name`/`project_name` (string) |
