# Project Constitution: 勤怠管理システム

**Version**: 1.0.0  
**Ratified**: 2025-12-24  
**Last Amended**: 2025-12-24

## Purpose

このプロジェクトは、spec-kitを使用した仕様駆動開発により、勤怠管理システムを構築します。

## Language Policy

**PRIMARY LANGUAGE**: 日本語
**SECONDARY LANGUAGE**: 英語（コード、技術文書、国際協力用）

### Language Guidelines

1. **仕様書**: 日本語で記述すること
   - ユーザーストーリーとシナリオ: 日本語
   - 要件と受け入れ基準: 日本語
   - コメントと説明: 日本語

2. **コード**: 英語の慣習に従うこと
   - 変数名、関数名、クラス名: 英語
   - コードコメント: 英語推奨、複雑なビジネスロジックは日本語可
   - コミットメッセージ: 英語

3. **技術文書**: 可能な限りバイリンガル
   - アーキテクチャドキュメント: 日本語に英語サマリー
   - APIドキュメント: 英語に日本語説明
   - セットアップ/デプロイガイド: バイリンガル

4. **コミュニケーション**: 
   - チーム議論: 日本語
   - Issue管理: 日本語タイトル、技術詳細は英語可
   - Pull request説明: 日本語

### Documentation Language Enforcement

**マークダウンファイルの日本語化ポリシー**:

すべてのマークダウンファイル（*.md）において、以下のルールを適用すること：

1. **日本語の説明に続く英語翻訳は削除する**
   - 例: "概要 / Overview" → "概要"
   - 例: "このプロジェクトでは... / This project..." → "このプロジェクトでは..."

2. **保持すべき英語**:
   - 技術用語（Docker, Python, Git, etc.）
   - コマンド名とコード例
   - ファイル名とパス
   - URL と外部参照

3. **チェック対象ファイル**:
   - プロジェクトルートの README.md
   - docs/ ディレクトリ内のすべての .md ファイル
   - memory/ ディレクトリ内のすべての .md ファイル
   - .devcontainer/ ディレクトリ内のすべての .md ファイル
   - .specify/templates/ ディレクトリ内のカスタマイズされた .md ファイル

4. **実施タイミング**:
   - 新しいマークダウンファイルを作成する時
   - 既存のマークダウンファイルを更新する時
   - プルリクエストのレビュー時

5. **確認方法**:
   ```bash
   # 全てのマークダウンファイルをチェック
   find . -name "*.md" -not -path "./.git/*" -type f
   
   # 各ファイルで "/" パターンを検索（日本語/英語の形式）
   grep -n " / " [file.md]
   ```

この方針により、ドキュメントの可読性が向上し、保守が容易になります。

## Core Principles

### Principle 1: 仕様駆動開発

**Rule**: すべての機能実装は、事前に承認された仕様書から開始すること。

**Rationale**: 仕様書を先に作成することで、開発の方向性を明確にし、手戻りを最小限に抑える。

### Principle 2: 段階的な実装

**Rule**: 機能は独立してテスト可能な単位で実装すること。

**Rationale**: 各機能を独立して開発・テスト・デプロイできることで、リスクを軽減し、フィードバックサイクルを短縮する。

### Principle 3: ドキュメントファースト

**Rule**: コードを書く前に、必ずドキュメントを作成すること。

- 仕様書: ユーザーシナリオと要件
- 計画書: 技術的なアプローチとアーキテクチャ
- タスク: 実装可能な作業項目

**Rationale**: ドキュメントを先に作成することで、設計の質が向上し、チーム全体の理解が深まる。

### Principle 4: テスト可能性

**Rule**: すべての機能は自動テスト可能な形で実装すること。

**Rationale**: 自動テストにより、品質を保ちながら開発速度を維持できる。

### Principle 5: シンプルさの追求

**Rule**: 必要最小限の複雑さで実装すること。

**Rationale**: シンプルなシステムは理解しやすく、保守しやすい。

## Governance

### Amendment Procedure

1. 憲法の変更提案は、プロジェクトメンバーの誰でも行える
2. 変更は、チームの過半数の承認が必要
3. 重大な変更（メジャーバージョン）は、全員の合意が必要

### Versioning Policy

- **MAJOR**: 後方互換性のない原則の削除または再定義
- **MINOR**: 新しい原則の追加または既存原則の大幅な拡張
- **PATCH**: 明確化、表現の改善、タイポ修正

### Compliance Review

- 各スプリント終了時に憲法への準拠を確認
- 違反が見つかった場合は、次のスプリントで是正

## Tools and Workflow

### 開発環境

**DevContainerの使用を推奨**

このプロジェクトでは、開発環境のセットアップにDevContainerを使用します。

**理由**:
- 一貫した開発環境の提供
- 自動セットアップの簡素化
- ローカル開発とCopilot Agentの両方で同じ環境を使用
- 将来の依存関係追加が容易

**設定ファイル**:
- `.devcontainer/devcontainer.json` - DevContainer設定
- `.github/workflows/copilot-setup-steps.yml` - DevContainer設定を参照

**新しいツールや依存関係の追加**:

将来、新しいセットアップ要件が発生した場合、以下の手順で追加すること：

1. `.devcontainer/devcontainer.json` の `postCreateCommand` または `features` を更新
2. `.github/workflows/copilot-setup-steps.yml` も必要に応じて更新
3. この憲法を更新し、追加理由を記録

### Spec-Kit Usage

このプロジェクトでは、GitHub Copilot Coding Agent経由でspec-kitを使用します。

**Workflow Commands**:
- `/constitution`: プロジェクト憲法の作成・更新
- `/specify`: 機能仕様の作成
- `/plan`: 技術計画の作成
- `/tasks`: 実装タスクの作成
- `/implement`: タスクの実装

### Documentation Structure

```
.devcontainer/      # DevContainer設定
  devcontainer.json # 開発環境定義
  README.md         # DevContainer使用ガイド
.github/
  workflows/
    copilot-setup-steps.yml  # Copilot Agent自動セットアップ
.specify/           # spec-kit設定とテンプレート
  templates/        # ドキュメントテンプレート
  commands/         # ワークフローコマンド定義
memory/            # プロジェクト記憶と憲法
specs/             # 機能仕様書（ブランチごと）
docs/              # 確定した仕様と実装ドキュメント
```

### Future Migration

将来的にローカル環境（CLI/VSCode）への切り替えを考慮し、確定した仕様は実装時に`docs/`フォルダに保存すること。

## Project Scope

### Initial Scope

このプロジェクトは勤怠管理システムを構築しますが、初期セットアップではspec-kitの最小限の構成のみを行います。

### Target System Features (Future)

- 出退勤記録
- 休暇申請と承認
- 勤怠データの集計とレポート
- ユーザー管理

これらの機能は、仕様駆動開発ワークフローに従って今後のイテレーションで仕様化・実装します。
