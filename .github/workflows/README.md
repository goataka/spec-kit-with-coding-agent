# GitHub Actions ワークフロー

## ワークフローサマリー

このディレクトリには、attendance-kyt プロジェクトの CI/CD ワークフローが含まれています。

### deploy-to-aws.yml

AWS CDKを使用してDynamoDBインフラストラクチャをデプロイするワークフロー。

- **トリガー**: 
  - `infrastructure/`配下のファイルが`main`ブランチにプッシュされた時（自動）
  - 手動実行（`workflow_dispatch`）
- **環境**: dev, staging
- **認証**: OIDC

詳細は [deploy-to-aws.md](./deploy-to-aws.md) を参照してください。

## 関連ドキュメント

- [デプロイメント戦略](../../docs/architecture/cicd-deployment-strategy.md) - 全体的なCI/CD戦略
- [運用ガイド](../../infrastructure/DEPLOYMENT.md) - デプロイ手順

