# 勤怠管理システム (Attendance Management System)

このプロジェクトは、[spec-kit](https://github.com/github/spec-kit)を使用した仕様駆動開発により構築される勤怠管理システムです。

This project is an attendance management system built using specification-driven development with [spec-kit](https://github.com/github/spec-kit).

## 🌏 Language Policy / 言語ポリシー

- **仕様書・要件定義**: 日本語 (Japanese)
- **コード・技術文書**: 英語 (English)
- **コミュニケーション**: 日本語 (Japanese)

詳細は [memory/constitution.md](memory/constitution.md) を参照してください。

## 🏗️ Project Structure / プロジェクト構造

```
.
├── .devcontainer/     # DevContainer設定
│   ├── devcontainer.json
│   └── README.md
├── .github/
│   └── workflows/
│       └── copilot-setup-steps.yml  # 自動セットアップ
├── .specify/          # spec-kit設定とテンプレート
│   └── templates/     # ドキュメントテンプレート
├── memory/            # プロジェクト憲法と記憶
├── specs/             # 機能仕様書（ブランチごと）
├── docs/              # 確定した仕様と実装ドキュメント
└── README.md          # このファイル
```

## 🚀 Spec-Kit Setup / セットアップ

このプロジェクトでは、DevContainerを使用した一貫性のある開発環境を提供します。

This project provides a consistent development environment using DevContainer.

### DevContainerの使用 / Using DevContainer (推奨 / Recommended)

**VS Codeでの使用 / For VS Code**:

1. VS Codeで開く / Open in VS Code
2. コマンドパレット: "Dev Containers: Reopen in Container"
3. コンテナが起動し、自動的にspec-kitがセットアップされます

**GitHub Copilot Coding Agentでの使用**:

エージェントは `.devcontainer/devcontainer.json` の設定を参照し、自動的に同じ環境を構築します。

The agent references `.devcontainer/devcontainer.json` and automatically builds the same environment.

### 自動セットアップの内容 / What Gets Setup Automatically

`.devcontainer/devcontainer.json` と `.github/workflows/copilot-setup-steps.yml` により：

- ✅ Python 3.12 with uv (pre-installed Docker image)
- ✅ spec-kit CLI
- ✅ VS Code extensions (Copilot, Python)
- ✅ 必要な環境変数とPATH設定

### 手動セットアップ / Manual Setup (非推奨 / Not Recommended)

DevContainerを使わずにローカル環境でspec-kitを使用する場合：

If you want to use spec-kit without DevContainer:

#### Prerequisites / 前提条件

- Python 3.11+
- Git
- uv (Python package manager)

#### Installation / インストール

```bash
# Install uv
pip3 install uv

# Install spec-kit
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Verify installation
specify --help
```

### Workflow Commands / ワークフローコマンド

このプロジェクトではGitHub Copilot Coding Agent経由で以下のコマンドを使用します：

- `/constitution`: プロジェクト憲法の作成・更新
- `/specify`: 機能仕様の作成
- `/plan`: 技術計画の作成
- `/tasks`: 実装タスクの作成
- `/implement`: タスクの実装

## 📖 Specification-Driven Development Workflow

### 1. 憲法の確認 (Review Constitution)

プロジェクトの原則とガイドラインを確認：
```
/constitution
```

### 2. 機能仕様の作成 (Create Specification)

実装したい機能を仕様化：
```
/specify <機能の説明>
```

### 3. 技術計画の作成 (Create Technical Plan)

仕様に基づいた技術的なアプローチを計画：
```
/plan
```

### 4. タスクの作成 (Create Tasks)

実装可能な作業単位に分解：
```
/tasks
```

### 5. 実装 (Implementation)

タスクを実装：
```
/implement
```

## 📝 Documentation / ドキュメント

- [Constitution (憲法)](memory/constitution.md): プロジェクトの原則とガイドライン
- Specifications (仕様書): `specs/`ディレクトリに機能ごとに作成
- Implementation Docs (実装文書): `docs/`ディレクトリに確定版を保存

## 🎯 Initial Setup Status / 初期セットアップ状況

✅ spec-kit minimal setup completed:
- ✅ uv installed
- ✅ spec-kit CLI installed
- ✅ Directory structure created
- ✅ Constitution with Japanese language support created
- ✅ Templates configured

## 🔮 Future Development / 今後の開発

勤怠管理システムの主要機能：
- 出退勤記録 (Clock in/out recording)
- 休暇申請と承認 (Leave request and approval)
- 勤怠データの集計とレポート (Attendance data aggregation and reporting)
- ユーザー管理 (User management)

これらの機能は、spec-kitのワークフローに従って順次実装していきます。

## 📚 Resources / リソース

- [Spec-Kit Official Documentation](https://github.com/github/spec-kit)
- [Spec-Kit Website](https://speckit.org/)
- [GitHub Blog: Spec-driven Development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

## 🤝 Contributing / 貢献

プロジェクト憲法に従って開発を進めてください。
Please follow the project constitution when contributing.