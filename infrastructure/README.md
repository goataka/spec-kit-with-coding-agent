# AWS CDK Infrastructure

このディレクトリには、spec-kit開発環境のAWSインフラストラクチャ定義が含まれています。

## 概要

AWS CDKを使用してDynamoDB clockテーブルをデプロイします。

## 構成

### DynamoDBテーブル

**Clock Table** (`spec-kit-dev-clock`)
- Partition Key: `userId` (String)
- Sort Key: `timestamp` (String)
- GSI: `DateIndex` - 日付による検索用
- 課金モード: On-Demand (PAY_PER_REQUEST)
- Point-in-Time Recovery有効
- AWS管理の暗号化

## セットアップ

### 前提条件

- Node.js 20以上
- AWS CLI設定済み
- AWS認証情報設定済み

### インストール

```bash
cd infrastructure
npm install
```

## 使用方法

### スタックの合成

```bash
npm run synth
```

### デプロイ

```bash
npm run deploy
```

### 差分確認

```bash
npm run diff
```

### スタックの削除

```bash
npm run destroy
```

## GitHub Actions統合

`.github/workflows/deploy-dev-to-aws.yml`でCI/CDパイプラインが定義されています。

### ワークフローの実行

1. 手動実行: GitHub ActionsのUIから実行
2. 自動実行: `main`ブランチへのpush時に自動実行

### 必要なGitHub Secrets

- `AWS_ROLE_TO_ASSUME`: デプロイ用のIAMロールARN

## 開発

### ビルド

```bash
npm run build
```

### ウォッチモード

```bash
npm run watch
```

## スタック構成

- スタック名: `SpecKitDevStack`
- リージョン: `ap-northeast-1` (東京)
- タグ:
  - Environment: development
  - Project: spec-kit-attendance

## 出力

デプロイ後、以下の値が出力されます：

- `ClockTableName`: 打刻テーブル名
- `ClockTableArn`: 打刻テーブルARN

## 参考資料

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS CDK TypeScript Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
