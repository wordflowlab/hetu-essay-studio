# 散文工坊

> 把观察、意象、片段与不同篇章次序保存为可继续修改的散文工程。

## 简介

河图洛书的独立创作插件，由外部Codex通过河图CLI／MCP读取包内Skill并操作。文风工坊维护偏好和精修规则；本包维护散文本身的观察、片段与编排。纪实插件维护主张核实，本包不认证记忆和事实，不做旅行预订、日记同步或外部发布。

## 角色分流

- 作者使用 → [插件中心](https://hetu.limeai.run/plugins/essay-studio/)
- Agent与功能Review → [功能清单](CAPABILITIES.md)
- 开发与维护 → [完整设计文档](docs/README.md)

## 快速上手

开发需要Node.js 25，安装与验收基线为河图0.12.6。

```bash
npm ci
npm run build
npm run check
npm run test:unit
npm run package
```

## 边界

专业成果沿固定来源与修订接续，正文采纳、定稿、费用和外发独立决定。发行及实际验收范围见[实施记录](docs/08-实施计划与验收记录.md)。
