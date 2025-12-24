# 勤怠管理システム

このプロジェクトは、[spec-kit](https://github.com/github/spec-kit)を使用した仕様駆動開発により構築される勤怠管理システムです。

## 🌏 言語ポリシー

- **仕様書・要件定義**: 日本語
- **コード・技術文書**: 英語
- **コミュニケーション**: 日本語

詳細は [memory/constitution.md](memory/constitution.md) を参照してください。

## 🏗️ プロジェクト構造

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

## 🚀 Spec-Kit セットアップ

このプロジェクトでは、DevContainerを使用した一貫性のある開発環境を提供します。

### DevContainerの使用（推奨）

**VS Codeでの使用**:

1. VS Codeで開く
2. コマンドパレット: "Dev Containers: Reopen in Container"
3. コンテナが起動し、自動的にspec-kitがセットアップされます

**GitHub Copilot Coding Agentでの使用**:

エージェントは `.devcontainer/devcontainer.json` の設定を参照し、自動的に同じ環境を構築します。

### 自動セットアップの内容

`.devcontainer/devcontainer.json` と `.github/workflows/copilot-setup-steps.yml` により：

- ✅ Python 3.12 with uv (pre-installed Docker image)
- ✅ spec-kit CLI
- ✅ VS Code extensions (Copilot, Python)
- ✅ 必要な環境変数とPATH設定

### 手動セットアップ（非推奨）

DevContainerを使わずにローカル環境でspec-kitを使用する場合：

#### 前提条件

- Python 3.11+
- Git
- uv (Python package manager)

#### インストール

```bash
# Install uv
pip3 install uv

# Install spec-kit
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Verify installation
specify --help
```

### ワークフローコマンド

このプロジェクトではGitHub Copilot Coding Agent経由で以下のコマンドを使用します：

- `/constitution`: プロジェクト憲法の作成・更新
- `/specify`: 機能仕様の作成
- `/plan`: 技術計画の作成
- `/tasks`: 実装タスクの作成
- `/implement`: タスクの実装

## 📖 仕様駆動開発ワークフロー

### 1. 憲法の確認

プロジェクトの原則とガイドラインを確認：
```
/constitution
```

### 2. 機能仕様の作成

実装したい機能を仕様化：
```
/specify <機能の説明>
```

### 3. 技術計画の作成

仕様に基づいた技術的なアプローチを計画：
```
/plan
```

### 4. タスクの作成

実装可能な作業単位に分解：
```
/tasks
```

### 5. 実装

タスクを実装：
```
/implement
```

## 📝 ドキュメント

- [憲法](memory/constitution.md): プロジェクトの原則とガイドライン
- 仕様書: `specs/`ディレクトリに機能ごとに作成
- 実装文書: `docs/`ディレクトリに確定版を保存

## 🎯 初期セットアップ状況

✅ spec-kit minimal setup completed:
- ✅ uv installed
- ✅ spec-kit CLI installed
- ✅ Directory structure created
- ✅ Constitution with Japanese language support created
- ✅ Templates configured

## 🔮 今後の開発

勤怠管理システムの主要機能：
- 出退勤記録
- 休暇申請と承認
- 勤怠データの集計とレポート
- ユーザー管理

これらの機能は、spec-kitのワークフローに従って順次実装していきます。

## 📚 リソース

- [Spec-Kit Official Documentation](https://github.com/github/spec-kit)
- [Spec-Kit Website](https://speckit.org/)
- [GitHub Blog: Spec-driven Development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

## 🤝 貢献

プロジェクト憲法に従って開発を進めてください。