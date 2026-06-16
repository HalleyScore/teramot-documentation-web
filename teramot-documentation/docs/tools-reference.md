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
| `create_workspace` | Create a new workspace — the top-level container you must create before projects or data sources. | `name` (string, required); `index_color` (int); `index_icon` (int) |
| `update_workspace` | Update an existing workspace's name or appearance. | `workspace_name` (string, required); `name` (string); `index_color` (int); `index_icon` (int) |
| `delete_workspace` | Permanently delete a workspace by name. Irreversible; requires owner access. | `workspace_name` (string, required) |
| `get_workspace_owner` | Return the owner (member with role `owner`) of a workspace. | `workspace_name` (string) |
| `get_workspace_members_idp_subs` | Return the IDP subjects (`idp_sub`) of every workspace member. Useful when wiring data-egress users. | `workspace_name` (string) |
| `get_workspace_subscription` | Return the active billing subscription for a workspace, or null for free-tier. | `workspace_name` (string) |

## Projects

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_projects` | Lists all projects, optionally filtered by workspace. | `workspace_name` (string) |
| `create_project` | Create a new project inside a workspace. | `workspace_name` (string, required); `slug` (string, required, 1–28 URL-safe chars); `region` (string, required); `status` (string, required: active \| inactive \| pending) |
| `update_project` | Update a project's name, slug, region, or status. | `project_name` (string, required); `workspace_name` (string); `name` (string); `slug` (string); `region` (string); `status` (string) |
| `delete_project` | Permanently delete a project by name. Irreversible; requires owner access. | `project_name` (string, required); `workspace_name` (string) |

## Sources & ingestion

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_sources` | Lists all ETL data sources in a project. | `workspace_name` (string); `project_name` (string) |
| `create_etl_source` | Create an ETL data source connecting to an existing database or storage. The referenced secret must already exist. | `name` (string, required); `secret_name` (string, required); `engine` (string, required: postgresql \| mysql \| s3 \| bigquery); `slug` (string); `kind` (string); `tables_descriptions` (array); `workspace_name`/`project_name` (string) |
| `get_etl_source` | Retrieve details of a single ETL source (status, engine, config key, discovered tables). | `source_id` or `source_name` (string); `workspace_name`/`project_name` (string) |
| `delete_etl_source` | Delete an ETL source permanently. The associated secret is not deleted. | `source_id` or `source_name` (string, one required); `workspace_name`/`project_name` (string) |
| `discover_schema` | Connect to the source and fetch its available tables. Call after `create_etl_source`. | `source_id` or `source_name` (string); `workspace_name`/`project_name` (string) |
| `update_etl_source_tables` | Select which tables to ingest (and optional descriptions). Then call `publish_source` + `wait_for_publish_completion`. | `tables_descriptions` (array, required); `source_id`/`source_name` (string); `workspace_name`/`project_name` (string) |
| `publish_source` | Publish an ETL source, triggering the async ingestion/processing pipeline. | `source_id` or `source_name` (string); `workspace_name`/`project_name` (string) |
| `get_etl_source_status` | One-shot lifecycle status of an ETL source (created, disconnected, published, …). | `source_id` or `source_name` (string); `workspace_name`/`project_name` (string) |
| `test_connection` | Test a source connection by creating a temporary source and running discovery. Cleans up on failure unless `keep_on_failure`. | `name` (string, required); `engine` (string, required); connection fields (`host`, `port`, `database`, `schema`, `user`, `password`, `path`, `bq_project_id`, `dataset`, `credentials_json`); `keep_on_failure` (bool); `workspace_name`/`project_name` (string) |
| `wait_for_publish_completion` | Poll the publish pipeline. When `completed` is false, call again with the returned `follow_up_arguments`. | `source_id` or `source_name` (string); `timeout_seconds` (int); `workspace_name`/`project_name` (string) |

