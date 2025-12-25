# OIDC設定の移行ガイド

## 概要

このドキュメントは、手動で設定したOIDCプロバイダーとIAMロールから、CDK管理のOIDC設定への移行手順を説明します。

## 移行の流れ

### フェーズ1: 初回セットアップ（ブートストラップ）

初回のみ、AWSリソースをデプロイするために必要な最小限の権限を持つOIDCプロバイダーとIAMロールを作成します。

**推奨方法: CloudFormationテンプレートを使用**

#### 1.1 CloudFormationテンプレートでのセットアップ（推奨）

CloudFormationテンプレート `bootstrap-oidc.yaml` を使用することで、手動コマンドなしで簡単にセットアップできます。

**方法1: AWSコンソールからデプロイ**

1. AWSマネジメントコンソールにログイン
2. CloudFormationサービスを開く
3. 「スタックの作成」→「新しいリソースを使用（標準）」を選択
4. テンプレートファイル `bootstrap-oidc.yaml` をアップロード
5. スタック名を入力（例: `spec-kit-github-oidc-bootstrap`）
6. パラメータを確認（必要に応じて変更）:
   - `GitHubOrg`: goataka（デフォルト）
   - `GitHubRepo`: spec-kit-with-coding-agent（デフォルト）
   - `RoleName`: GitHubActionsDeployRole-Initial（デフォルト）
7. IAMリソース作成の確認にチェックを入れる
8. スタックを作成

**方法2: AWS CLIからデプロイ**

```bash
# CloudFormationスタックを作成
aws cloudformation create-stack \
  --stack-name spec-kit-github-oidc-bootstrap \
  --template-body file://bootstrap-oidc.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
    ParameterKey=GitHubOrg,ParameterValue=goataka \
    ParameterKey=GitHubRepo,ParameterValue=spec-kit-with-coding-agent \
    ParameterKey=RoleName,ParameterValue=GitHubActionsDeployRole-Initial

# デプロイ完了を待機
aws cloudformation wait stack-create-complete \
  --stack-name spec-kit-github-oidc-bootstrap

# 出力値を確認
aws cloudformation describe-stacks \
  --stack-name spec-kit-github-oidc-bootstrap \
  --query 'Stacks[0].Outputs' \
  --output table
```

**出力例:**
```
--------------------------------------------------------------------
|                        DescribeStacks                            |
+----------------------+-------------------------------------------+
| Description          | Value                                     |
+----------------------+-------------------------------------------+
| OIDCProviderArn      | arn:aws:iam::123456789012:oidc-provider/...|
| RoleArn              | arn:aws:iam::123456789012:role/GitHubActi...|
| RoleName             | GitHubActionsDeployRole-Initial           |
| GitHubSecretValue    | arn:aws:iam::123456789012:role/GitHubActi...|
+----------------------+-------------------------------------------+
```

#### 1.2 代替方法: AWS CLIでの手動セットアップ

CloudFormationが使用できない場合は、以下のAWS CLIコマンドで手動セットアップも可能です。

<details>
<summary>手動セットアップ手順（クリックして展開）</summary>

**OIDCプロバイダーの作成:**

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

**IAMロールの作成:**

Trust Policy（trust-policy.json）:
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

```bash
# ロール作成
aws iam create-role \
  --role-name GitHubActionsDeployRole-Initial \
  --assume-role-policy-document file://trust-policy.json \
  --description "Initial role for GitHub Actions to bootstrap CDK"

# PowerUserAccessポリシーをアタッチ
aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole-Initial \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# IAM権限を追加
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

</details>

#### 1.3 GitHub Secretsの設定

CloudFormation出力の `GitHubSecretValue` または `RoleArn` の値を使用して、GitHub Secretsを設定します。

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定:

- **Name**: `AWS_ROLE_TO_ASSUME`
- **Value**: CloudFormationスタックの出力値 `GitHubSecretValue`（例: `arn:aws:iam::123456789012:role/GitHubActionsDeployRole-Initial`）

**AWS CLIで値を取得:**
```bash
aws cloudformation describe-stacks \
  --stack-name spec-kit-github-oidc-bootstrap \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubSecretValue`].OutputValue' \
  --output text
```

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

### フェーズ3: ブートストラップリソースの削除

CDK管理のOIDCが正常に動作することを確認したら、初回ブートストラップ用のCloudFormationスタックを削除します。

#### 3.1 CloudFormationスタックの削除（推奨）

CloudFormationで作成した場合は、スタックを削除するだけで全てのリソースが自動的に削除されます。

**方法1: AWSコンソールから削除**

1. CloudFormationコンソールを開く
2. `spec-kit-github-oidc-bootstrap` スタックを選択
3. 「削除」をクリック
4. 削除を確認

**方法2: AWS CLIから削除**

```bash
# スタックを削除
aws cloudformation delete-stack \
  --stack-name spec-kit-github-oidc-bootstrap

# 削除完了を待機
aws cloudformation wait stack-delete-complete \
  --stack-name spec-kit-github-oidc-bootstrap
```

#### 3.2 代替方法: 手動削除（CloudFormation未使用の場合のみ）

手動でAWS CLIで作成した場合は、以下のコマンドで削除します。

<details>
<summary>手動削除手順（クリックして展開）</summary>

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

# OIDCプロバイダーを削除（手動作成した場合のみ）
# 注意: CDK管理のOIDCプロバイダーは削除しないこと
aws iam delete-open-id-connect-provider \
  --open-id-connect-provider-arn <手動作成したOIDC ARN>
```

</details>

#### 3.3 最終確認

```bash
# ブートストラップリソースが削除されたことを確認
aws iam get-role --role-name GitHubActionsDeployRole-Initial 2>&1
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
