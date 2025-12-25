# AWS DynamoDB Clock Table CI/CD - 仕様書

## 📋 ドキュメント一覧

### メインドキュメント

1. **[spec.md](./spec.md)** - 機能仕様書
   - ユーザーストーリーと受け入れ条件
   - 機能要件と非機能要件
   - 成功基準
   - スコープ定義

2. **[plan.md](./plan.md)** - 技術実装計画
   - 技術スタックの選定
   - アーキテクチャ設計
   - CDKスタック構造
   - OIDC認証フロー
   - DynamoDB設計詳細

3. **[tasks.md](./tasks.md)** - 実装タスク
   - タスク分解（13タスク）
   - 依存関係グラフ
   - 実装順序
   - 見積工数（約19.5時間）

### 補足ドキュメント

4. **[OIDC_MIGRATION_GUIDE.md](./OIDC_MIGRATION_GUIDE.md)** - OIDC移行ガイド
   - 手動セットアップからCDK管理への移行手順
   - AWS CLIコマンド集
   - トラブルシューティング

5. **[COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)** - コスト最適化戦略
   - 初期段階で除外する機能
   - コスト見積もり（月額約$3）
   - 将来の拡張計画

## 🎯 主要な変更点（2025-12-25更新）

### 1. OIDC管理のCDK化

**変更前:**
- 手動でOIDCプロバイダーとIAMロールを作成
- 手動設定を継続使用

**変更後:**
- 初回のみ手動セットアップ（ブートストラップ用）
- CDKデプロイでOIDCプロバイダーとIAMロールを自動管理
- 手動設定を削除し、以降はCDK管理を使用

**メリット:**
- インフラストラクチャとしてのコード管理
- 環境間の一貫性
- ドリフト検出と自動修正
- 再現可能な環境構築

### 2. コスト削減の実装

**除外した機能:**
- CloudWatchアラーム（スロットル、エラー）: 月額$0.80削減
- 詳細モニタリング: 月額$3.20削減
- SNS通知
- カスタムメトリクス

**維持する機能:**
- DynamoDB基本機能（On-Demand課金）
- Point-in-Time Recovery（PITR）
- AWS管理キーによる暗号化
- 基本CloudWatchメトリクス（無料）
- コスト配分タグ

**コスト削減効果:**
- 初期段階: 月額約$3（年間約$36）
- 除外した監視機能を含む場合: 月額約$7（年間約$84）
- **年間削減額: 約$48**

## 🚀 実装の流れ

### フェーズ1: 初回セットアップ（CloudFormation推奨）

1. CloudFormationテンプレート `bootstrap-oidc.yaml` でOIDCとIAMロールを作成
2. CloudFormation出力からロールARNを取得
3. GitHub Secretsに`AWS_ROLE_TO_ASSUME`を設定
4. CDK Bootstrapを実行

### フェーズ2: CDKデプロイとOIDC移行

5. CDKスタックをデプロイ（OIDC + IAMロール + DynamoDB）
6. CDKスタックのCloudFormation出力から新しいロールARNを取得
7. GitHub Secretsを更新（CDK管理のロールARNに変更）
8. 動作確認

### フェーズ3: クリーンアップ

9. ブートストラップ用のCloudFormationスタックを削除
10. 最終動作確認

## 📊 技術スタック

### インフラストラクチャ

- **AWS CDK**: v2.x (TypeScript)
- **DynamoDB**: On-Demand課金モード
- **IAM OIDC**: GitHub Actions認証

### CI/CD

- **GitHub Actions**: ワークフロー実行
- **Node.js**: v22 LTS
- **TypeScript**: v5.x

## 📦 リソース構成

### DynamoDB テーブル

- **テーブル名**: `spec-kit-{environment}-clock`
- **Partition Key**: `userId` (String)
- **Sort Key**: `timestamp` (String, ISO 8601)
- **GSI**: `DateIndex` (date + timestamp)
- **課金モード**: PAY_PER_REQUEST
- **PITR**: 有効
- **暗号化**: AWS管理キー

### IAM

- **OIDC Provider**: `token.actions.githubusercontent.com`
- **IAM Role**: `GitHubActionsDeployRole-{environment}`
- **ポリシー**: PowerUserAccess + IAM権限

### CloudFormation 出力

- `TableName`: DynamoDBテーブル名
- `TableArn`: DynamoDBテーブルARN
- `GitHubActionsRoleArn`: IAMロールARN
- `OIDCProviderArn`: OIDCプロバイダーARN

## 📈 成功指標

### 技術指標

- [ ] CDKスタックが正常にデプロイされる
- [ ] OIDC認証が正常に動作する
- [ ] DynamoDBテーブルが作成される
- [ ] 手動設定からCDK管理への移行が完了する
- [ ] すべてのテストがパスする

### コスト指標

- [ ] 月額コストが$5以下に収まる
- [ ] 無料枠を最大限活用できている
- [ ] コストタグでリソースを追跡できる

### 運用指標

- [ ] デプロイが10分以内に完了する
- [ ] ワークフローの成功率が95%以上
- [ ] ドキュメントで開発者が自律的にセットアップできる

## 🔗 関連リンク

### AWS リソース

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [IAM OIDC Providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

### GitHub

- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Repository](https://github.com/goataka/spec-kit-with-coding-agent)

## 📝 次のステップ

1. インフラストラクチャコードの実装（タスク1.1-1.4）
2. GitHub Actionsワークフローの作成（タスク2.1-2.2）
3. テストの実装（タスク3.1-3.2）
4. ドキュメントの作成（タスク4.1-4.3）
5. 本番環境へのデプロイ準備

## ⚠️ 重要な注意事項

### OIDC移行について

- 初回セットアップは必ず手動で行う
- CDKデプロイ後、必ずGitHub Secretsを更新する
- 手動設定は動作確認後に削除する

### コスト管理について

- CloudWatchアラームは初期段階で実装しない
- 基本メトリクスで手動監視を行う
- 月次でコストをレビューする
- 本番環境では監視機能の追加を検討する

### セキュリティについて

- OIDCを使用し、永続認証情報を保存しない
- IAMロールは最小権限の原則に従う
- 定期的にセキュリティレビューを実施する

## 🤝 貢献

このプロジェクトはspec-kitの仕様駆動開発に従っています。変更を加える場合は、まず仕様書を更新してください。

1. 仕様書の更新（spec.md）
2. 計画の更新（plan.md）
3. タスクの更新（tasks.md）
4. 実装
5. ドキュメントの更新

## 📄 ライセンス

このプロジェクトのライセンスについては、リポジトリのLICENSEファイルを参照してください。

---

**最終更新**: 2025-12-25  
**ステータス**: 仕様確定、実装準備完了  
**担当**: goataka
