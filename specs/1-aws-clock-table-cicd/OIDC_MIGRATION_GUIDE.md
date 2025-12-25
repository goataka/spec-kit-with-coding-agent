# OIDC設定の移行ガイド

## 概要

このドキュメントは、手動で設定したOIDCプロバイダーとIAMロールから、CDK管理のOIDC設定への移行手順を説明します。

## 移行の流れ

### フェーズ1: 初回手動セットアップ（ブートストラップ）

初回のみ、AWSリソースをデプロイするために必要な最小限の権限を持つOIDCプロバイダーとIAMロールを手動で作成します。

#### 1.1 OIDCプロバイダーの作成

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

**出力例:**
```json
{
    "OpenIDConnectProviderArn": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
}
```

#### 1.2 IAMロールの作成

**Trust Policy (trust-policy.json):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:goataka/spec-kit-with-coding-agent:*"
        }
      }
    }
  ]
}
```

**ロール作成コマンド:**
```bash
# Trust Policyでロールを作成
aws iam create-role \
  --role-name GitHubActionsDeployRole-Initial \
  --assume-role-policy-document file://trust-policy.json \
  --description "Initial role for GitHub Actions to bootstrap CDK"

# PowerUserAccessポリシーをアタッチ
aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole-Initial \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# IAM権限を追加（CDKがOIDCとロールを管理できるようにする）
cat > iam-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "iam:CreateOpenIDConnectProvider",
        "iam:DeleteOpenIDConnectProvider",
        "iam:GetOpenIDConnectProvider",
        "iam:TagOpenIDConnectProvider",
        "iam:UpdateOpenIDConnectProviderThumbprint"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name GitHubActionsDeployRole-Initial \
  --policy-name CDKIAMPermissions \
  --policy-document file://iam-policy.json
```

#### 1.3 GitHub Secretsの設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定:

- **Name**: `AWS_ROLE_TO_ASSUME`
- **Value**: `arn:aws:iam::123456789012:role/GitHubActionsDeployRole-Initial`

### フェーズ2: CDKデプロイとOIDC管理の移行

#### 2.1 初回CDKデプロイ

GitHub Actionsワークフローを手動実行してCDKスタックをデプロイします。このデプロイで、CDK管理のOIDCプロバイダーとIAMロールが作成されます。

```bash
# GitHub Actions UI から deploy-dev-to-aws.yml を手動実行
# または、infrastructure/配下のコードをmainブランチにマージ
```

#### 2.2 CloudFormation出力の確認

デプロイ完了後、CloudFormation出力から新しいロールARNを取得します。

```bash
aws cloudformation describe-stacks \
  --stack-name SpecKit-Dev-Stack \
  --query 'Stacks[0].Outputs' \
  --output table
```

**出力例:**
```
---------------------------------------------------------------
|                      DescribeStacks                         |
+-------------------+---------------------------------------+
| Description       | Value                                 |
+-------------------+---------------------------------------+
| TableName         | spec-kit-dev-clock                    |
| TableArn          | arn:aws:dynamodb:...                  |
| GitHubActionsRoleArn | arn:aws:iam::123456789012:role/GitHubActionsDeployRole-dev |
| OIDCProviderArn   | arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com |
+-------------------+---------------------------------------+
```

#### 2.3 GitHub Secretsの更新

`AWS_ROLE_TO_ASSUME` をCDK管理のロールARNに更新します。

- **Name**: `AWS_ROLE_TO_ASSUME`
- **Value**: `arn:aws:iam::123456789012:role/GitHubActionsDeployRole-dev`

#### 2.4 動作確認

再度デプロイワークフローを実行し、CDK管理のOIDCで認証できることを確認します。

```bash
# GitHub Actions UI から deploy-dev-to-aws.yml を手動実行
# ワークフローが成功すれば、CDK管理のOIDCが正常に動作している
```

### フェーズ3: 手動設定の削除

CDK管理のOIDCが正常に動作することを確認したら、手動で作成したリソースを削除します。

#### 3.1 手動作成したIAMロールの削除

```bash
# アタッチされたポリシーを確認
aws iam list-attached-role-policies \
  --role-name GitHubActionsDeployRole-Initial

# 管理ポリシーをデタッチ
aws iam detach-role-policy \
  --role-name GitHubActionsDeployRole-Initial \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# インラインポリシーを削除
aws iam delete-role-policy \
  --role-name GitHubActionsDeployRole-Initial \
  --policy-name CDKIAMPermissions

# ロールを削除
aws iam delete-role \
  --role-name GitHubActionsDeployRole-Initial
```

#### 3.2 手動作成したOIDCプロバイダーの削除

**重要**: CDK管理のOIDCプロバイダーが存在することを確認してから実行してください。

```bash
# CDK管理のOIDCプロバイダーが存在することを確認
aws iam get-open-id-connect-provider \
  --open-id-connect-provider-arn <CDK管理のOIDC ARN>

# 確認できたら、手動作成したOIDCプロバイダーを削除
# 注意: 手動作成時のARNを使用してください（CDK管理版ではない）
aws iam delete-open-id-connect-provider \
  --open-id-connect-provider-arn <手動作成したOIDC ARN>
```

**注意**: 
- 同じURLのOIDCプロバイダーは1つのAWSアカウントに1つしか作成できません
- 手動作成版とCDK管理版は同じARNになるため、実際には手動作成版をCDKでインポートする形になります
- CloudFormationがOIDCプロバイダーを管理するようになるため、手動削除は不要な場合があります

#### 3.3 最終確認

```bash
# 手動作成したリソースが削除されたことを確認
aws iam get-role --role-name GitHubActionsDeployRole-Initial
# エラー: NoSuchEntity が表示されればOK

# CDK管理のリソースが正常に存在することを確認
aws iam get-role --role-name GitHubActionsDeployRole-dev
# ロール情報が表示されればOK

# デプロイワークフローを再度実行して動作確認
# GitHub Actions UI から deploy-dev-to-aws.yml を手動実行
```

## トラブルシューティング

### Q1: CDKデプロイ時に "OpenIdConnectProvider already exists" エラーが発生する

**原因**: 同じURLのOIDCプロバイダーが既に存在します。

**対処**: 
```bash
# 既存のOIDCプロバイダーをCDKでインポート
# または、CDKコードで既存のOIDCプロバイダーを参照する
```

### Q2: GitHub Actionsワークフローが "Access Denied" エラーになる

**原因**: `AWS_ROLE_TO_ASSUME` の値が正しくない、またはロールの権限が不足しています。

**対処**:
```bash
# CloudFormation出力からロールARNを再確認
aws cloudformation describe-stacks \
  --stack-name SpecKit-Dev-Stack \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleArn`].OutputValue' \
  --output text

# GitHub Secretsを更新
```

### Q3: 手動作成したリソースを削除できない

**原因**: リソースがまだ使用されている、または依存関係があります。

**対処**:
```bash
# ロールにアタッチされたポリシーを確認
aws iam list-attached-role-policies --role-name <ロール名>
aws iam list-role-policies --role-name <ロール名>

# すべてのポリシーをデタッチ/削除してからロールを削除
```

## まとめ

この移行により、以下のメリットが得られます：

1. **インフラストラクチャとしてのコード管理**: OIDCとIAMロールがCDKで管理され、再現可能
2. **保守性の向上**: 設定変更がコードレビューの対象になり、バージョン管理される
3. **環境の一貫性**: dev、staging、productionで同じCDKコードを使用できる
4. **ドリフト検出**: CloudFormationがリソースの変更を検出し、管理できる

## 参考資料

- [AWS CDK IAM Module Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam-readme.html)
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS IAM OIDC Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
