# Development Container Configuration

このディレクトリには、spec-kit開発環境のDevContainerの設定が含まれています。

## 概要

DevContainerを使用することで、以下のメリットがあります：

- ✅ 一貫した開発環境
- ✅ 自動セットアップ
- ✅ ローカル開発とCopilot Agentの両方で使用可能
- ✅ 将来の依存関係も簡単に追加可能

## 設定内容

### ベースイメージ

```
ghcr.io/astral-sh/uv:python3.12-bookworm-slim
```

- Python 3.12
- uv package manager (pre-installed)

### 自動インストール

**postCreateCommand**:
- spec-kit CLI のインストール
- 環境の検証

### VS Code 拡張機能

- Python
- GitHub Copilot
- GitHub Copilot Chat

### マウント

プロジェクトの重要なディレクトリがコンテナにマウントされます：
- `.specify/` - テンプレート
- `memory/` - 憲法
- `specs/` - 仕様書
- `docs/` - ドキュメント

## 使用方法

### VS Codeでの使用

1. VS Codeで開く
2. コマンドパレット: "Dev Containers: Reopen in Container"
3. コンテナが起動し、自動セットアップが実行されます

### GitHub Copilot Coding Agentでの使用

`.github/workflows/copilot-setup-steps.yml` がこの設定を参照し、同じ環境を構築します。

## 新しい依存関係の追加

将来、新しいツールや依存関係が必要になった場合：

1. `devcontainer.json` の `postCreateCommand` を更新
2. または新しい `features` を追加
3. コンテナを再ビルド: "Dev Containers: Rebuild Container"

### 例

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

## トラブルシューティング

### コンテナが起動しない

```bash
# コンテナを再ビルド
Dev Containers: Rebuild Container Without Cache
```

### spec-kitが見つからない

```bash
# PATH を確認
echo $PATH

# 手動で再インストール
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

## 参考資料

- [VS Code DevContainers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [DevContainer Features](https://containers.dev/features)
- [GitHub Copilot Agent Setup](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