## Secrets

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_secrets` | Lists all secret keys in a project (keys and versions only — values are never returned). | `workspace_name` (string); `project_name` (string) |
| `create_secret` | Create or update a secret storing database/S3/BigQuery credentials. Convention: key `source_<slug>_config`. | `key` (string, required); `engine` (string, required: postgresql \| mysql \| s3 \| bigquery); engine-specific fields (`host`, `port`, `database`, `schema`, `user`, `password`, `path`, `bq_project_id`, `dataset`, `credentials_json`); `workspace_name`/`project_name` (string) |

## Files & filesystem

| Tool | Description | Parameters |
| --- | --- | --- |
| `prepare_file_upload` | Generate presigned S3 PUT URLs for direct upload (`.csv`, `.xls`, `.xlsx`, `.parquet`; up to 20 files; URLs expire in 30 min). | `file_names` (array, required); `parent_path` (string); `workspace_name`/`project_name` (string) |
| `create_source_from_upload` | Finalize an upload batch by registering the files as an S3 ETL source. Does not auto-publish. | `uploaded_files` (array of `{name, key, s3_uri}`, required); `source_name` (string); `mode` (string: concat \| independent); `workspace_name`/`project_name` (string) |
| `list_uploaded_files` | List files previously uploaded to the project's S3 bucket. | `workspace_name` (string); `project_name` (string) |
| `delete_uploaded_files` | Permanently delete one or more uploaded files. Does not delete ETL sources that reference them. | `file_names` (array, required); `workspace_name`/`project_name` (string) |
| `download_uploaded_file` | Build an authenticated download URL for an uploaded file (requires the caller's bearer token). | `file_name` (string, required); `workspace_name`/`project_name` (string) |
| `list_fs_nodes` | List the project's file tree (files and folders) as a hierarchy. | `parent_id` (string); `workspace_name`/`project_name` (string) |
| `create_folder` | Create a folder in the project's file system. | `name` (string, required); `parent_path` (string); `workspace_name`/`project_name` (string) |
| `rename_node` | Rename a file or folder (stays under the same parent — use `move_node` to relocate). | `path` (string, required); `new_name` (string, required); `workspace_name`/`project_name` (string) |
| `rename_uploaded_file` | Alias of `rename_node`, scoped to user-uploaded files. | `path` (string, required); `new_name` (string, required); `workspace_name`/`project_name` (string) |
| `move_node` | Move a file or folder under a different parent. | `path` (string, required); `new_parent_path` (string, required); `workspace_name`/`project_name` (string) |
| `move_uploaded_file` | Alias of `move_node`, scoped to user-uploaded files. | `path` (string, required); `new_parent_path` (string, required); `workspace_name`/`project_name` (string) |
| `delete_node` | Delete a file or folder (folders delete all descendants). Irreversible. | `path` (string, required); `workspace_name`/`project_name` (string) |

## Tables & data

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_available_tables` | List tables in the data warehouse. Filter by `layer`; include columns with `with_columns`. | `with_columns` (bool); `layer` (string: gold \| silver \| bronze); `workspace_name`/`project_name` (string) |
| `get_sources` | List all ETL data sources configured for the current project. | `workspace_name` (string); `project_name` (string) |
| `preview_table` | Preview the first 100 rows of a table (columns, types, sample rows). Accepts physical or logical name. | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `query_data` | Execute a SQL query (TRINO dialect) against a table; returns JSON. Supports pagination via `execution_id` + `page`. | `table_name` (string, required); `sql` (string, required unless `execution_id` set); `execution_id` (string); `page` (int); `workspace_name`/`project_name` (string) |
| `get_sql_definition` | Retrieve the SQL `SELECT` behind a results table (analysis spec). | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `get_table_code` | Return the generated SQL that produces a source or processed table. | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `get_artifacts` | List source tables (artifacts) for the project, with descriptions and columns. Mandatory first step before `create_gold_table`. | `workspace_name` (string); `project_name` (string) |
| `profile_table` | Profile a table: total rows, null %, unique counts, frequent values. Operates on the JWT-bound project. | `table_name` (string, required) |

## Results (gold) tables

