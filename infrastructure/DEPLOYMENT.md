# デプロイメント

## 自動デプロイ

1. `infrastructure/`配下のファイルを変更
2. PRを作成してレビュー
3. `main`ブランチにマージ
4. GitHub Actionsが自動的にデプロイを実行

## 手動デプロイ

1. GitHub Actionsタブを開く
2. "Deploy to AWS"ワークフローを選択
3. "Run workflow"をクリックして環境を選択
