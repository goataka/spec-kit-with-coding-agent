---
description: tasks.mdで定義されたすべてのタスクを処理して実行することにより、実装計画を実行します。
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

2. **チェックリストステータスの確認**（FEATURE_DIR/checklists/が存在する場合）:
   - checklists/ディレクトリ内のすべてのチェックリストファイルをスキャン
   - 各チェックリストについて、カウント：
     - 合計項目：`- [ ]`または`- [X]`または`- [x]`に一致するすべての行
     - 完了項目：`- [X]`または`- [x]`に一致する行
     - 未完了項目：`- [ ]`に一致する行
   - ステータステーブルを作成：

     ```text
     | チェックリスト | 合計 | 完了 | 未完了 | ステータス |
     |-----------|-------|-----------|------------|--------|
     | ux.md     | 12    | 12        | 0          | ✓ PASS |
     | test.md   | 8     | 5         | 3          | ✗ FAIL |
     | security.md | 6   | 6         | 0          | ✓ PASS |
     ```

   - 全体的なステータスを計算：
     - **PASS**: すべてのチェックリストに未完了項目が0
     - **FAIL**: 1つ以上のチェックリストに未完了項目がある

   - **いずれかのチェックリストが未完了の場合**:
     - 未完了項目数を含むテーブルを表示
     - **停止**し、次を尋ねる："一部のチェックリストが未完了です。とにかく実装を続行しますか？(yes/no)"
     - 続行する前にユーザーの応答を待つ
     - ユーザーが"no"または"wait"または"stop"と言った場合、実行を停止
     - ユーザーが"yes"または"proceed"または"continue"と言った場合、ステップ3に進む

   - **すべてのチェックリストが完了している場合**:
     - すべてのチェックリストが合格したことを示すテーブルを表示
     - 自動的にステップ3に進む

3. 実装コンテキストを読み込んで分析：
   - **必須**: 完全なタスクリストと実行計画のためにtasks.mdを読み取る
   - **必須**: 技術スタック、アーキテクチャ、ファイル構造のためにplan.mdを読み取る
   - **存在する場合**: エンティティと関係のためにdata-model.mdを読み取る
   - **存在する場合**: API仕様とテスト要件のためにcontracts/を読み取る
   - **存在する場合**: 技術的決定と制約のためにresearch.mdを読み取る
   - **存在する場合**: 統合シナリオのためにquickstart.mdを読み取る

4. **プロジェクトセットアップの検証**:
   - **必須**: 実際のプロジェクトセットアップに基づいて無視ファイルを作成/検証：

   **検出と作成ロジック**:
   - リポジトリがgitリポジトリかどうかを判断するために以下のコマンドが成功するかチェック（成功した場合は.gitignoreを作成/検証）：

     ```sh
     git rev-parse --git-dir 2>/dev/null
     ```

   - Dockerfile*が存在するかplan.mdにDockerがあるかチェック → .dockerignoreを作成/検証
   - .eslintrc*が存在するかチェック → .eslintignoreを作成/検証
   - eslint.config.*が存在するかチェック → 設定の`ignores`エントリが必要なパターンをカバーしていることを確認
   - .prettierrc*が存在するかチェック → .prettierignoreを作成/検証
   - .npmrcまたはpackage.jsonが存在するかチェック → .npmignoreを作成/検証（公開する場合）
   - terraformファイル（*.tf）が存在するかチェック → .terraformignoreを作成/検証
   - .helmignoreが必要かチェック（helmチャートが存在）→ .helmignoreを作成/検証

   **無視ファイルが既に存在する場合**: 必須パターンが含まれているかを検証し、欠落している重要なパターンのみを追加
   **無視ファイルが欠落している場合**: 検出された技術の完全なパターンセットで作成

   **技術別の一般的なパターン**（plan.mdの技術スタックから）:
   - **Node.js/JavaScript/TypeScript**: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
   - **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
   - **Java**: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
   - **C#/.NET**: `bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
   - **Go**: `*.exe`, `*.test`, `vendor/`, `*.out`
   - **Ruby**: `.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
   - **PHP**: `vendor/`, `*.log`, `*.cache`, `*.env`
   - **Rust**: `target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
   - **Kotlin**: `build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
   - **C++**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
   - **C**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `Makefile`, `config.log`, `.idea/`, `*.log`, `.env*`
   - **Swift**: `.build/`, `DerivedData/`, `*.swiftpm/`, `Packages/`
   - **R**: `.Rproj.user/`, `.Rhistory`, `.RData`, `.Ruserdata`, `*.Rproj`, `packrat/`, `renv/`
   - **ユニバーサル**: `.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`

   **ツール固有のパターン**:
   - **Docker**: `node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
   - **ESLint**: `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
   - **Prettier**: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - **Terraform**: `.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`
   - **Kubernetes/k8s**: `*.secret.yaml`, `secrets/`, `.kube/`, `kubeconfig*`, `*.key`, `*.crt`

5. tasks.md構造を解析して抽出：
   - **タスクフェーズ**: Setup、Tests、Core、Integration、Polish
   - **タスク依存関係**: 順次実行 vs 並行実行ルール
   - **タスク詳細**: ID、説明、ファイルパス、並行マーカー [P]
   - **実行フロー**: 順序と依存関係要件

6. タスク計画に従って実装を実行：
   - **フェーズごとの実行**: 次に移る前に各フェーズを完了
   - **依存関係の尊重**: 順次タスクを順番に実行、並行タスク[P]は一緒に実行可能
   - **TDDアプローチに従う**: 対応する実装タスクの前にテストタスクを実行
   - **ファイルベースの調整**: 同じファイルに影響するタスクは順次実行する必要がある
   - **検証チェックポイント**: 続行する前に各フェーズの完了を確認

7. 実装実行ルール:
   - **セットアップが最初**: プロジェクト構造、依存関係、構成を初期化
   - **コードの前にテスト**: コントラクト、エンティティ、統合シナリオのテストを書く必要がある場合
   - **コア開発**: モデル、サービス、CLIコマンド、エンドポイントを実装
   - **統合作業**: データベース接続、ミドルウェア、ログ、外部サービス
   - **仕上げと検証**: 単体テスト、パフォーマンス最適化、ドキュメント

8. 進行状況追跡とエラー処理:
   - 各完了タスク後に進行状況を報告
   - 非並行タスクが失敗した場合は実行を停止
   - 並行タスク[P]の場合、成功したタスクを続行し、失敗したものを報告
   - デバッグのためのコンテキストを含む明確なエラーメッセージを提供
   - 実装が続行できない場合は次のステップを提案
   - **重要** 完了したタスクについては、タスクファイルでタスクを[X]としてマークオフすることを確認してください

9. 完了検証:
   - すべての必要なタスクが完了していることを確認
   - 実装された機能が元の仕様と一致することを確認
   - テストが合格し、カバレッジが要件を満たすことを検証
   - 実装が技術計画に従っていることを確認
   - 完了した作業の要約とともに最終ステータスを報告

注記: このコマンドは、tasks.mdに完全なタスク分解が存在することを前提としています。タスクが不完全または欠落している場合は、タスクリストを再生成するために最初に`/speckit.tasks`を実行することを提案します。
