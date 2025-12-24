---
description: 自然言語の機能説明から機能仕様を作成または更新します。
handoffs: 
  - label: 技術計画を構築
    agent: speckit.plan
    prompt: 仕様の計画を作成します。私は以下で構築しています...
  - label: 仕様要件を明確化
    agent: speckit.clarify
    prompt: 仕様要件を明確化
    send: true
scripts:
  sh: scripts/bash/create-new-feature.sh --json "{ARGS}"
  ps: scripts/powershell/create-new-feature.ps1 -Json "{ARGS}"
---

## ユーザー入力

```text
$ARGUMENTS
```

空でない場合、続行する前にユーザー入力を **必ず** 考慮してください。

## 概要

トリガーメッセージで`/speckit.specify`の後にユーザーが入力したテキスト **が** 機能説明です。`{ARGS}`が文字通り下に表示されていても、この会話で常に利用可能であると仮定してください。空のコマンドを提供した場合を除き、ユーザーに繰り返しを求めないでください。

その機能説明を考慮して、これを行います：

1. **簡潔な短い名前を生成**（2-4語）ブランチ用：
   - 機能説明を分析し、最も意味のあるキーワードを抽出
   - 機能の本質を捉える2-4語の短い名前を作成
   - 可能な場合はアクション-名詞形式を使用（例："add-user-auth"、"fix-payment-bug"）
   - 技術用語と頭字語を保持（OAuth2、API、JWTなど）
   - 一目で機能を理解できるほど簡潔だが説明的に保つ
   - 例：
     - "ユーザー認証を追加したい" → "user-auth"
     - "APIのためのOAuth2統合を実装" → "oauth2-api-integration"
     - "分析用のダッシュボードを作成" → "analytics-dashboard"
     - "支払い処理タイムアウトのバグを修正" → "fix-payment-timeout"

2. **新しいブランチを作成する前に既存のブランチを確認**:

   a. まず、最新情報を確保するためにすべてのリモートブランチをフェッチ：

      ```bash
      git fetch --all --prune
      ```

   b. short-nameのすべてのソース全体で最も高い機能番号を見つける：
      - リモートブランチ: `git ls-remote --heads origin | grep -E 'refs/heads/[0-9]+-<short-name>$'`
      - ローカルブランチ: `git branch | grep -E '^[* ]*[0-9]+-<short-name>$'`
      - specsディレクトリ: `specs/[0-9]+-<short-name>`にマッチするディレクトリをチェック

   c. 次に利用可能な番号を決定：
      - 3つのソースすべてからすべての番号を抽出
      - 最も高い番号Nを見つける
      - 新しいブランチ番号にN+1を使用

   d. 計算された番号とshort-nameでスクリプト`{SCRIPT}`を実行：
      - 機能説明とともに`--number N+1`と`--short-name "your-short-name"`を渡す
      - Bashの例: `{SCRIPT} --json --number 5 --short-name "user-auth" "ユーザー認証を追加"`
      - PowerShellの例: `{SCRIPT} -Json -Number 5 -ShortName "user-auth" "ユーザー認証を追加"`

   **重要**:
   - 最も高い番号を見つけるために3つのソースすべて（リモートブランチ、ローカルブランチ、specsディレクトリ）をチェック
   - 正確なshort-nameパターンのブランチ/ディレクトリのみをマッチ
   - このshort-nameで既存のブランチ/ディレクトリが見つからない場合は、番号1から開始
   - 機能ごとにこのスクリプトを一度だけ実行する必要があります
   - JSONは出力としてターミナルで提供されます - 探している実際のコンテンツを取得するために常にそれを参照してください
   - JSON出力にはBRANCH_NAMEとSPEC_FILEパスが含まれます
   - 引数内のシングルクォート（例: "I'm Groot"）の場合、エスケープ構文を使用: 例 'I'\''m Groot' (または可能であれば二重引用符: "I'm Groot")

3. 必要なセクションを理解するために`templates/spec-template.md`を読み込みます。

