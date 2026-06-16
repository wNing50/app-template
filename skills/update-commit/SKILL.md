---
name: update-commit
description: 根据当前未提交改动，同步项目核心文档并生成可直接使用的中文提交信息。Use when Codex needs to summarize local unstaged/staged changes, update long-lived project docs (such as CLAUDE.md and skills/current-architecture.md), and draft a concise commit message template with rationale.
---

# update-commit

执行开发收尾时的“文档同步 + 提交信息整理”。

## 执行流程

1. 读取改动范围
- 运行 `git status --short`。
- 按模块归类文件（例如 app、server、docs、config、assets）。
- 若存在删除/重命名，单独标注，避免文档遗漏。

2. 更新 `skills/current-architecture.md`
- 仅写入长期有效的结构、能力、接口、数据模型变化。
- 不写一次性过程描述，不写临时调试信息。
- 重点覆盖：模块职责、关键入口、核心依赖关系。

3. 更新 `CLAUDE.md`
- 同步最小必要上下文与约束。
- 对新增流程、约定、策略做稳定化描述。
- 删除过时内容，避免与代码事实漂移。

4. 生成中文提交信息
- 输出 `提交标题` 1 行（动宾结构，建议 Conventional Commit 前缀）。
- 输出 `提交说明` 3-6 条，每条包含“做了什么 + 为什么”。
- 优先可审阅、可追溯，不堆砌实现细节。

## 输出格式

### 提交标题
- `feat: xxxx`
- `fix: xxxx`
- `refactor: xxxx`
- `docs: xxxx`

### 提交说明
- 使用 3-6 条要点。
- 每条一句，避免重复。

## 约束

- 未经用户明确要求，不执行 commit / push。
- 若发现改动与当前架构文档冲突，先输出“风险项”再给提交文案。
- 文档更新以准确、稳定、可维护为优先。
