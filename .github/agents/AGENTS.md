# Agent開発ガイドライン

最終更新: 2025-12-27

## Spec-Kit使用の原則

**このプロジェクトでは、すべての開発作業においてspec-kitを使用します。**

### Spec-Kitワークフロー

**コアワークフロー**:
- **`/constitution`** - プロジェクト憲法の作成・更新
- **`/specify`** - 機能仕様の作成
- **`/plan`** - 技術計画の作成
- **`/tasks`** - 実装タスクの作成
- **`/implement`** - タスクの実装

**補助コマンド**:
- **`/clarify`** - 仕様の不明瞭な部分を対話的に明確化（最大5つの質問）
- **`/analyze`** - spec.md、plan.md、tasks.mdの一貫性と品質を分析
- **`/checklist`** - ユーザー要件に基づくカスタムチェックリストを生成
- **`/taskstoissues`** - タスクをGitHub Issueに変換（依存関係順序付け）

### 重要なルール

- 直接実装を行わない
- 必ず `/specify` → `/plan` → `/tasks` → `/implement` の順で進める
- すべての実装は承認された仕様書から開始
- コードを書く前にドキュメントを作成

### ドキュメント構造

```
.specify/           # spec-kit設定とテンプレート
memory/             # プロジェクト記憶と憲法
specs/              # 機能仕様書（開発中、ブランチごと）
docs/
  architecture/     # アーキテクチャ仕様
  business/         # ビジネス仕様
```

### 実装時のドキュメント更新

- 実装と同時に `docs/` 配下のドキュメントを作成・更新
- アーキテクチャ仕様: `docs/architecture/`
- ビジネス仕様: `docs/business/`
- コード変更とドキュメント更新は同一コミット

## 言語ポリシー

### 日本語を使用する箇所

- **仕様書**: spec.md、plan.md、tasks.mdなど、すべての仕様書とドキュメント
- **PRとコミット**: Pull Requestのタイトル・説明、コミットメッセージ
- **レビューとコメント**: コードレビューコメント、Issueのタイトル・説明
- **Agentとのやり取り**: GitHub Copilot Agentとのすべてのやり取り

### 英語を使用する箇所

- **コード**: 変数名、関数名、クラス名、コードコメント
- **技術用語**: OIDC、CDK、CloudFormationなど技術的な固有名詞

### GitHub Copilotへの指示

GitHub Copilotが自動的にこの言語ポリシーを適用できるよう、[copilot-instructions.md](../.github/copilot-instructions.md)に詳細な指示を記載しています。

## 参考資料

- [GitHub Copilotカスタムインストラクション](../copilot-instructions.md)
- [プロジェクト憲法](../../memory/constitution.md)
- [Spec-Kit GitHubリポジトリ](https://github.com/github/spec-kit)
