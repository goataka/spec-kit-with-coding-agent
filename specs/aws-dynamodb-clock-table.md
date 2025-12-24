# AWS DynamoDB Clock Table Deployment Specification

**Version**: 1.0.0  
**Created**: 2025-12-24  
**Status**: Draft

## Overview

勤怠管理システムの打刻機能のために、AWS DynamoDBテーブルをAWS CDKを使用してデプロイする。

## User Stories

### US-1: システム管理者としてのテーブル作成
**As a** システム管理者  
**I want to** AWS CDKを使用してDynamoDBの打刻テーブルを自動的にデプロイできる  
**So that** インフラストラクチャをコードとして管理し、再現可能な環境を構築できる

**Acceptance Criteria**:
- [ ] CDKスタックが正常にデプロイされる
- [ ] DynamoDBテーブル "clock" が作成される
- [ ] テーブルはOn-demand課金モードで作成される
- [ ] Point-in-time recoveryが有効化される
- [ ] AWS管理の暗号化が設定される

### US-2: システム管理者としてのCI/CD統合
**As a** システム管理者  
**I want to** GitHub Actionsで自動的にCDKデプロイが実行される  
**So that** インフラストラクチャの変更を安全に本番環境に適用できる

**Acceptance Criteria**:
- [ ] GitHub ActionsワークフローがCDKデプロイを実行する
- [ ] OIDCを使用した安全なAWS認証が設定される
- [ ] デプロイ前にCloudFormation変更セットがレビューされる
- [ ] デプロイ結果がワークフローログに記録される

### US-3: 開発者としてのテーブル設計の理解
**As a** アプリケーション開発者  
**I want to** 打刻テーブルのスキーマとクエリパターンを理解する  
**So that** 効率的にデータを読み書きできる

**Acceptance Criteria**:
- [ ] テーブルのPartition KeyとSort Keyが明確に定義される
- [ ] 想定されるクエリパターンが文書化される
- [ ] 属性の例が提供される

## Requirements

### Functional Requirements

#### FR-1: DynamoDBテーブル "clock"
テーブルは以下の仕様で作成される：

**テーブル名**: `spec-kit-dev-clock`

**キー構造**:
- **Partition Key**: `userId` (String) - ユーザーID
- **Sort Key**: `timestamp` (String) - タイムスタンプ (ISO 8601形式)

**属性例**:
```json
{
  "userId": "user-001",
  "timestamp": "2025-12-24T09:00:00Z",
  "type": "clock-in",
  "location": "Tokyo Office",
  "deviceId": "device-123"
}
```

**設定**:
- 課金モード: On-Demand (PAY_PER_REQUEST)
- Point-in-time Recovery: 有効
- 暗号化: AWS管理キー
- 削除ポリシー: RETAIN（誤削除防止）

**Global Secondary Index**:
- **DateIndex**:
  - Partition Key: `date` (String) - 日付 (YYYY-MM-DD形式)
  - Sort Key: `timestamp` (String) - タイムスタンプ
  - 用途: 特定日の全打刻記録を効率的に取得

#### FR-2: CDKスタック構成
AWS CDKを使用したInfrastructure as Code：

- スタック名: `SpecKitDevStack`
- リージョン: `ap-northeast-1` (東京)
- TypeScriptで実装
- CloudFormation出力にテーブル名とARNを含める

#### FR-3: GitHub Actions CI/CD
自動デプロイワークフロー：

- トリガー: 手動実行、または`infrastructure/**`の変更
- Node.js 20環境
- OIDC認証でAWS接続
- CDK synth → deploy フロー
- デプロイ承認モード: `broadening`

### Non-Functional Requirements

#### NFR-1: セキュリティ
- OIDC使用でAWS認証情報をGitHubに保存しない
- DynamoDBテーブルは暗号化必須
- IAM最小権限の原則

#### NFR-2: 可用性
- Point-in-time Recovery有効化
- RETAIN削除ポリシーでデータ保護

#### NFR-3: コスト効率
- On-Demand課金で使用量に応じた課金
- 不要なリソースは作成しない

#### NFR-4: 保守性
- Infrastructure as Code (CDK)
- TypeScriptの型安全性
- 明確なドキュメント

