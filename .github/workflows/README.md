# GitHub Actions ワークフロー

## ワークフローサマリー

このディレクトリには、プロジェクトの CI/CD ワークフローが含まれています。

### deploy-to-aws.yml

AWS CDKを使用してDynamoDBインフラストラクチャをデプロイするワークフロー。

- **トリガー**: 
  - `infrastructure/`配下のファイルが`main`ブランチにプッシュされた時（自動）
  - 手動実行（`workflow_dispatch`）
- **環境**: dev, staging
- **認証**: OIDC

詳細は [deploy-to-aws.md](./deploy-to-aws.md) を参照してください。
