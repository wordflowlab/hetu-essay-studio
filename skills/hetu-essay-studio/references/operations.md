# 操作地图

由正式清单生成，执行前发现当前安装版Schema。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找专业工程 |  | read |
| get_project | 读取固定专业工程 | object_id | read |
| save_project | 保存完整专业工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| get_source | 分块读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定专业修订 | object_id, from_revision, to_revision | read |
| export_project | 分块导出完整专业数据 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备本工程AI接续 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |
| put_evidence | 维护固定引文 | object_id, expected_revision, expected_sha256, operation_key, evidence | managed_write |
| put_observation | 维护原始观察 | object_id, expected_revision, expected_sha256, operation_key, observation | managed_write |
| put_motif | 维护意象 | object_id, expected_revision, expected_sha256, operation_key, motif | managed_write |
| remove_motif | 移除意象 | object_id, expected_revision, expected_sha256, operation_key, motif_id | managed_write |
| put_fragment | 维护写作片段 | object_id, expected_revision, expected_sha256, operation_key, fragment | managed_write |
| remove_fragment | 移除写作片段 | object_id, expected_revision, expected_sha256, operation_key, fragment_id | managed_write |
| put_arrangement | 维护篇章编排 | object_id, expected_revision, expected_sha256, operation_key, arrangement | managed_write |
| remove_arrangement | 移除篇章编排 | object_id, expected_revision, expected_sha256, operation_key, arrangement_id | managed_write |
| put_variant | 维护局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant | managed_write |
| remove_variant | 移除局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| put_note | 维护固定意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除固定意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| target_digest | 读取固定目标摘要 | object_id, target_kind, target_id | read |
| apply_variant | 使用固定局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| check_essay | 检查散文依据与缺口 | object_id | read |
| motif_report | 查看意象独立出场 | object_id | read |
| arrangement_report | 查看编排依据变化 | object_id | read |
| fragment_basis | 固定选定观察组合 | object_id, observation_ids | read |
| arrangement_basis | 固定片段独立出场组合 | object_id, items | read |
| preview_arrangement | 阅读完整篇章编排 | object_id, arrangement_id | read |
| compare_arrangements | 比较两种篇章编排 | object_id, from_id, to_id | read |
| export_essay | 导出专业阅读本 | object_id | read |
| export_review | 导出完整专业审核本 | object_id | read |
