# Spec-Kit セットアップガイド (Setup Guide)

## Overview / 概要

このドキュメントでは、本プロジェクトにおけるspec-kitの初期セットアップについて説明します。

This document describes the initial spec-kit setup for this project.

## 自動セットアップ / Automatic Setup (GitHub Copilot Coding Agent)

### copilot-setup-steps.yml による自動化

このプロジェクトには `.github/workflows/copilot-setup-steps.yml` ファイルが含まれており、GitHub Copilot Coding Agentが自動的に環境をセットアップします。

This project includes `.github/workflows/copilot-setup-steps.yml` which automatically sets up the environment when using GitHub Copilot Coding Agent.

#### 自動セットアップの内容 / What Gets Installed Automatically

1. **Docker Image**: `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`
   - Python 3.12
   - uv package manager (pre-installed)
   
2. **Spec-Kit CLI**: 自動インストール / Automatically installed
   - `uv tool install` によるインストール
   - GitHubリポジトリから最新版を取得

3. **環境確認**: 自動検証 / Automatic verification
   - Python, uv, spec-kit の動作確認

#### メリット / Benefits

- ✅ 毎回の手動セットアップが不要 / No manual setup required each time
- ✅ 起動時間の大幅な短縮 / Significantly faster startup
- ✅ Docker イメージによる高速化 / Faster with pre-built Docker image
- ✅ 一貫した環境 / Consistent environment across all agent sessions

#### 動作確認方法 / How to Verify

GitHub Copilot Coding Agent のセッション内で以下を実行：

```bash
# Check Python version
python --version

# Check uv version
uv --version

# Check spec-kit (may need PATH configuration)
specify --help
```

## 手動インストール / Manual Installation (ローカル開発用 / For Local Development)

ローカル環境でspec-kitを使用する場合の手順です。

For local development without Copilot agent:

### 1. uv (Python Package Manager)

```bash
pip3 install uv
```

### 2. Spec-Kit CLI

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

### 3. Verification / 確認

```bash
specify --help
```

## Project Structure / プロジェクト構造

### Directory Layout / ディレクトリ構成

```
.github/
└── workflows/
    └── copilot-setup-steps.yml  # 自動セットアップ定義

.specify/
├── templates/              # ドキュメントテンプレート
│   ├── commands/          # ワークフローコマンド定義
│   │   ├── constitution.md
│   │   ├── specify.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   └── implement.md
│   ├── spec-template.md   # 仕様書テンプレート
│   ├── plan-template.md   # 計画書テンプレート
│   └── tasks-template.md  # タスクテンプレート

memory/
└── constitution.md         # プロジェクト憲法

specs/                      # 機能仕様書（ブランチごと）

docs/                       # 確定した仕様と実装ドキュメント
└── setup.md               # このファイル
```

## Usage via Coding Agent / Coding Agent経由での使用

### Important / 重要

このプロジェクトでは、通常のCLI使用ではなく、GitHub Copilot Coding Agent経由でspec-kitを使用します。

This project uses spec-kit through GitHub Copilot Coding Agent, not through normal CLI usage.

### Workflow Commands / ワークフローコマンド

#### 1. Constitution (憲法)

```
/constitution
```

プロジェクトの原則、ガイドライン、ガバナンスを定義します。

Defines project principles, guidelines, and governance.

#### 2. Specify (仕様化)

```
/specify <機能の説明>
```

実装したい機能をユーザーシナリオと要件として文書化します。

Documents the feature to be implemented as user scenarios and requirements.

#### 3. Plan (計画)

```
/plan
```

仕様に基づいて技術的なアプローチとアーキテクチャを計画します。

Plans technical approach and architecture based on the specification.

#### 4. Tasks (タスク化)

```
/tasks
```

計画を実装可能な作業単位に分解します。

Breaks down the plan into implementable work units.

#### 5. Implement (実装)

```
/implement
```

タスクを実装します。

Implements the tasks.

## Japanese Language Support / 日本語対応

### Language Policy / 言語ポリシー

本プロジェクトでは、以下の言語ポリシーを採用しています：

This project adopts the following language policy:

#### 日本語を使用する場面 (Use Japanese for)

- 仕様書 (Specifications)
- ユーザーストーリー (User stories)
- 要件定義 (Requirements)
- プロジェクト憲法 (Project constitution)
- チームコミュニケーション (Team communication)

#### 英語を使用する場面 (Use English for)

- コード (Code)
- 変数名・関数名・クラス名 (Variable/function/class names)
- コミットメッセージ (Commit messages)
- 技術的なコメント (Technical comments)

#### バイリンガル (Bilingual)

- アーキテクチャドキュメント (Architecture documents)
- API ドキュメント (API documentation)
- セットアップガイド (Setup guides)

### Template Customization / テンプレートのカスタマイズ

spec-kitのテンプレートは英語で提供されていますが、以下のようにカスタマイズしています：

Spec-kit templates are provided in English, but we have customized them as follows:

1. **憲法 (Constitution)**: バイリンガル版を作成
   - 原則と説明を日本語と英語で記載
   
2. **仕様書テンプレート**: 日本語コメントを追加
   - ユーザーストーリーは日本語で記述
   - 技術的な詳細は英語も併記

3. **コマンドテンプレート**: 日本語使用を推奨する注釈を追加

## Future Considerations / 今後の検討事項

### Migration to Local Environment / ローカル環境への移行

将来的にローカル環境（CLI/VSCode）への切り替えを考慮しています：

We are considering future migration to local environments (CLI/VSCode):

1. **確定仕様の保存 (Saving Finalized Specs)**
   - 実装完了後、`specs/`から`docs/`へ移動
   - バージョン管理とトレーサビリティの確保

2. **ローカルツールの利用 (Using Local Tools)**
   - VSCode Extension のインストール
   - ローカルCLIでのワークフロー実行

3. **チーム展開 (Team Rollout)**
   - 各開発者の環境セットアップ
   - ワークフローのトレーニング

## Troubleshooting / トラブルシューティング

### GitHub API Rate Limiting

spec-kit初期化時にGitHub APIのレート制限に遭遇する場合：

If you encounter GitHub API rate limiting during spec-kit initialization:

```bash
# GitHubトークンを使用
export GITHUB_TOKEN="your-token"
specify init --here --ai copilot --github-token $GITHUB_TOKEN
```

### Manual Template Setup

自動初期化が失敗した場合は、テンプレートを手動でセットアップ：

If automatic initialization fails, manually set up templates:

```bash
# テンプレートリポジトリをクローン
git clone https://github.com/github/spec-kit.git /tmp/spec-kit

# テンプレートをコピー
mkdir -p .specify/templates
cp -r /tmp/spec-kit/templates/* .specify/templates/
```

## References / 参考資料

- [Spec-Kit GitHub Repository](https://github.com/github/spec-kit)
- [Spec-Kit Documentation](https://github.github.com/spec-kit/)
- [Spec-Kit Website](https://speckit.org/)
- [GitHub Blog: Spec-driven Development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

## Version History / バージョン履歴

- **1.0.0** (2025-12-24): 初期セットアップ完了
  - uv and spec-kit CLI installed
  - Directory structure created
  - Constitution with Japanese support created
  - Templates configured