## Technical Design

### Architecture

```
GitHub Actions
    ↓
  [CDK Build & Synth]
    ↓
  [CDK Deploy]
    ↓
AWS CloudFormation
    ↓
Amazon DynamoDB
  - Clock Table
```

### Data Model

#### Clock Table Schema

| Attribute    | Type   | Key Type     | Description                    |
|-------------|--------|--------------|--------------------------------|
| userId      | String | Partition Key| ユーザーID                      |
| timestamp   | String | Sort Key     | タイムスタンプ (ISO 8601)       |
| date        | String | GSI PK       | 日付 (YYYY-MM-DD)              |
| type        | String | -            | clock-in / clock-out           |
| location    | String | -            | 打刻場所                        |
| deviceId    | String | -            | デバイスID                      |

#### Query Patterns

1. **ユーザーごとの打刻履歴取得**
   - Partition Key: `userId`
   - Sort Key: `timestamp` (範囲指定可能)

2. **特定日の全打刻記録取得**
   - GSI: DateIndex
   - Partition Key: `date`
   - Sort Key: `timestamp`

### CDK Stack Structure

```typescript
SpecKitDevStack
  └─ DynamoDB Table: clock
      ├─ Keys: userId (PK), timestamp (SK)
      ├─ GSI: DateIndex (date, timestamp)
      ├─ On-Demand Billing
      ├─ PITR Enabled
      ├─ Encryption: AWS_MANAGED
      └─ RemovalPolicy: RETAIN
```

## Implementation Plan

### Phase 1: CDK Infrastructure Setup
1. プロジェクト構造作成 (`infrastructure/`)
2. CDKスタック実装 (clock テーブルのみ)
3. TypeScript設定とビルド
4. ローカルでCDK synthテスト

### Phase 2: GitHub Actions Integration
1. ワークフローファイル作成
2. OIDC認証設定
3. CDKデプロイステップ追加
4. エラーハンドリングとログ出力

### Phase 3: Documentation
1. セットアップガイド作成
2. テーブル設計ドキュメント
3. デプロイ手順書
4. トラブルシューティングガイド

### Phase 4: Validation
1. CDKビルドとsynth検証
2. ワークフローの動作確認
3. ドキュメントレビュー

## Testing Strategy

### Unit Tests
- CDKスタックのsynthesisテスト
- テーブル設定の検証

### Integration Tests
- CDK deployの実行確認
- テーブル作成の確認
- CloudFormation出力の確認

### Manual Tests
- GitHub Actionsワークフローの手動実行
- AWS ConsoleでのDynamoDBテーブル確認
- 簡単なデータ書き込み・読み取りテスト

## Dependencies

### External Dependencies
- AWS Account with DynamoDB access
- GitHub repository with Actions enabled
- Node.js 20+
- AWS CDK CLI

### Internal Dependencies
- なし（このPRは独立したインフラストラクチャ構築）

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AWS認証失敗 | High | OIDC設定ガイドを提供、エラーメッセージの改善 |
| CloudFormation失敗 | Medium | 事前にsynth検証、approval機能の使用 |
| コスト超過 | Low | On-Demand課金、不要なリソース削除の推奨 |
| データ損失 | High | RETAIN削除ポリシー、PITR有効化 |

## Success Metrics

- [ ] CDKスタックが正常にデプロイされる
- [ ] DynamoDB clockテーブルが期待通りの設定で作成される
- [ ] GitHub Actionsワークフローが成功する
- [ ] ドキュメントが完全で理解しやすい
- [ ] セキュリティスキャンでアラートゼロ

## Out of Scope

以下は今回のスコープに**含まれない**：

- 休暇申請テーブル（削除）
- アプリケーションコード
- API Gateway / Lambda統合
- データマイグレーション
- 本番環境のセットアップ

## Appendix

### References
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [GitHub OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

### Glossary
- **OIDC**: OpenID Connect - 安全な認証プロトコル
- **PITR**: Point-in-Time Recovery - データベースのバックアップ機能
- **GSI**: Global Secondary Index - 代替クエリパターン用のインデックス
- **CDK**: Cloud Development Kit - Infrastructure as Codeツール