4. この実行フローに従います：

    1. 入力からユーザー説明を解析
       空の場合: ERROR "機能説明が提供されていません"
    2. 説明から主要な概念を抽出
       識別: アクター、アクション、データ、制約
    3. 不明確な側面について：
       - コンテキストと業界標準に基づいて情報に基づいた推測を行う
       - 以下の場合のみ[NEEDS CLARIFICATION: 具体的な質問]でマーク：
         - 選択が機能スコープまたはユーザーエクスペリエンスに大きく影響する
         - 異なる意味を持つ複数の合理的な解釈が存在する
         - 合理的なデフォルトが存在しない
       - **制限: 最大3つの[NEEDS CLARIFICATION]マーカーの合計**
       - 影響による明確化の優先順位付け: スコープ > セキュリティ/プライバシー > ユーザーエクスペリエンス > 技術的詳細
    4. ユーザーシナリオとテストセクションを埋める
       明確なユーザーフローがない場合: ERROR "ユーザーシナリオを決定できません"
    5. 機能要件を生成
       各要件はテスト可能である必要があります
       未指定の詳細には合理的なデフォルトを使用（前提条件セクションに前提条件を文書化）
    6. 成功基準を定義
       測定可能で技術に依存しない結果を作成
       定量的メトリクス（時間、パフォーマンス、ボリューム）と定性的測定値（ユーザー満足度、タスク完了）の両方を含む
       各基準は実装の詳細なしで検証可能である必要があります
    7. 主要なエンティティを特定（データが関与する場合）
    8. 戻り値: SUCCESS（仕様は計画の準備ができています）

5. テンプレート構造を使用してSPEC_FILEに仕様を書き込み、セクションの順序と見出しを保持しながら、プレースホルダーを機能説明（引数）から派生した具体的な詳細で置き換えます。

6. **仕様品質検証**: 初期仕様を書いた後、品質基準に対して検証します：

   a. **仕様品質チェックリストを作成**: チェックリストテンプレート構造を使用して、これらの検証項目を含む`FEATURE_DIR/checklists/requirements.md`にチェックリストファイルを生成：

      ```markdown
      # 仕様品質チェックリスト: [FEATURE NAME]
      
      **目的**: 計画に進む前に仕様の完全性と品質を検証
      **作成日**: [DATE]
      **機能**: [spec.mdへのリンク]
      
      ## コンテンツ品質
      
      - [ ] 実装の詳細なし（言語、フレームワーク、API）
      - [ ] ユーザー価値とビジネスニーズに焦点を当てている
      - [ ] 非技術的な利害関係者向けに書かれている
      - [ ] すべての必須セクションが完了
      
      ## 要件の完全性
      
      - [ ] [NEEDS CLARIFICATION]マーカーが残っていない
      - [ ] 要件はテスト可能で曖昧さがない
      - [ ] 成功基準は測定可能
      - [ ] 成功基準は技術に依存しない（実装の詳細なし）
      - [ ] すべての受け入れシナリオが定義されている
      - [ ] エッジケースが識別されている
      - [ ] スコープが明確に境界付けられている
      - [ ] 依存関係と前提条件が識別されている
      
      ## 機能の準備
      
      - [ ] すべての機能要件に明確な受け入れ基準がある
      - [ ] ユーザーシナリオは主要なフローをカバー
      - [ ] 機能は成功基準で定義された測定可能な結果を満たす
      - [ ] 実装の詳細が仕様に漏れていない
      
      ## 注記
      
      - 不完全とマークされた項目は`/speckit.clarify`または`/speckit.plan`の前に仕様の更新が必要
      ```

   b. **検証チェックを実行**: 各チェックリスト項目に対して仕様をレビュー：
      - 各項目について、合格か不合格かを判断
      - 発見された具体的な問題を文書化（関連する仕様セクションを引用）

   c. **検証結果の処理**:

      - **If all items pass**: Mark checklist complete and proceed to step 6

      - **If items fail (excluding [NEEDS CLARIFICATION])**:
        1. List the failing items and specific issues
        2. Update the spec to address each issue
        3. Re-run validation until all items pass (max 3 iterations)
        4. If still failing after 3 iterations, document remaining issues in checklist notes and warn user

      - **If [NEEDS CLARIFICATION] markers remain**:
        1. Extract all [NEEDS CLARIFICATION: ...] markers from the spec
        2. **LIMIT CHECK**: If more than 3 markers exist, keep only the 3 most critical (by scope/security/UX impact) and make informed guesses for the rest
        3. For each clarification needed (max 3), present options to user in this format:

           ```markdown
           ## Question [N]: [Topic]
           
           **Context**: [Quote relevant spec section]
           
           **What we need to know**: [Specific question from NEEDS CLARIFICATION marker]
           
           **Suggested Answers**:
           
           | Option | Answer | Implications |
           |--------|--------|--------------|
           | A      | [First suggested answer] | [What this means for the feature] |
           | B      | [Second suggested answer] | [What this means for the feature] |
           | C      | [Third suggested answer] | [What this means for the feature] |
           | Custom | Provide your own answer | [Explain how to provide custom input] |
           
           **Your choice**: _[Wait for user response]_
           ```

        4. **CRITICAL - Table Formatting**: Ensure markdown tables are properly formatted:
           - Use consistent spacing with pipes aligned
           - Each cell should have spaces around content: `| Content |` not `|Content|`
           - Header separator must have at least 3 dashes: `|--------|`
           - Test that the table renders correctly in markdown preview
        5. Number questions sequentially (Q1, Q2, Q3 - max 3 total)
        6. Present all questions together before waiting for responses
        7. Wait for user to respond with their choices for all questions (e.g., "Q1: A, Q2: Custom - [details], Q3: B")
        8. Update the spec by replacing each [NEEDS CLARIFICATION] marker with the user's selected or provided answer
        9. Re-run validation after all clarifications are resolved

   d. **Update Checklist**: After each validation iteration, update the checklist file with current pass/fail status

