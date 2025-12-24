# Development Container Configuration

このディレクトリには、spec-kit開発環境のDevContainerの設定が含まれています。

This directory contains the DevContainer configuration for the spec-kit development environment.

## 概要 / Overview

DevContainerを使用することで、以下のメリットがあります：

By using DevContainer, you get:

- ✅ 一貫した開発環境 / Consistent development environment
- ✅ 自動セットアップ / Automatic setup
- ✅ ローカル開発とCopilot Agentの両方で使用可能 / Works for both local dev and Copilot Agent
- ✅ 将来の依存関係も簡単に追加可能 / Easy to add future dependencies

## 設定内容 / Configuration

### Base Image / ベースイメージ

```
ghcr.io/astral-sh/uv:python3.12-bookworm-slim
```

- Python 3.12
- uv package manager (pre-installed)

### 自動インストール / Automatic Installation

**postCreateCommand**:
- spec-kit CLI のインストール
- 環境の検証

### VS Code 拡張機能 / VS Code Extensions

- Python
- GitHub Copilot
- GitHub Copilot Chat

### マウント / Mounts

プロジェクトの重要なディレクトリがコンテナにマウントされます：
- `.specify/` - テンプレート
- `memory/` - 憲法
- `specs/` - 仕様書
- `docs/` - ドキュメント

## 使用方法 / Usage

### VS Codeでの使用 / Using with VS Code

1. VS Codeで開く / Open in VS Code
2. コマンドパレット: "Dev Containers: Reopen in Container"
3. コンテナが起動し、自動セットアップが実行されます

### GitHub Copilot Coding Agentでの使用

`.github/workflows/copilot-setup-steps.yml` がこの設定を参照し、同じ環境を構築します。

## 新しい依存関係の追加 / Adding New Dependencies

将来、新しいツールや依存関係が必要になった場合：

When you need to add new tools or dependencies in the future:

1. `devcontainer.json` の `postCreateCommand` を更新
2. または新しい `features` を追加
3. コンテナを再ビルド: "Dev Containers: Rebuild Container"

### 例 / Examples

```json
{
  "features": {
    "ghcr.io/devcontainers/features/git:1": {},
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  }
}
```

## トラブルシューティング / Troubleshooting

### コンテナが起動しない / Container won't start

```bash
# コンテナを再ビルド
Dev Containers: Rebuild Container Without Cache
```

### spec-kitが見つからない / spec-kit not found

```bash
# PATH を確認
echo $PATH

# 手動で再インストール
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

## 参考資料 / References

- [VS Code DevContainers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [DevContainer Features](https://containers.dev/features)
- [GitHub Copilot Agent Setup](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
