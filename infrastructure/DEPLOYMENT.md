# デプロイメントガイド

## 初回セットアップ

### ステップ1: OIDCプロバイダーとIAMロールの作成

初回のみ、CloudFormationを使用してOIDCプロバイダーとIAMロールを手動で作成します。

1. AWSコンソールでCloudFormationサービスを開く
2. 新しいスタックを作成
3. `setup/bootstrap-oidc.yaml`テンプレートをアップロード
4. スタックを作成
5. OutputsタブからロールARNをコピー

### ステップ2: GitHub Secretsの設定

1. GitHubリポジトリのSettings > Secrets and variables > Actionsを開く
2. `AWS_ROLE_TO_ASSUME`に取得したロールARNを設定

### ステップ3: CDKデプロイ

1. GitHub Actionsタブを開く
2. "Deploy to AWS"ワークフローを実行
3. 環境として"dev"を選択

このデプロイでCDK管理のOIDCプロバイダーとIAMロールが作成されます。

### ステップ4: GitHub Secretsの更新

1. デプロイ完了後、CloudFormationコンソールで`SpecKit-Dev-Stack`のOutputsを確認
2. `GitHubActionsRoleArn`の値をコピー
3. GitHub Secretsの`AWS_ROLE_TO_ASSUME`を新しいARNに更新

### ステップ5: 初回CloudFormationスタックの削除

1. CloudFormationコンソールで初回に作成したスタックを選択
2. "削除"をクリック

以降はCDK管理のOIDCとIAMロールが使用されます。

## 通常運用

### 自動デプロイ

1. `infrastructure/`配下のファイルを変更
2. PRを作成してレビュー
3. `main`ブランチにマージ
4. GitHub Actionsが自動的にデプロイを実行

### 手動デプロイ

1. GitHub Actionsタブを開く
2. "Deploy to AWS"ワークフローを選択
3. "Run workflow"をクリックして環境を選択

## トラブルシューティング

### CDK Bootstrapエラー

Bootstrapが必要な場合は、ワークフローが自動的に実行します。手動実行が必要な場合：

```bash
npx cdk bootstrap aws://ACCOUNT_ID/ap-northeast-1 --context environment=dev
```

### OIDC認証エラー

- GitHub Secretsの`AWS_ROLE_TO_ASSUME`が正しく設定されているか確認
- IAMロールのTrust Policyがリポジトリを許可しているか確認

### デプロイ失敗

- CloudFormationコンソールでスタックイベントを確認
- GitHub Actionsログで詳細なエラーメッセージを確認
- CloudFormationが自動的にロールバックを実行

## 監視

### ワークフロー実行履歴

- GitHub Actionsタブでワークフロー実行履歴を確認
- 失敗時のログ分析
- 成功率のトラッキング

### CloudFormationスタック

- AWSコンソールでスタックステータスを確認
- デプロイ履歴とイベントログの確認
