# 初回セットアップ

## ステップ1: OIDCプロバイダーとIAMロールの作成

初回のみ、CloudFormationを使用してOIDCプロバイダーとIAMロールを手動で作成します。

1. AWSコンソールでCloudFormationサービスを開く
2. 新しいスタックを作成
3. `setup-oidc-temporarily.yaml`テンプレートをアップロード
4. スタックを作成
5. OutputsタブからロールARNをコピー

## ステップ2: GitHub Secretsの設定

1. GitHubリポジトリのSettings > Secrets and variables > Actionsを開く
2. `AWS_ROLE_TO_ASSUME`に取得したロールARNを設定

## ステップ3: CDKデプロイ

1. GitHub Actionsタブを開く
2. "Deploy to AWS"ワークフローを実行
3. 環境として"dev"を選択

このデプロイでCDK管理のOIDCプロバイダーとIAMロールが作成されます。

## ステップ4: GitHub Secretsの更新

1. デプロイ完了後、CloudFormationコンソールで`AttendanceKit-Dev-Stack`のOutputsを確認
2. `GitHubActionsRoleArn`の値をコピー
3. GitHub Secretsの`AWS_ROLE_TO_ASSUME`を新しいARNに更新

## ステップ5: 初回CloudFormationスタックの削除

1. CloudFormationコンソールで初回に作成したスタックを選択
2. "削除"をクリック

以降はCDK管理のOIDCとIAMロールが使用されます。
