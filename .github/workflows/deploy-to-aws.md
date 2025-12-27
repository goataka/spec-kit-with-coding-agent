# deploy-to-aws.yml

## 概要

AWS CDKを使用してDynamoDB Clock Tableをデプロイするワークフロー。

## トリガー条件

### 自動デプロイ

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'infrastructure/**'
```

`infrastructure/`配下のファイルが`main`ブランチにプッシュされた時に自動実行されます。

### 手動デプロイ

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - staging
```

GitHub Actionsの画面から手動で実行できます。環境（dev/staging）を選択可能です。

## ワークフローステップ

### 1. 環境セットアップ

- リポジトリのチェックアウト
- Node.js 20.xのセットアップ
- 依存関係のインストール（`npm ci`）

### 2. ビルドとテスト

```bash
cd infrastructure
npm run build
npm test
```

CDKコードのビルドとユニットテストを実行します。

### 3. AWS認証

OIDC認証を使用してAWSに接続します：

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
    aws-region: ap-northeast-1
```

### 4. CDK Bootstrap（初回のみ）

```bash
npx cdk bootstrap
```

初回デプロイ時にCDK管理用のS3バケットとIAMロールを作成します。

### 5. CDK Deploy

```bash
npx cdk deploy --all --require-approval never
```

CloudFormationスタックとDynamoDBテーブルをデプロイします。

## 必要な設定

### GitHub Secrets

- `AWS_ROLE_TO_ASSUME`: デプロイに使用するIAMロールのARN

### 環境変数

- `ENVIRONMENT`: デプロイ先環境（dev/staging）
  - 自動デプロイ: `dev`（固定）
  - 手動デプロイ: 入力で選択

## セキュリティ

- **OIDC認証**: 永続的な認証情報は使用しない
- **IAM権限**: 必要最小限の権限のみを付与
- **リポジトリ制限**: 特定のGitHubリポジトリのみがロールを引き受け可能

## トラブルシューティング

デプロイに失敗した場合は [トラブルシューティングガイド](../../infrastructure/TROUBLESHOOTING.md) を参照してください。