| Tool | Description | Parameters |
| --- | --- | --- |
| `validate_gold_request` | Validate a results-table request before creation (name, source tables, join-key null %, …). | `name` (string, required); `description` (string); `source_tables` (string); `questions` (string); `join_keys` (string); `workspace_name`/`project_name` (string) |
| `create_gold_table` | Create a results table (analysis spec); generates SQL from source tables + questions. Call `get_artifacts` first. | `source_tables` (string, required, JSON array from `get_artifacts`); `name` (string); `description` (string); `questions` (string); `knowledges` (string); `workspace_name`/`project_name` (string) |
| `list_analysis_specs` | List all results tables (analysis specs) in the current project. | `workspace_name` (string); `project_name` (string) |
| `update_gold_table` | Update the description of a results table (only the description is mutable today). | `analysis_spec_name` (string, required); `description` (string, required); `workspace_name`/`project_name` (string) |
| `delete_gold_table` | Permanently delete a results table and all its data. Two-step: call with `confirmed=false`, show the message, then `confirmed=true`. | `analysis_spec_name` (string); `confirmed` (bool); `workspace_name`/`project_name` (string) |
| `duplicate_gold_table` | Duplicate a results table into a new draft analysis spec. | `analysis_spec_name` (string, required); `workspace_name`/`project_name` (string) |
| `regenerate_gold_table_query` | Regenerate the SQL backing a results table (e.g. after editing instructions or sources). | `analysis_spec_name` (string, required); `workspace_name`/`project_name` (string) |
| `get_gold_table_lineage` | Return the lineage graph of a results table by slug (source dependencies and derived analyses). | `slug` (string, required); `workspace_name`/`project_name` (string) |
| `create_gold_table_instructions` | Append free-form instructions to a results table; triggers one regeneration. | `analysis_spec_name` (string, required); `instructions` (array of `{text, id?}`, required); `workspace_name`/`project_name` (string) |
| `update_gold_table_instructions` | Update existing instructions (each item must include its id); triggers one regeneration. | `analysis_spec_name` (string, required); `instructions` (array of `{text, id}`, required); `workspace_name`/`project_name` (string) |
| `replace_gold_table_instructions` | Replace the full instruction set; triggers one regeneration. | `analysis_spec_name` (string, required); `instructions` (array of `{text, id?}`, required); `workspace_name`/`project_name` (string) |
| `delete_gold_table_instructions` | Remove specific instructions by ID; triggers one regeneration. | `analysis_spec_name` (string, required); `instruction_ids` (array, required); `workspace_name`/`project_name` (string) |

## Status & monitoring

| Tool | Description | Parameters |
| --- | --- | --- |
| `get_table_status` | Detailed status of a table (gold or silver), including processing/pipeline status. | `table_name` (string, required); `include_progress` (bool); `workspace_name`/`project_name` (string) |
| `get_gold_table_progress` | Progress events for an in-progress (or recent) results-table creation. | `table_name` (string, required); `limit` (int); `workspace_name`/`project_name` (string) |

## Refresh & scheduling

| Tool | Description | Parameters |
| --- | --- | --- |
| `refresh_gold_table` | Partial refresh of a single results table to pick up new source data (produces a new revision). | `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `refresh_all_tables` | Full ETL refresh for the entire project (produces a new revision of each table). | `workspace_name` (string); `project_name` (string) |
| `get_refresh_schedule` | List the one-shot full-refresh schedules for a project. | `workspace_name` (string); `project_name` (string) |
| `schedule_full_refresh_at` | Schedule a one-shot full refresh at a specific UTC time (RFC3339). | `scheduled_at` (string, required, RFC3339); `workspace_name`/`project_name` (string) |
| `delete_refresh_schedule` | Delete a one-shot full-refresh schedule by name. | `name` (string, required); `workspace_name`/`project_name` (string) |
| `get_cron_refresh_schedule` | Get the recurring (cron) refresh schedule for the project, if any. | `workspace_name` (string); `project_name` (string) |
| `set_cron_refresh_schedule` | Create or update the recurring refresh schedule. | `frequency` (string, required: daily \| weekly \| monthly \| hourly); `time` (string, required, HH:MM); `timezone` (string); `interval_hours` (int, required for hourly); `enabled` (bool); `workspace_name`/`project_name` (string) |
| `delete_cron_refresh_schedule` | Remove the recurring cron refresh schedule (idempotent). | `workspace_name` (string); `project_name` (string) |

## ETL tasks

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_etl_task_chains` | List ETL task chains (end-to-end pipelines) for the project. | `status` (string); `usecase_id` (string); `correlation_id` (string); `limit` (int); `cursor` (string); `workspace_name`/`project_name` (string) |
| `list_etl_tasks` | List ETL tasks (individual steps inside a chain). | `chain_id` (string); `status` (string); `task_id` (string); `usecase_id` (string); `correlation_id` (string); `limit` (int); `cursor` (string); `workspace_name`/`project_name` (string) |