7. ブランチ名、仕様ファイルパス、チェックリスト結果、および次のフェーズ（`/speckit.clarify`または`/speckit.plan`）の準備状況とともに完了を報告します。

**注記:** スクリプトは書き込む前に新しいブランチを作成してチェックアウトし、仕様ファイルを初期化します。

## 一般的なガイドライン

## クイックガイドライン

- ユーザーが必要とする**何を**と**なぜ**に焦点を当てる
- 実装方法を避ける（技術スタック、API、コード構造なし）
- 開発者ではなく、ビジネス利害関係者向けに書かれている
- 仕様に埋め込まれたチェックリストを作成しないでください。それは別のコマンドになります

### セクション要件

- **必須セクション**: すべての機能に対して完了する必要があります
- **オプションセクション**: 機能に関連する場合にのみ含める
- セクションが適用されない場合は、完全に削除します（"N/A"として残さない）

### AI生成用

ユーザープロンプトからこの仕様を作成する場合：

1. **情報に基づいた推測を行う**: ギャップを埋めるためにコンテキスト、業界標準、一般的なパターンを使用
2. **前提条件を文書化**: 前提条件セクションに合理的なデフォルトを記録
3. **明確化を制限**: 最大3つの[NEEDS CLARIFICATION]マーカー - 以下のような重要な決定にのみ使用：
   - 機能スコープまたはユーザーエクスペリエンスに大きく影響する
   - 異なる意味を持つ複数の合理的な解釈がある
   - 合理的なデフォルトが欠けている
4. **明確化の優先順位付け**: スコープ > セキュリティ/プライバシー > ユーザーエクスペリエンス > 技術的詳細
5. **テスターのように考える**: すべての曖昧な要件は"テスト可能で曖昧さがない"チェックリスト項目に失敗するべき
6. **明確化が必要な一般的な領域**（合理的なデフォルトが存在しない場合のみ）:
   - 機能スコープと境界（特定のユースケースを含む/除外する）
   - ユーザータイプと権限（複数の矛盾する解釈が可能な場合）
   - セキュリティ/コンプライアンス要件（法的/財政的に重要な場合）

**合理的なデフォルトの例**（これらについて尋ねないでください）:

- データ保持: ドメインの業界標準プラクティス
- パフォーマンス目標: 指定されない限り、標準的なweb/モバイルアプリの期待値
- エラー処理: 適切なフォールバックを伴うユーザーフレンドリーなメッセージ
- 認証方法: webアプリの標準セッションベースまたはOAuth2
- 統合パターン: 特に指定されない限りRESTful API

### 成功基準ガイドライン

成功基準は以下である必要があります：

1. **測定可能**: 特定のメトリクスを含む（時間、パーセンテージ、カウント、レート）
2. **技術に依存しない**: フレームワーク、言語、データベース、ツールの言及なし
3. **ユーザー中心**: システム内部ではなく、ユーザー/ビジネスの観点から結果を説明
4. **検証可能**: 実装の詳細を知らなくてもテスト/検証可能

**良い例**:

- "ユーザーは3分以内にチェックアウトを完了できる"
- "システムは10,000の同時ユーザーをサポート"
- "検索の95%が1秒以内に結果を返す"
- "タスク完了率が40%向上"

**悪い例**（実装に焦点を当てている）:

- "APIレスポンスタイムが200ms未満"（技術的すぎる、"ユーザーは即座に結果を見る"を使用）
- "データベースは1000 TPSを処理できる"（実装の詳細、ユーザー向けメトリクスを使用）
- "Reactコンポーネントが効率的にレンダリング"（フレームワーク固有）
- "Redisキャッシュヒット率が80%以上"（技術固有）
