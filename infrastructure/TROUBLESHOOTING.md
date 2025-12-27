# トラブルシューティング

## CDK Bootstrapエラー

Bootstrapが必要な場合は、ワークフローが自動的に実行します。手動実行が必要な場合：

```bash
npx cdk bootstrap aws://ACCOUNT_ID/ap-northeast-1 --context environment=dev
```

## OIDC認証エラー

- GitHub Secretsの`AWS_ROLE_TO_ASSUME`が正しく設定されているか確認
- IAMロールのTrust Policyがリポジトリを許可しているか確認

## デプロイ失敗

- CloudFormationコンソールでスタックイベントを確認
- GitHub Actionsログで詳細なエラーメッセージを確認
- CloudFormationが自動的にロールバックを実行
