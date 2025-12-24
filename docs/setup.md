# Spec-Kit セットアップガイド

## 概要

このドキュメントでは、本プロジェクトにおけるspec-kitの初期セットアップについて説明します。

## DevContainerによる自動セットアップ（推奨）

### DevContainerの使用

このプロジェクトでは、開発環境のセットアップにDevContainerを使用します。

#### VS Codeでの使用

1. **VS Codeでプロジェクトを開く**
2. **コマンドパレットを開く**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. **"Dev Containers: Reopen in Container"** を選択
4. コンテナが自動的にビルドされ、spec-kitがインストールされます

#### GitHub Copilot Coding Agentでの使用

Copilot Agentは `.devcontainer/devcontainer.json` の設定を参照し、`.github/workflows/copilot-setup-steps.yml` により自動的に環境を構築します。

#### DevContainerの内容

1. **Base Image**: `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`
   - Python 3.12
   - uv package manager (pre-installed)
   
2. **自動インストール**:
   - spec-kit CLI
   - Git
   
3. **VS Code Extensions**:
   - Python
   - GitHub Copilot
   - GitHub Copilot Chat

4. **環境設定**:
   - PATH設定（spec-kitコマンドが使用可能）
   - プロジェクトディレクトリのマウント

#### メリット

- ✅ 一貫した開発環境
- ✅ ローカルとCopilot Agentで同じ環境
- ✅ 自動セットアップ
- ✅ 将来の依存関係追加が容易
- ✅ 起動時間の短縮

#### 動作確認方法

DevContainer内で以下を実行：

```bash
# Check Python version
python --version

# Check uv version
uv --version

# Check spec-kit
specify --help
```

### 新しい依存関係の追加

**重要**: 将来、新しいツールや依存関係が必要になった場合、DevContainerに追加してください。

1. `.devcontainer/devcontainer.json` を編集
2. `postCreateCommand` または `features` を更新
3. コンテナを再ビルド: "Dev Containers: Rebuild Container"

詳細は `.devcontainer/README.md` を参照してください。

## 手動インストール（非推奨）

DevContainerを使わずにローカル環境でspec-kitを使用する場合の手順です。

### 1. uv (Python Package Manager)

```bash
pip3 install uv
```

### 2. Spec-Kit CLI

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

### 3. 確認

```bash
specify --help
```

## プロジェクト構造

### ディレクトリ構成

```
.github/
└── workflows/

.devcontainer/
├── devcontainer.json           # DevContainer設定
└── README.md                   # DevContainer使用ガイド

.github/
└── workflows/
    └── copilot-setup-steps.yml  # Copilot Agent自動セットアップ（DevContainer参照）

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
└── constitution.md         # プロジェクト憲法（DevContainer使用を規定）

specs/                      # 機能仕様書（ブランチごと）

docs/                       # 確定した仕様と実装ドキュメント
└── setup.md               # このファイル
```

## Coding Agent経由での使用

### 重要

このプロジェクトでは、DevContainerベースの環境でspec-kitを使用します。

### ワークフローコマンド

#### 1. Constitution（憲法）

```
/constitution
```

プロジェクトの原則、ガイドライン、ガバナンスを定義します。

#### 2. Specify（仕様化）

```
/specify <機能の説明>
```

実装したい機能をユーザーシナリオと要件として文書化します。

#### 3. Plan（計画）

```
/plan
```

仕様に基づいて技術的なアプローチとアーキテクチャを計画します。

#### 4. Tasks（タスク化）

```
/tasks
```

計画を実装可能な作業単位に分解します。

#### 5. Implement（実装）

```
/implement
```

タスクを実装します。

## 日本語対応

### 言語ポリシー

本プロジェクトでは、以下の言語ポリシーを採用しています：

#### 日本語を使用する場面

- 仕様書
- ユーザーストーリー
- 要件定義
- プロジェクト憲法
- チームコミュニケーション

#### 英語を使用する場面

- コード
- 変数名・関数名・クラス名
- コミットメッセージ
- 技術的なコメント

#### バイリンガル

- アーキテクチャドキュメント
- APIドキュメント
- セットアップガイド

### テンプレートのカスタマイズ

spec-kitのテンプレートは英語で提供されていますが、以下のようにカスタマイズしています：

1. **憲法**: バイリンガル版を作成
   - 原則と説明を日本語と英語で記載
   
2. **仕様書テンプレート**: 日本語コメントを追加
   - ユーザーストーリーは日本語で記述
   - 技術的な詳細は英語も併記

3. **コマンドテンプレート**: 日本語使用を推奨する注釈を追加

## 今後の検討事項

### ローカル環境への移行

将来的にローカル環境（CLI/VSCode）への切り替えを考慮しています：

1. **確定仕様の保存**
   - 実装完了後、`specs/`から`docs/`へ移動
   - バージョン管理とトレーサビリティの確保

2. **ローカルツールの利用**
   - VSCode Extension のインストール
   - ローカルCLIでのワークフロー実行

3. **チーム展開**
   - 各開発者の環境セットアップ
   - ワークフローのトレーニング

## トラブルシューティング

### GitHub API Rate Limiting

spec-kit初期化時にGitHub APIのレート制限に遭遇する場合：

```bash
# GitHubトークンを使用
export GITHUB_TOKEN="your-token"
specify init --here --ai copilot --github-token $GITHUB_TOKEN
```

### Manual Template Setup

自動初期化が失敗した場合は、テンプレートを手動でセットアップ：

```bash
# テンプレートリポジトリをクローン
git clone https://github.com/github/spec-kit.git /tmp/spec-kit

# テンプレートをコピー
mkdir -p .specify/templates
cp -r /tmp/spec-kit/templates/* .specify/templates/
```

## 参考資料

- [Spec-Kit GitHub Repository](https://github.com/github/spec-kit)
- [Spec-Kit Documentation](https://github.github.com/spec-kit/)
- [Spec-Kit Website](https://speckit.org/)
- [GitHub Blog: Spec-driven Development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

## バージョン履歴

- **1.0.0** (2025-12-24): 初期セットアップ完了
  - uv and spec-kit CLI installed
  - Directory structure created
  - Constitution with Japanese support created
  - Templates configured
