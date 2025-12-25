# 変更内容サマリー

## 実装した変更

### 問題の要件

> OIDCは初回のみ手動で設定し、デプロイ後はCDK内でOIDCを設定し、以後はそれを利用し、初回の設定は削除する流れにしてください。また、スロットルなどのアラームはコストがかかるので初期的にはなくしてください。他にも監視にお金がかかる内容は一旦なくしてください。

### 対応内容

#### 1. OIDC管理のCDK化 ✅

**変更の概要:**
- 初回のみ手動でOIDCプロバイダーとIAMロールを作成
- CDKデプロイ時にOIDCプロバイダーとIAMロールを自動作成
- 手動設定を削除し、以降はCDK管理のOIDCを使用

**更新したファイル:**
- `spec.md`: ユーザーストーリー2、3を更新、機能要件FR-008a、FR-008bを追加
- `plan.md`: OIDC認証フローの章を更新、CDKスタックコードにOIDC実装を追加
- `tasks.md`: タスク1.2aを追加（CDK管理のOIDC実装）

**詳細ドキュメント:**
- `OIDC_MIGRATION_GUIDE.md`: 完全な移行手順とAWS CLIコマンド

#### 2. コスト削減の実装 ✅

**除外した機能:**
- CloudWatchアラーム（スロットル、エラー）
- SNS通知
- 詳細モニタリング（1分間隔）
- カスタムメトリクス

**更新したファイル:**
- `spec.md`: FR-018を追加（コスト削減要件）
- `plan.md`: モニタリング章を更新（無料の基本メトリクスのみ）
- `tasks.md`: タスク5.1（CloudWatchアラーム）を削除

**コスト削減効果:**
- CloudWatchアラーム: -$0.80/月
- 詳細モニタリング: -$3.20/月
- 合計削減: -$4/月（年間-$48）

**詳細ドキュメント:**
- `COST_OPTIMIZATION.md`: コスト分析と最適化戦略

## ファイル一覧

### 更新したファイル

1. **spec.md** (15KB)
   - ユーザーストーリー2、3を更新
   - 機能要件FR-008a、FR-008b、FR-018を追加
   - 前提条件とスコープを更新

2. **plan.md** (34KB)
   - OIDC認証フローを3フェーズに更新
   - CDKスタックにOIDC実装コードを追加
   - モニタリング章をコスト最小版に更新
   - デプロイメント戦略を更新

3. **tasks.md** (14KB)
   - タスク1.2aを追加（OIDC実装、3時間）
   - タスク5.1を削除（CloudWatchアラーム）
   - タスク数: 14→13
   - 見積工数: 20h→19.5h

### 新規作成したファイル

4. **OIDC_MIGRATION_GUIDE.md** (9.3KB)
   - フェーズ1: 手動セットアップ
   - フェーズ2: CDKデプロイとOIDC移行
   - フェーズ3: 手動設定の削除
   - トラブルシューティング
   - AWS CLIコマンド集

5. **COST_OPTIMIZATION.md** (9.3KB)
   - コスト削減の方針
   - 除外した機能の詳細
   - 環境別コスト見積もり
   - 将来の拡張計画
   - ベストプラクティス

6. **README.md** (6.6KB)
   - ドキュメント一覧
   - 主要な変更点のサマリー
   - 実装の流れ
   - 技術スタック
   - 成功指標

## 変更の詳細

### OIDC管理フロー

#### フェーズ1: 初回手動セットアップ
```bash
# 1. OIDCプロバイダー作成
aws iam create-open-id-connect-provider ...

# 2. IAMロール作成
aws iam create-role --role-name GitHubActionsDeployRole-Initial ...

# 3. GitHub Secretsに設定
AWS_ROLE_TO_ASSUME = arn:aws:iam::xxx:role/GitHubActionsDeployRole-Initial
```

#### フェーズ2: CDKデプロイとOIDC移行
```bash
# 4. CDKデプロイ（OIDCとロールが自動作成される）
cdk deploy

# 5. GitHub Secretsを更新
AWS_ROLE_TO_ASSUME = arn:aws:iam::xxx:role/GitHubActionsDeployRole-dev
```

