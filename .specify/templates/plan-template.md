# 実装計画: [FEATURE]

**ブランチ**: `[###-feature-name]` | **日付**: [DATE] | **仕様**: [link]
**入力**: 機能仕様 `/specs/[###-feature-name]/spec.md`

**注記**: このテンプレートは `/speckit.plan` コマンドで記入されます。実行ワークフローは `.specify/templates/commands/plan.md` を参照してください。

<!--
  🌏 言語ポリシー:
  - 技術的な詳細は英語で記述してください（コード、技術用語など）
  - 説明や理由付けは日本語でも構いません
  - アーキテクチャ図やコメントはバイリンガルが望ましい
-->

## 概要

[機能仕様から抽出: 主要な要件 + 調査からの技術的アプローチ]

## 技術コンテキスト

<!--
  必須対応: このセクションの内容をプロジェクトの技術詳細に置き換えてください。
  この構造は反復プロセスのガイドとして提示されています。
-->

**言語/バージョン**: [例: Python 3.11, Swift 5.9, Rust 1.75 または 要明確化]  
**主要な依存関係**: [例: FastAPI, UIKit, LLVM または 要明確化]  
**ストレージ**: [該当する場合、例: PostgreSQL, CoreData, files または N/A]  
**テスト**: [例: pytest, XCTest, cargo test または 要明確化]  
**ターゲットプラットフォーム**: [例: Linux server, iOS 15+, WASM または 要明確化]
**プロジェクトタイプ**: [single/web/mobile - ソース構造を決定]  
**パフォーマンス目標**: [ドメイン固有、例: 1000 req/s, 10k lines/sec, 60 fps または 要明確化]  
**制約**: [ドメイン固有、例: <200ms p95, <100MB memory, offline-capable または 要明確化]  
**規模/スコープ**: [ドメイン固有、例: 10k users, 1M LOC, 50 screens または 要明確化]

## Constitution Check

*ゲート: Phase 0 research 前に合格必須。Phase 1 design 後に再チェック。*

[憲法ファイルに基づいて決定されるゲート]

## Project Structure

### ドキュメント（この機能）

```text
specs/[###-feature]/
├── plan.md              # このファイル (/speckit.plan コマンド出力)
├── research.md          # Phase 0 出力 (/speckit.plan コマンド)
├── data-model.md        # Phase 1 出力 (/speckit.plan コマンド)
├── quickstart.md        # Phase 1 出力 (/speckit.plan コマンド)
├── contracts/           # Phase 1 出力 (/speckit.plan コマンド)
└── tasks.md             # Phase 2 出力 (/speckit.tasks コマンド - /speckit.plan では作成されない)
```

### ソースコード (リポジトリルート)
<!--
  必須対応: 以下のプレースホルダーツリーを、この機能の具体的なレイアウトに置き換えてください。
  使用しないオプションは削除し、選択した構造を実際のパスで展開してください
  （例: apps/admin, packages/something）。提出する計画にはオプションラベルを含めないでください。
-->

```text
# [未使用の場合は削除] オプション 1: 単一プロジェクト (デフォルト)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [未使用の場合は削除] オプション 2: Web アプリケーション ("frontend" + "backend" が検出された場合)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [未使用の場合は削除] オプション 3: Mobile + API ("iOS/Android" が検出された場合)
api/
└── [上記のbackendと同じ]

ios/ or android/
└── [プラットフォーム固有の構造: 機能モジュール, UI フロー, プラットフォームテスト]
```

**構造の決定**: [選択した構造を文書化し、上記で記載した実際のディレクトリを参照してください]

## 複雑性の追跡

> **Constitution Check で違反がある場合のみ記入してください**

| 違反 | 必要な理由 | シンプルな代替案が却下された理由 |
|------|-----------|-------------------------------|
| [例: 4つ目のプロジェクト] | [現在の必要性] | [なぜ3つのプロジェクトでは不十分か] |
| [例: Repository パターン] | [具体的な問題] | [なぜ直接的なDB アクセスでは不十分か] |
