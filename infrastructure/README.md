# Spec-Kit Infrastructure

AWS CDKを使用したDynamoDB Clock Tableのインフラストラクチャコードです。

## 📋 前提条件

- Node.js 20以上
- AWS CLI v2
- AWS CDKアカウント（初回のみCloudFormationでOIDCとIAMロールをセットアップ）
- GitHub Actions用のAWS IAMロール設定（OIDC経由）

## 🏗️ 構成

このインフラストラクチャには以下が含まれます：

- **DynamoDB Table**: `attendance-kit-{environment}-clock`
  - Partition Key: `userId` (String)
  - Sort Key: `timestamp` (String, ISO 8601形式)
  - Global Secondary Index: `DateIndex` (date + timestamp)
  - 課金モード: Pay-Per-Request
  - Point-in-Time Recovery有効
  - AWS管理キー暗号化

- **OIDC Provider**: GitHub Actions用
- **IAM Role**: GitHub ActionsがAWSリソースにアクセスするためのロール

## 🚀 初回セットアップ手順

### ステップ1: CloudFormationでOIDCプロバイダーとIAMロールを作成（初回のみ）

初回のみ、CloudFormationを使用してOIDCプロバイダーとIAMロールを手動で作成します。

1. AWSコンソールでCloudFormationサービスを開く
2. 新しいスタックを作成
3. `infrastructure/setup/setup-oidc-temporarily.yaml` テンプレートをアップロード
4. パラメータを確認・調整（必要に応じて）
5. スタックを作成
6. OutputsタブからロールARNをコピー

### ステップ2: GitHub Secretsを設定

1. GitHubリポジトリの Settings > Secrets and variables > Actions を開く
2. New repository secret をクリック
3. `AWS_ROLE_TO_ASSUME` という名前で、ステップ1で取得したロールARNを設定

### ステップ3: CDKをデプロイ（GitHub Actions使用）

1. GitHub Actions タブを開く
2. "Deploy to AWS" ワークフローを選択
3. "Run workflow" をクリック
4. 環境として "dev" を選択して実行

このデプロイで、CDK管理のOIDCプロバイダーとIAMロールが作成されます。

### ステップ4: GitHub Secretsを更新

1. デプロイ完了後、AWS CloudFormationコンソールで `AttendanceKit-Dev-Stack` の Outputs を確認
2. `GitHubActionsRoleArn` の値をコピー
3. GitHub Secrets の `AWS_ROLE_TO_ASSUME` を新しいARNに更新

### ステップ5: 初回CloudFormationスタックを削除

1. AWS CloudFormationコンソールを開く
2. 初回に作成したスタックを選択
3. "削除" をクリック

これ以降は、CDK管理のOIDCとIAMロールが使用されます。

## 💻 ローカル開発

### 依存関係のインストール

```bash
cd infrastructure
npm install
```

### ビルド

```bash
npm run build
```

### テスト実行

```bash
npm test
```

### CDK Synth（CloudFormationテンプレート生成）

```bash
# dev環境用
npx cdk synth --context environment=dev

# staging環境用
npx cdk synth --context environment=staging
```

### ローカルからのデプロイ（非推奨）

通常はGitHub Actions経由でデプロイしますが、必要に応じてローカルからもデプロイ可能です：

```bash
# AWS認証情報を設定
export AWS_PROFILE=your-profile

# Bootstrap（初回のみ）
npx cdk bootstrap --context environment=dev

# デプロイ
npx cdk deploy --context environment=dev
```

## 🔄 通常運用時のデプロイフロー

1. `infrastructure/` 配下のファイルを変更
2. PRを作成してレビュー
3. `main` ブランチにマージ
4. GitHub Actionsが自動的にデプロイを実行

または、手動でデプロイを実行：

1. GitHub Actions タブを開く
2. "Deploy to AWS" ワークフローを選択
3. "Run workflow" をクリックして環境を選択

## 🧪 テスト

```bash
npm test
```

ユニットテストには以下が含まれます：
- DynamoDBテーブルが正しく作成される
- Partition KeyとSort Keyが正しく設定される
- Global Secondary Indexが存在する
- Point-in-Time Recoveryが有効
- RETAIN削除ポリシーが設定される
- OIDCプロバイダーとIAMロールが作成される

## 📊 スタック出力

デプロイ完了後、以下の出力が利用可能：

- `TableName`: DynamoDBテーブル名
- `TableArn`: DynamoDBテーブルARN
- `GSIName`: Global Secondary Index名
- `Environment`: デプロイ環境
- `GitHubActionsRoleArn`: GitHub Actions用IAMロールARN
- `OIDCProviderArn`: OIDCプロバイダーARN

## 🔍 トラブルシューティング

### CDK Bootstrapエラー

```bash
# Bootstrapが必要な場合は手動で実行
npx cdk bootstrap aws://ACCOUNT_ID/ap-northeast-1 --context environment=dev
```

### OIDC認証エラー

GitHub Secretsの `AWS_ROLE_TO_ASSUME` が正しく設定されているか確認してください。

### テーブルが既に存在するエラー

CloudFormationが差分更新を実行します。RETAIN削除ポリシーによりデータは保護されます。

## 🏷️ タグ

すべてのリソースには以下のタグが付与されます：

- `Environment`: dev / staging
- `Project`: attendance-kit
- `ManagedBy`: CDK
- `CostCenter`: Engineering

## 💰 コスト最適化

- DynamoDBはPay-Per-Request課金モードを使用（低トラフィック時にコスト効率的）
- CloudWatchアラームなどの有料監視機能は初期段階では実装していません
- 基本的なCloudWatchメトリクス（無料）のみを使用

## 🔐 セキュリティ

- OIDC認証により永続的な認証情報は不要
- IAMロールは特定のリソースパターンにスコープ
- DynamoDBテーブルはAWS管理キーで暗号化
- Point-in-Time Recovery有効
