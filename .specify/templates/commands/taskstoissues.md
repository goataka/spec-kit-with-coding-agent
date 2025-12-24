---
description: 利用可能な設計アーティファクトに基づいて、既存のタスクを機能のための実行可能で依存関係順序付けられたGitHub Issueに変換します。
tools: ['github/github-mcp-server/issue_write']
scripts:
  sh: scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
  ps: scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks
---

## ユーザー入力

```text
$ARGUMENTS
```

空でない場合、続行する前にユーザー入力を **必ず** 考慮してください。

## 概要

1. リポジトリルートから`{SCRIPT}`を実行し、FEATURE_DIRとAVAILABLE_DOCSリストを解析します。すべてのパスは絶対パスである必要があります。引数内のシングルクォート（例: "I'm Groot"）の場合、エスケープ構文を使用: 例 'I'\''m Groot' (または可能であれば二重引用符: "I'm Groot")
1. 実行されたスクリプトから、**tasks**へのパスを抽出します。
1. 以下を実行してGitリモートを取得：

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> リモートがGITHUB URLの場合のみ次のステップに進んでください

1. リスト内の各タスクについて、GitHub MCPサーバーを使用して、Gitリモートを表すリポジトリに新しいissueを作成します。

> [!CAUTION]
> どのような状況でもリモートURLと一致しないリポジトリにissueを作成しないでください
