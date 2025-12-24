# AWS DynamoDB Deployment with CDK

このドキュメントでは、AWS CDKを使用して打刻テーブルをデプロイする方法について説明します。

## 概要

勤怠管理システムの打刻機能のために、DynamoDB clockテーブルをAWS CDKを使用してデプロイします。

## アーキテクチャ

```
GitHub Actions
    ↓
  [CDK Synth]
    ↓
  [CDK Deploy]
    ↓
AWS CloudFormation
    ↓
Amazon DynamoDB
  - Clock Table (打刻テーブル)
```

## DynamoDBテーブル設計

### Clock Table (`spec-kit-dev-clock`)

**用途**: 従業員の打刻（出退勤）記録を管理

**キー構造**:
- Partition Key: `userId` (String) - ユーザーID
- Sort Key: `timestamp` (String) - タイムスタンプ (ISO 8601形式)

**Global Secondary Index**:
- **DateIndex**
  - Partition Key: `date` (String) - 日付 (YYYY-MM-DD)
  - Sort Key: `timestamp` (String) - タイムスタンプ
  - 用途: 特定日の全打刻記録を効率的に取得

**属性例**:
```json
{
  "userId": "user-001",
  "timestamp": "2025-12-24T09:00:00Z",
  "date": "2025-12-24",
  "type": "clock-in",
  "location": "Tokyo Office",
  "deviceId": "device-123"
}
```

**クエリパターン**:
1. ユーザーごとの打刻履歴取得: `userId` でクエリ
2. 特定日の全打刻記録取得: DateIndex GSIで `date` でクエリ
3. ユーザーの特定期間の打刻履歴: `userId` と `timestamp` の範囲指定

**テーブル設定**:
- 課金モード: On-Demand (PAY_PER_REQUEST)
- Point-in-time Recovery: 有効
- 暗号化: AWS管理キー
- 削除ポリシー: RETAIN（誤削除防止）

## 前提条件

### 1. AWS環境

- AWS アカウント
- AWS CLI インストール済み
- AWS 認証情報設定済み

### 2. 開発環境

- Node.js 20以上
- npm
- Git

### 3. GitHub OIDC設定

GitHub ActionsからAWSへの認証にOIDC (OpenID Connect)を使用します。

#### IAM Identity Provider作成

**注意**: GitHub ActionsのOIDCサムプリントは変更される可能性があります。最新のサムプリントは[GitHubのドキュメント](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)で確認してください。

```bash
# 現在のサムプリント（2024年12月時点）
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

#### IAM Role作成

以下のポリシーを持つIAMロールを作成します：

**Trust Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<YOUR_ORG>/<YOUR_REPO>:*"
        }
      }
    }
  ]
}
```

**Permissions Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "dynamodb:*",
        "iam:GetRole",
        "iam:PassRole",
        "ssm:GetParameter"
      ],
      "Resource": "*"
    }
  ]
}
```

**注意**: 本番環境では、より厳密なリソース制限を設定してください。

### 4. GitHub Secrets設定

GitHubリポジトリに以下のSecretsを設定します：

Settings → Secrets and variables → Actions → New repository secret

- `AWS_ROLE_TO_ASSUME`: IAMロールのARN (例: `arn:aws:iam::123456789012:role/GitHubActionsRole`)

## ローカルでのセットアップ

### 1. 依存関係のインストール

```bash
cd infrastructure
npm install
```

### 2. AWS認証情報の設定

```bash
# AWS CLIで認証情報を設定
aws configure

# または環境変数で設定
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=ap-northeast-1
```

### 3. CDKのブートストラップ（初回のみ）

```bash
cd infrastructure
npx cdk bootstrap aws://<ACCOUNT_ID>/ap-northeast-1
```

### 4. スタックのデプロイ

```bash
cd infrastructure
npm run deploy
```

## GitHub Actionsでのデプロイ

### 手動実行

1. GitHubリポジトリのActionsタブを開く
2. "Deploy DynamoDB to AWS with CDK"ワークフローを選択
3. "Run workflow"をクリック
4. 環境を選択 (dev または staging)
5. "Run workflow"を実行

### 自動実行

以下の条件で自動的に実行されます：
- `main`ブランチに`infrastructure/**`または`.github/workflows/deploy-dev-to-aws.yml`の変更がpushされた時

## ワークフロー詳細

### ステップ

1. **Checkout code**: ソースコードをチェックアウト
2. **Setup Node.js**: Node.js環境をセットアップ
3. **Configure AWS credentials**: OIDCを使用してAWS認証情報を取得
4. **Install dependencies**: NPMパッケージをインストール
5. **Build CDK project**: TypeScriptコードをビルド
6. **CDK Synth**: CloudFormationテンプレートを生成
7. **CDK Deploy**: スタックをデプロイ

## CDK コマンド

### スタックの合成

CloudFormationテンプレートを生成します：

```bash
cd infrastructure
npm run synth
```

### デプロイ前の差分確認

```bash
cd infrastructure
npm run diff
```

### デプロイ

```bash
cd infrastructure
npm run deploy
```

### スタックの削除

```bash
cd infrastructure
npm run destroy
```

## テーブル設定の詳細

### 課金モード

**Pay-per-request (On-Demand)**を使用しています。

**メリット**:
- 使用量に応じた自動スケーリング
- キャパシティプランニング不要
- 予測不可能なワークロードに最適

### データ保護

1. **Point-in-Time Recovery (PITR)**
   - 過去35日間の任意の時点へのリストアが可能
   - データ損失のリスクを最小化

2. **暗号化**
   - AWS管理キー (AWS_MANAGED) による暗号化
   - 保存時および転送中のデータを保護

3. **削除保護**
   - `removalPolicy: RETAIN`により、スタック削除時もテーブルは保持

## トラブルシューティング

### CDK Deploy Failed

**原因**: CloudFormation権限不足

**解決方法**: IAMロールに適切な権限を付与

```bash
# エラーログを確認
aws cloudformation describe-stack-events --stack-name SpecKitDevStack
```

### DynamoDB Table Already Exists

**原因**: 同名のテーブルが既に存在

**解決方法**: 
1. テーブル名を変更
2. または既存テーブルを削除してから再デプロイ

### OIDC Authentication Failed

**原因**: Trust Policyの設定ミス

**解決方法**: 
1. リポジトリ名が正しいか確認
2. OIDCプロバイダーが正しく設定されているか確認

## コスト最適化

### DynamoDB料金

**On-Demand課金**:
- リクエスト単位の課金
- ストレージ: $0.25/GB/月 (ap-northeast-1)
- 読み取りリクエスト: $0.285/100万リクエスト
- 書き込みリクエスト: $1.4265/100万リクエスト

**コスト削減のヒント**:
1. 不要なデータの定期的な削除
2. GSIの適切な設計でスキャンを最小化
3. バッチ操作の活用

### 開発環境での節約

1. **テスト完了後のスタック削除**
   ```bash
   npm run destroy
   ```

2. **必要な時だけデプロイ**
   - 手動トリガーを活用
   - 自動デプロイの条件を制限

## セキュリティベストプラクティス

1. **最小権限の原則**
   - IAMロールには必要最小限の権限のみを付与

2. **暗号化の有効化**
   - データベースレベルの暗号化
   - 転送時の暗号化 (HTTPS)

3. **監査ログ**
   - CloudTrailでAPI呼び出しを記録
   - DynamoDB Streamsで変更を追跡

4. **アクセス制御**
   - VPCエンドポイントの使用を検討
   - IAMポリシーで細かいアクセス制御

## 参考資料

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS CDK TypeScript Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [GitHub OIDC - AWS連携](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
