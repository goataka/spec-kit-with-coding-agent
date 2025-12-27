# Project Constitution: 勤怠管理システム

**Version**: 1.7.0  
**Ratified**: 2025-12-24  
**Last Amended**: 2025-12-27

## Purpose

このプロジェクトは、spec-kitを使用した仕様駆動開発により、勤怠管理システムを構築します。

## Core Principles

### Principle 1: 仕様駆動開発

- **Rule**: すべての機能実装は承認された仕様書から開始
- **Rationale**: 開発の方向性を明確にし、手戻りを最小化

### Principle 2: 段階的な実装

- **Rule**: 機能は独立してテスト可能な単位で実装
- **Rationale**: リスクを軽減し、フィードバックサイクルを短縮

### Principle 3: ドキュメントファースト

- **Rule**: コードを書く前に必ずドキュメントを作成
  - 仕様書: ユーザーシナリオと要件
  - 計画書: 技術的アプローチとアーキテクチャ
  - タスク: 実装可能な作業項目
- **Rationale**: 設計の質が向上し、チーム全体の理解が深まる

### Principle 4: テスト可能性

- **Rule**: すべての機能は自動テスト可能な形で実装
- **Rationale**: 品質を保ちながら開発速度を維持

### Principle 5: シンプルさの追求

- **Rule**: 必要最小限の複雑さで実装
- **Rationale**: シンプルなシステムは理解しやすく保守しやすい

### Principle 6: 箇条書きの活用

- **Rule**: 文章はできるだけ箇条書きで簡潔に記述
- **Rationale**: 可読性が向上し、重要な情報が把握しやすい

### Principle 7: Mermaidによる図表作成

- **Rule**: Markdown内の図はMermaidを使用して作成
- **Rationale**: 
  - テキストベースでバージョン管理可能
  - レビューが容易
  - 保守性が高い
  - GitHubで直接レンダリング可能
- **Diagram Types**: 
  - システムアーキテクチャ: `graph` または `flowchart`
  - シーケンス図: `sequenceDiagram`
  - ER図: `erDiagram`
  - 状態遷移図: `stateDiagram-v2`
  - クラス図: `classDiagram`
  - ガントチャート: `gantt`

## Documentation Language Policy

**PRIMARY LANGUAGE**: 日本語

### マークダウンファイルの言語ルール

1. **日本語の説明に続く英語翻訳は削除する**
   - 例: "概要 / Overview" → "概要"

2. **保持すべき英語**:
   - 技術用語（Docker, Python, Git, etc.）
   - コマンド名とコード例
   - ファイル名とパス
   - URL と外部参照

3. **確認方法**:
   ```bash
   # 日本語/英語の形式をチェック
   grep -n " / " [file.md]
   ```

## Documentation Structure Policy

### ドキュメント配置の原則

1. **戦略的・概念的なドキュメント**: `docs/`ディレクトリに配置
   - アーキテクチャ設計
   - ビジネス要件
   - デプロイメント戦略

2. **運用的・手順的なドキュメント**: 該当ファイルと同じフォルダに配置
   - ワークフロー詳細: `.github/workflows/`に`{workflow-name}.md`
   - インフラ運用: `infrastructure/`に`DEPLOYMENT.md`等
   - セットアップ手順: `infrastructure/setup/`に`README.md`

3. **アクションドキュメントの命名規則**
   - ワークフローファイル: `{name}.yml`
   - ドキュメント: `{name}.md`（同じフォルダに配置）
   - サマリー: `README.md`（ディレクトリ全体の概要）

4. **冗長性の回避**
   - 「関連ドキュメント」セクションは記載しない
   - システム名など変更箇所が増える記述は必須でない場所には記載しない
   - 保守負担を最小化するため、重複情報を避ける

5. **ナンバリングの回避**
   - タスクやステップの番号付けは極力しない（変更箇所が増えるため）
   - 順序を示す必要がある場合は、リスト構造で表現し、タスク内容には番号を含めない
   - 例: ❌ "タスク 1: XXX" → ✅ "タスク: XXX"（リストの順序で表現）

### 例

```
.github/workflows/
  ├── README.md                 # ワークフロー全体のサマリー
  ├── deploy-to-aws.yml         # デプロイワークフロー
  └── deploy-to-aws.md          # デプロイワークフロー詳細

docs/architecture/
  └── cicd-deployment-strategy.md  # 戦略的な内容

infrastructure/
  ├── DEPLOYMENT.md             # 運用手順
  └── setup/
      └── README.md             # セットアップ手順
```

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

コアワークフロー:
- `/constitution`: プロジェクト憲法の作成・更新
- `/specify`: 機能仕様の作成
- `/plan`: 技術計画の作成
- `/tasks`: 実装タスクの作成
- `/implement`: タスクの実装

補助コマンド:
- `/clarify`: 仕様の不明瞭な部分を対話的に明確化
- `/analyze`: spec/plan/tasksの一貫性と品質を分析
- `/checklist`: カスタムチェックリストを生成
- `/taskstoissues`: タスクをGitHub Issueに変換

**Agent Operation Rule**:

- 指示はspec-kitコマンドを使用
- 直接実装を行わず、仕様化・計画化してから実装
- 仕様駆動開発の原則を維持し、ドキュメントと実装の整合性を確保

### Documentation Structure

```
.devcontainer/      # DevContainer設定
.github/
  agents/           # Agent開発ガイドライン
  workflows/        # CI/CDワークフロー
.specify/           # spec-kit設定とテンプレート
memory/             # プロジェクト記憶と憲法
specs/              # 機能仕様書（開発中、ブランチごと）
docs/
  architecture/     # アーキテクチャ仕様（技術設計、システム構成）
  business/         # ビジネス仕様（要件、ユースケース、ドメインモデル）
```

### Documentation Integration Rule

- 実装時に `docs/` 配下に統合仕様書を作成・更新
- コード変更と同時にドキュメントを更新（実装完了後の移動ではなく）
- アーキテクチャ仕様は `docs/architecture/` に配置
- ビジネス仕様は `docs/business/` に配置
- `specs/` はブランチ作業用、`docs/` は確定仕様の保管場所

### Future Migration

- 確定した仕様は実装時に `docs/` フォルダに保存
- ローカル環境（CLI/VSCode）への切り替えを考慮

## Project Scope

### Initial Scope

このプロジェクトは勤怠管理システムを構築しますが、初期セットアップではspec-kitの最小限の構成のみを行います。

### Target System Features (Future)

- 出退勤記録
- 休暇申請と承認
- 勤怠データの集計とレポート
- ユーザー管理

これらの機能は、仕様駆動開発ワークフローに従って今後のイテレーションで仕様化・実装します。
