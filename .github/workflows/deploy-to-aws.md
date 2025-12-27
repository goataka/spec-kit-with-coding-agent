# deploy-to-aws.yml

## 概要

AWS CDKを使用してDynamoDB Clock Tableをデプロイするワークフロー。

## トリガー条件

### 自動デプロイ

`infrastructure/`配下のファイルが`main`ブランチにプッシュされた時に自動実行されます。

### 手動デプロイ

GitHub Actionsの画面から手動で実行できます。環境（dev/staging）を選択可能です。

## ワークフローステップ

### 1. 環境セットアップ

- リポジトリのチェックアウト
- Node.js 20.xのセットアップ
- 依存関係のインストール（`npm ci`）

### 2. ビルドとテスト

CDKコードのビルド（`npm run build`）とユニットテスト（`npm test`）を実行します。

### 3. AWS認証

OIDC認証を使用してAWSに接続します。`AWS_ROLE_TO_ASSUME`シークレットに設定されたIAMロールを引き受けます。

### 4. CDK Bootstrap（初回のみ）

初回デプロイ時に`npx cdk bootstrap`を実行し、CDK管理用のS3バケットとIAMロールを作成します。

### 5. CDK Deploy

`npx cdk deploy --all --require-approval never`を実行し、CloudFormationスタックとDynamoDBテーブルをデプロイします。

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
