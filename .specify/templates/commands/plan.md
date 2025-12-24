---
description: 計画テンプレートを使用して設計アーティファクトを生成する実装計画ワークフローを実行します。
handoffs: 
  - label: タスクを作成
    agent: speckit.tasks
    prompt: 計画をタスクに分解
    send: true
  - label: チェックリストを作成
    agent: speckit.checklist
    prompt: 以下のドメインのチェックリストを作成...
scripts:
  sh: scripts/bash/setup-plan.sh --json
  ps: scripts/powershell/setup-plan.ps1 -Json
agent_scripts:
  sh: scripts/bash/update-agent-context.sh __AGENT__
  ps: scripts/powershell/update-agent-context.ps1 -AgentType __AGENT__
---

## ユーザー入力

```text
$ARGUMENTS
```

空でない場合、続行する前にユーザー入力を **必ず** 考慮してください。

## 概要

1. **セットアップ**: リポジトリルートから`{SCRIPT}`を実行し、FEATURE_SPEC、IMPL_PLAN、SPECS_DIR、BRANCHのJSONを解析します。引数内のシングルクォート（例: "I'm Groot"）の場合、エスケープ構文を使用: 例 'I'\''m Groot' (または可能であれば二重引用符: "I'm Groot")

2. **コンテキストの読み込み**: FEATURE_SPECと`/memory/constitution.md`を読み取ります。IMPL_PLANテンプレートを読み込みます（すでにコピー済み）。

3. **計画ワークフローの実行**: IMPL_PLANテンプレートの構造に従って：
   - 技術コンテキストを埋めます（不明なものは"NEEDS CLARIFICATION"としてマーク）
   - 憲法からConstitution Checkセクションを埋めます
   - ゲートを評価します（違反が正当化されない場合はERROR）
   - Phase 0: research.mdを生成（すべてのNEEDS CLARIFICATIONを解決）
   - Phase 1: data-model.md、contracts/、quickstart.mdを生成
   - Phase 1: エージェントスクリプトを実行してエージェントコンテキストを更新
   - 設計後にConstitution Checkを再評価

4. **停止してレポート**: Phase 2計画後にコマンドが終了します。ブランチ、IMPL_PLANパス、および生成されたアーティファクトをレポートします。

## フェーズ

### Phase 0: アウトラインとリサーチ

1. **上記の技術コンテキストから不明点を抽出**:
   - 各NEEDS CLARIFICATION → リサーチタスク
   - 各依存関係 → ベストプラクティスタスク
   - 各統合 → パターンタスク

2. **リサーチエージェントを生成して派遣**:

   ```text
   技術コンテキストの各不明点について:
     タスク: "{機能コンテキスト}の{不明点}を調査"
   各技術選択について:
     タスク: "{ドメイン}における{技術}のベストプラクティスを見つける"
   ```

3. **調査結果を統合**し、以下の形式で`research.md`に記録:
   - 決定: [選択されたもの]
   - 理由: [選択された理由]
   - 検討された代替案: [評価された他のもの]

**出力**: すべてのNEEDS CLARIFICATIONが解決されたresearch.md

### Phase 1: 設計とコントラクト

**前提条件:** `research.md`完了

1. **機能仕様からエンティティを抽出** → `data-model.md`:
   - エンティティ名、フィールド、関係
   - 要件からの検証ルール
   - 該当する場合は状態遷移

2. **機能要件からAPIコントラクトを生成**:
   - 各ユーザーアクション → エンドポイント
   - 標準REST/GraphQLパターンを使用
   - OpenAPI/GraphQLスキーマを`/contracts/`に出力

3. **エージェントコンテキスト更新**:
   - `{AGENT_SCRIPT}`を実行
   - これらのスクリプトは使用中のAIエージェントを検出
   - 適切なエージェント固有のコンテキストファイルを更新
   - 現在の計画から新しい技術のみを追加
   - マーカー間の手動追加を保持

**出力**: data-model.md, /contracts/*, quickstart.md, エージェント固有ファイル

## 主要なルール

- 絶対パスを使用
- ゲート失敗または未解決の明確化でERROR