## Data egress & sharing

| Tool | Description | Parameters |
| --- | --- | --- |
| `get_data_egress_options` | Returns the data-egress auth options configured for a project. Read-only. | `workspace_name` (string); `project_name` (string) |
| `create_egress_user` | Create/update a user in AWS Identity Store and assign them to the project's Lake Formation application. | `idp_sub` (string, required); `workspace_name`/`project_name` (string) |
| `grant_table_access` | Grant a Lake Formation user read access to one or more tables. | `user_id` (string, required); `tables` (array, required); `workspace_name`/`project_name` (string) |
| `revoke_table_access` | Revoke a single Lake Formation table from a user. | `user_id` (string, required); `table_name` (string, required); `workspace_name`/`project_name` (string) |
| `revoke_database_access` | Revoke all database-level Lake Formation access for a user (sweeps all tables). | `user_id` (string, required); `workspace_name`/`project_name` (string) |
| `delete_egress_user` | Delete a user from AWS Identity Store and remove their egress grants. | `user_id` (string, required); `workspace_name`/`project_name` (string) |
| `get_user_tables` | List the Lake Formation tables a user can access (paginated via `next_token`). | `user_id` (string, required); `next_token` (string); `workspace_name`/`project_name` (string) |
| `list_data_shares` | List the data shares originating from the current project. | `workspace_name` (string); `project_name` (string) |
| `create_data_share` | Share data with another (consumer) project, optionally time-bound. | `consumer_project_id` (string, required); `shared_resources` (array); `expires_at` (string); `workspace_name`/`project_name` (string) |
| `update_data_share` | Update a data share (only `expires_at` is mutable today). | `data_share_id` (string, required); `expires_at` (string); `clear_expires_at` (bool); `workspace_name`/`project_name` (string) |
| `delete_data_share` | Permanently delete a data share (consumer loses access immediately). | `data_share_id` (string, required); `workspace_name`/`project_name` (string) |

## Workspace members

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_workspace_members` | List all members of a workspace. Requires admin role. | `workspace_name` (string, required) |
| `get_workspace_member_role` | Get a member's role (`owner`, `admin`, `member`, `read-only`). | `workspace_name` (string, required); `user_id` (string, required) |
| `add_workspace_member` | Add a user by email (adds directly if they exist, else invites). Requires admin role. | `workspace_name` (string, required); `email` (string, required) |
| `update_workspace_member_role` | Update a member's role. Requires admin role. | `workspace_name` (string, required); `user_id` (string, required); `role` (string, required) |
| `remove_workspace_member` | Remove a member from a workspace. Requires admin role. | `workspace_name` (string, required); `user_id` (string, required) |
| `list_workspace_invitations` | List pending invitations for a workspace. Requires admin role. | `workspace_name` (string, required) |

## Chat

| Tool | Description | Parameters |
| --- | --- | --- |
| `chat` | Send a chat message; AI understands intent and queries workspaces, projects, sources, and tables. Conversation scope is immutable once set. | `message` (string, required); `conversation_id` (string); `workspace_id` (string); `project_id` (string) |

## Memory

| Tool | Description | Parameters |
| --- | --- | --- |
| `memory` | Manage persistent agent memory files (view, create, str_replace, insert, delete, rename). | `command` (string, required: view \| create \| str_replace \| insert \| delete \| rename); `path` (string); `old_path` (string); `new_path` (string); `file_text` (string); `old_str` (string); `new_str` (string); `insert_line` (int); `insert_text` (string); `view_range` (array) |