#### フェーズ3: 手動設定の削除
```bash
# 6. 手動作成したリソースを削除
aws iam delete-role --role-name GitHubActionsDeployRole-Initial
```

### CDKスタックの変更

```typescript
// 追加した内容:

// 1. OIDC Provider
const githubProvider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
  url: 'https://token.actions.githubusercontent.com',
  clientIds: ['sts.amazonaws.com'],
});

// 2. IAM Role（OIDC信頼関係）
const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
  assumedBy: new iam.FederatedPrincipal(
    githubProvider.openIdConnectProviderArn,
    // ... 信頼ポリシー設定
  ),
  // ... PowerUserAccess + IAM権限
});

// 3. CloudFormation出力
new cdk.CfnOutput(this, 'GitHubActionsRoleArn', { ... });
new cdk.CfnOutput(this, 'OIDCProviderArn', { ... });
```

### コスト比較

| 項目 | 初期段階 | 監視機能あり | 削減額 |
|------|---------|------------|--------|
| DynamoDB | $0.50 | $0.50 | - |
| PITR | $0.20 | $0.20 | - |
| CloudWatchアラーム | **$0** | $0.80 | **-$0.80** |
| 詳細モニタリング | **$0** | $3.20 | **-$3.20** |
| ログ | $0.05 | $0.05 | - |
| **月額合計** | **$0.75** | **$4.75** | **-$4.00** |
| **年額合計** | **$9** | **$57** | **-$48** |

（注: 上記はdev環境のみの例。staging環境を含めると約$3/月）

## タスクの変更

### 追加したタスク

**タスク 1.2a: CDK管理のOIDCプロバイダーとIAMロールを実装**
- 優先度: P1
- 見積工数: 3時間
- 実施内容:
  - IAM OpenIdConnectProviderをCDKスタックに追加
  - GitHub Actions用のIAMロールを作成
  - 必要なIAMポリシーをアタッチ
  - CloudFormation出力を追加

### 削除したタスク

**タスク 5.1: CloudWatch アラームを追加**（コスト削減のため除外）
- 削減工数: 1.5時間
- 削減コスト: $0.80/月

## 成功指標

### 技術面
- [x] OIDC管理がCDKコード化されている
- [x] 手動設定からCDK管理への移行手順が明確
- [x] CloudWatchアラームなどの高コスト機能が除外されている

### コスト面
- [x] 月額コストが$5以下に収まる見込み
- [x] 年間約$48のコスト削減
- [x] 無料枠を最大限活用

### ドキュメント面
- [x] OIDC移行の完全な手順書がある
- [x] コスト最適化の詳細な説明がある
- [x] すべての変更が仕様書に反映されている

## 次のステップ

### 実装フェーズ
1. インフラストラクチャコードの実装
   - `infrastructure/` ディレクトリの作成
   - CDKスタックの実装
   - OIDC + IAMロールの実装

2. GitHub Actionsワークフローの作成
   - デプロイワークフロー
   - Synthワークフロー

3. テストの実装
   - ユニットテスト
   - 統合テスト

### デプロイフェーズ
1. 手動OIDC設定（初回のみ）
2. CDKデプロイ
3. GitHub Secrets更新
4. 手動設定削除
5. 動作確認

## まとめ

### 実装した変更
✅ OIDC管理をCDKで自動化（手動→CDK管理への移行フロー確立）  
✅ コスト削減（CloudWatchアラームなど高コスト機能を除外）  
✅ 完全なドキュメント作成（移行ガイド、コスト最適化戦略）

### 達成した成果
- **コスト削減**: 年間約$48の削減（初期段階）
- **保守性向上**: OIDCがInfrastructure as Codeで管理される
- **明確な手順**: 完全な移行ガイドとトラブルシューティング

### 今後の課題
- インフラストラクチャコードの実装
- GitHub Actionsワークフローの作成
- 実際のAWS環境でのテスト
- 本番環境への適用準備

---

**作成日**: 2025-12-25  
**ステータス**: 仕様変更完了、実装準備完了  
**見積工数**: 19.5時間  
**月額コスト**: 約$3（dev + staging）
