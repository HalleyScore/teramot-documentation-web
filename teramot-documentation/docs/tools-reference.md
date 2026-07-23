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
| `list_projects` | List projects by name. | `workspace_name` (string) |
| `create_project` | Create a new project inside a workspace. | `workspace_name` (string, required); `slug` (string, required); `region` (string, required); `status` (string, required: active \| inactive \| pending) |
| `delete_project` | Permanently delete a project by name. Irreversible; requires owner access. Two-step confirm gate. | `project_name` (string, required); `workspace_name` (string); `confirmed` (bool) |
| `review_project` | Review a project's overall state: every ETL source and its tables with each table's status and last-refresh date, plus a per-source health summary. Use for a first look at a project — what data exists and whether it's fresh, still building, or errored. | `workspace_name`/`project_name` (string) |

## Project knowledge

| Tool | Description | Parameters |
| --- | --- | --- |
| `project_knowledge` | Manage a project's durable domain-knowledge document — one markdown doc per project, curated per user, persisted across all conversations. Use it to record durable data findings; consult it before exploring a project's data. | `command` (string, required: view \| create \| str_replace \| insert \| delete); `content` (string); `old_str`/`new_str` (string — `old_str` must match exactly once); `insert_line` (int)/`insert_text` (string); `workspace_name`/`project_name` (string) |

## Tables & data

| Tool | Description | Parameters |
| --- | --- | --- |
| `explore_tables` | List or inspect data-warehouse tables. **Listing** (no `table_name`): physical table names, filterable by `layer` (`gold` \| `silver` \| `bronze`); the gold listing also includes results tables still building, failed, or in draft. **Detail** (`table_name` set): one table's SQL, build status, analysis-spec identity plus lineage (depends-on / feeds), data-quality profile, and column findings. `with_build_context` returns the project's available source tables and auto-detected foreign-key relationships, for planning a new results table. | `table_name` (string, required if `with_sql`, `with_quality`, or `with_status` is used); `layer` (string: gold \| silver \| bronze); `with_columns` (bool); `with_instructions` (bool); `with_sql` (bool); `with_information` (bool); `with_quality` (bool); `with_status` (bool); `with_build_context` (bool); `build_context_table_names` (array of string); `workspace_name`/`project_name` (string) |
| `preview_table` | Preview the first 100 rows of a table (columns, types, sample rows). | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `query_data` | Execute a SQL query (TRINO dialect) against a table. Supports pagination by passing `execution_id` + `page` from a prior response. | `table_name` (string, required); `sql` (string, required); `execution_id` (string); `page` (int); `workspace_name`/`project_name` (string) |

## Results (gold) tables

| Tool | Description | Parameters |
| --- | --- | --- |
| `create_gold_table` | Create a results table. On success it submits the build and returns immediately. `validate_only=true` runs just the preflight validation and returns a preview, without creating anything. | `source_tables` (string, required); `name` (string); `description` (string); `questions` (string); `knowledges` (string); `join_keys` (string); `validate_only` (bool); `workspace_name`/`project_name` (string) |
| `update_gold_table` | Update an existing results table: update its description, manage instructions, or regenerate its query. | `analysis_spec_name` (string, required); `action` (string, required: update_description \| create_instruction \| update_instruction \| replace_instruction \| delete_instruction \| regenerate_query); `description` (string); `instructions` (array of `{id?, text}`); `instruction_ids` (array of string); `workspace_name`/`project_name` (string) |
| `delete_gold_table` | Permanently delete a results table and all its data. Two-step confirm gate. | `analysis_spec_name` (string); `confirmed` (bool); `workspace_name`/`project_name` (string) |
| `duplicate_gold_table` | Duplicate a results table into a new draft analysis spec. | `analysis_spec_name` (string, required); `dry_run` (bool); `workspace_name`/`project_name` (string) |
| `get_gold_table_download_link` | Get a download link for a results table's full data as a CSV file. Link expires shortly after being issued. | `analysis_spec_name` (string); `visibility` (string: private \| public); `workspace_name`/`project_name` (string) |

## Refresh & scheduling

| Tool | Description | Parameters |
| --- | --- | --- |
| `refresh_tables` | Trigger an ETL refresh — one table's pipeline or the whole project — to pick up new source data (produces a new revision). | `action` (string, required: refresh_table \| refresh_all); `table_name` (string); `workspace_name`/`project_name` (string) |
