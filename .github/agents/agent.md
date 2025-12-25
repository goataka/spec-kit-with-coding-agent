# 勤怠管理システム - Agent開発ガイドライン

最終更新: 2025-12-24

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

### コミットID提示のルール

エージェントがコメントでコミットIDを提示する際は、必ずGitHubへのリンクを付ける:

**形式**:
```
Commit: [短縮SHA](https://github.com/goataka/spec-kit-with-coding-agent/commit/完全SHA)
```

**例**:
```
Commit: [be9f233](https://github.com/goataka/spec-kit-with-coding-agent/commit/be9f233)
```

**理由**:
- ユーザーがワンクリックでコミット内容を確認可能
- コードレビューの効率化
- 変更履歴の追跡性向上

## 言語ポリシー

- **仕様書**: 日本語
- **コード**: 英語（変数名、関数名、コミットメッセージ）

## 参考資料

- [プロジェクト憲法](../memory/constitution.md)
- [Spec-Kit GitHubリポジトリ](https://github.com/github/spec-kit)
