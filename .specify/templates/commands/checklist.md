---
description: ユーザー要件に基づいて、現在の機能のカスタムチェックリストを生成します。
scripts:
  sh: scripts/bash/check-prerequisites.sh --json
  ps: scripts/powershell/check-prerequisites.ps1 -Json
---

## チェックリストの目的: "英語のための単体テスト"

**重要な概念**: チェックリストは **要件記述のための単体テスト** です - 特定のドメインにおける要件の品質、明確性、完全性を検証します。

**検証/テスト用ではありません**:

- ❌ "ボタンが正しくクリックされることを確認"ではない
- ❌ "エラー処理が機能することをテスト"ではない
- ❌ "APIが200を返すことを確認"ではない
- ❌ コード/実装が仕様と一致するかのチェックではない

**要件品質検証用**:

- ✅ "すべてのカードタイプに対して視覚的階層要件が定義されていますか？"（完全性）
- ✅ "「目立つ表示」は特定のサイズ/配置で定量化されていますか？"（明確性）
- ✅ "ホバー状態の要件はすべての対話要素間で一貫していますか？"（一貫性）
- ✅ "キーボードナビゲーションのアクセシビリティ要件は定義されていますか？"（カバレッジ）
- ✅ "ロゴ画像の読み込みに失敗した場合に何が起こるかを仕様は定義していますか？"（エッジケース）

**メタファー**: 仕様が英語で書かれたコードである場合、チェックリストはその単体テストスイートです。実装が機能するかではなく、要件が適切に記述され、完全で、曖昧さがなく、実装の準備ができているかをテストしています。

## ユーザー入力

```text
$ARGUMENTS
```

空でない場合、続行する前にユーザー入力を **必ず** 考慮してください。

## 実行ステップ

1. **セットアップ**: リポジトリルートから`{SCRIPT}`を実行し、FEATURE_DIRとAVAILABLE_DOCSリストのJSONを解析。
   - すべてのファイルパスは絶対パスである必要があります。
   - 引数内のシングルクォート（例: "I'm Groot"）の場合、エスケープ構文を使用: 例 'I'\''m Groot' (または可能であれば二重引用符: "I'm Groot")

2. **意図の明確化（動的）**: spec/plan/tasksから抽出されたシグナルとユーザーの表現から、最大3つの初期コンテキスト明確化質問を導出（事前定義されたカタログなし）。以下を満たす必要があります：
   - `$ARGUMENTS`で既に明確な場合は個別にスキップ
   - チェックリストの内容を実質的に変更する情報についてのみ質問
   - 広範性よりも精度を優先

   Generation algorithm:
   1. Extract signals: feature domain keywords (e.g., auth, latency, UX, API), risk indicators ("critical", "must", "compliance"), stakeholder hints ("QA", "review", "security team"), and explicit deliverables ("a11y", "rollback", "contracts").
   2. Cluster signals into candidate focus areas (max 4) ranked by relevance.
   3. Identify probable audience & timing (author, reviewer, QA, release) if not explicit.
   4. Detect missing dimensions: scope breadth, depth/rigor, risk emphasis, exclusion boundaries, measurable acceptance criteria.
   5. Formulate questions chosen from these archetypes:
      - Scope refinement (e.g., "Should this include integration touchpoints with X and Y or stay limited to local module correctness?")
      - Risk prioritization (e.g., "Which of these potential risk areas should receive mandatory gating checks?")
      - Depth calibration (e.g., "Is this a lightweight pre-commit sanity list or a formal release gate?")
      - Audience framing (e.g., "Will this be used by the author only or peers during PR review?")
      - Boundary exclusion (e.g., "Should we explicitly exclude performance tuning items this round?")
      - Scenario class gap (e.g., "No recovery flows detected—are rollback / partial failure paths in scope?")

   Question formatting rules:
   - If presenting options, generate a compact table with columns: Option | Candidate | Why It Matters
   - Limit to A–E options maximum; omit table if a free-form answer is clearer
   - Never ask the user to restate what they already said
   - Avoid speculative categories (no hallucination). If uncertain, ask explicitly: "Confirm whether X belongs in scope."

   Defaults when interaction impossible:
   - Depth: Standard
   - Audience: Reviewer (PR) if code-related; Author otherwise
   - Focus: Top 2 relevance clusters

   Output the questions (label Q1/Q2/Q3). After answers: if ≥2 scenario classes (Alternate / Exception / Recovery / Non-Functional domain) remain unclear, you MAY ask up to TWO more targeted follow‑ups (Q4/Q5) with a one-line justification each (e.g., "Unresolved recovery path risk"). Do not exceed five total questions. Skip escalation if user explicitly declines more.

3. **ユーザーリクエストの理解**: `$ARGUMENTS` + 明確化回答を組み合わせる：
   - チェックリストのテーマを導出（例：セキュリティ、レビュー、デプロイ、UX）
   - ユーザーが言及した明示的な必須項目を統合
   - フォーカス選択をカテゴリの骨組みにマッピング
   - spec/plan/tasksから欠落したコンテキストを推測（幻覚しない）

4. **機能コンテキストの読み込み**: FEATURE_DIRから読み取り：
   - spec.md: 機能要件とスコープ
   - plan.md（存在する場合）: 技術詳細、依存関係
   - tasks.md（存在する場合）: 実装タスク

   **コンテキスト読み込み戦略**:
   - アクティブなフォーカスエリアに関連する必要な部分のみを読み込む（フルファイルダンプを避ける）
   - 長いセクションを簡潔なシナリオ/要件箇条書きに要約することを優先
   - 段階的な開示を使用：ギャップが検出された場合にのみ追加検索を追加
   - ソースドキュメントが大きい場合、生テキストを埋め込む代わりに中間サマリー項目を生成

5. **チェックリストの生成** - "要件のための単体テスト"を作成：
   - 存在しない場合は`FEATURE_DIR/checklists/`ディレクトリを作成
   - 一意のチェックリストファイル名を生成：
     - ドメインに基づいて短く説明的な名前を使用（例：`ux.md`、`api.md`、`security.md`）
     - フォーマット：`[domain].md`
     - ファイルが存在する場合は、既存のファイルに追加
   - 項目をCHK001から順次番号付け
   - 各`/speckit.checklist`実行で新しいファイルを作成（既存のチェックリストを上書きしない）

   **コア原則 - 実装ではなく要件をテスト**:
   すべてのチェックリスト項目は、要件自体を以下について評価する必要があります：
   - **完全性**: すべての必要な要件が存在していますか？
   - **明確性**: 要件は曖昧さがなく具体的ですか？
   - **一貫性**: 要件は互いに整合していますか？
   - **測定可能性**: 要件は客観的に検証できますか？
   - **カバレッジ**: すべてのシナリオ/エッジケースが対処されていますか？

   **カテゴリ構造** - 要件品質の次元ごとに項目をグループ化：
   - **要件の完全性**（すべての必要な要件が文書化されていますか？）
   - **要件の明確性**（要件は具体的で曖昧さがありませんか？）
   - **要件の一貫性**（要件は競合なく整合していますか？）
   - **受け入れ基準の品質**（成功基準は測定可能ですか？）
   - **シナリオカバレッジ**（すべてのフロー/ケースが対処されていますか？）
   - **エッジケースカバレッジ**（境界条件が定義されていますか？）
   - **非機能要件**（パフォーマンス、セキュリティ、アクセシビリティなど - 指定されていますか？）
   - **依存関係と前提条件**（文書化され検証されていますか？）
   - **曖昧さと競合**（何が明確化を必要としていますか？）

   **チェックリスト項目の書き方 - "英語のための単体テスト"**:

   ❌ **間違い**（実装のテスト）:
   - "ランディングページが3つのエピソードカードを表示することを確認"
   - "デスクトップでホバー状態が機能することをテスト"
   - "ロゴクリックがホームに移動することを確認"

   ✅ **正しい**（要件品質のテスト）:
   - "特集エピソードの正確な数とレイアウトが指定されていますか？"[完全性]
   - "「目立つ表示」は特定のサイズ/配置で定量化されていますか？"[明確性]
   - "ホバー状態の要件はすべての対話要素間で一貫していますか？"[一貫性]
   - "すべての対話UIに対してキーボードナビゲーション要件が定義されていますか？"[カバレッジ]
   - "ロゴ画像の読み込みに失敗した場合のフォールバック動作が指定されていますか？"[エッジケース]
   - "非同期エピソードデータの読み込み状態が定義されていますか？"[完全性]
   - "競合するUI要素の視覚的階層を仕様は定義していますか？"[明確性]

   **項目構造**:
   各項目は以下のパターンに従う必要があります：
   - 要件品質について問う質問形式
   - 仕様/計画に書かれている（または書かれていない）ものに焦点を当てる
   - 品質の次元を括弧内に含める[完全性/明確性/一貫性など]
   - 既存の要件をチェックする際は仕様セクションを参照`[Spec §X.Y]`
   - 欠落している要件をチェックする際は`[Gap]`マーカーを使用

   **EXAMPLES BY QUALITY DIMENSION**:

   Completeness:
   - "Are error handling requirements defined for all API failure modes? [Gap]"
   - "Are accessibility requirements specified for all interactive elements? [Completeness]"
   - "Are mobile breakpoint requirements defined for responsive layouts? [Gap]"

   Clarity:
   - "Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"
   - "Are 'related episodes' selection criteria explicitly defined? [Clarity, Spec §FR-5]"
   - "Is 'prominent' defined with measurable visual properties? [Ambiguity, Spec §FR-4]"

   Consistency:
   - "Do navigation requirements align across all pages? [Consistency, Spec §FR-10]"
   - "Are card component requirements consistent between landing and detail pages? [Consistency]"

   Coverage:
   - "Are requirements defined for zero-state scenarios (no episodes)? [Coverage, Edge Case]"
   - "Are concurrent user interaction scenarios addressed? [Coverage, Gap]"
   - "Are requirements specified for partial data loading failures? [Coverage, Exception Flow]"

   Measurability:
   - "Are visual hierarchy requirements measurable/testable? [Acceptance Criteria, Spec §FR-1]"
   - "Can 'balanced visual weight' be objectively verified? [Measurability, Spec §FR-2]"

   **Scenario Classification & Coverage** (Requirements Quality Focus):
   - Check if requirements exist for: Primary, Alternate, Exception/Error, Recovery, Non-Functional scenarios
   - For each scenario class, ask: "Are [scenario type] requirements complete, clear, and consistent?"
   - If scenario class missing: "Are [scenario type] requirements intentionally excluded or missing? [Gap]"
   - Include resilience/rollback when state mutation occurs: "Are rollback requirements defined for migration failures? [Gap]"

   **Traceability Requirements**:
   - MINIMUM: ≥80% of items MUST include at least one traceability reference
   - Each item should reference: spec section `[Spec §X.Y]`, or use markers: `[Gap]`, `[Ambiguity]`, `[Conflict]`, `[Assumption]`
   - If no ID system exists: "Is a requirement & acceptance criteria ID scheme established? [Traceability]"

   **Surface & Resolve Issues** (Requirements Quality Problems):
   Ask questions about the requirements themselves:
   - Ambiguities: "Is the term 'fast' quantified with specific metrics? [Ambiguity, Spec §NFR-1]"
   - Conflicts: "Do navigation requirements conflict between §FR-10 and §FR-10a? [Conflict]"
   - Assumptions: "Is the assumption of 'always available podcast API' validated? [Assumption]"
   - Dependencies: "Are external podcast API requirements documented? [Dependency, Gap]"
   - Missing definitions: "Is 'visual hierarchy' defined with measurable criteria? [Gap]"

   **Content Consolidation**:
   - Soft cap: If raw candidate items > 40, prioritize by risk/impact
   - Merge near-duplicates checking the same requirement aspect
   - If >5 low-impact edge cases, create one item: "Are edge cases X, Y, Z addressed in requirements? [Coverage]"

   **🚫 絶対禁止** - これらは要件テストではなく実装テストになります：
   - ❌ "確認"、"テスト"、"確定"、"チェック" + 実装動作で始まる項目
   - ❌ コードの実行、ユーザーアクション、システム動作への参照
   - ❌ "正しく表示される"、"適切に動作する"、"期待通りに機能する"
   - ❌ "クリック"、"ナビゲート"、"レンダリング"、"読み込み"、"実行"
   - ❌ テストケース、テスト計画、QA手順
   - ❌ 実装の詳細（フレームワーク、API、アルゴリズム）

   **✅ 必須パターン** - これらは要件品質をテストします：
   - ✅ "[シナリオ]について[要件タイプ]は定義/指定/文書化されていますか？"
   - ✅ "[曖昧な用語]は特定の基準で定量化/明確化されていますか？"
   - ✅ "[セクションA]と[セクションB]の間で要件は一貫していますか？"
   - ✅ "[要件]は客観的に測定/検証できますか？"
   - ✅ "[エッジケース/シナリオ]は要件で対処されていますか？"
   - ✅ "仕様は[欠落している側面]を定義していますか？"

6. **構造参照**: タイトル、メタセクション、カテゴリ見出し、およびIDフォーマットについて、`templates/checklist-template.md`の標準テンプレートに従ってチェックリストを生成します。テンプレートが利用できない場合は、以下を使用：H1タイトル、目的/作成日メタ行、`##`カテゴリセクション、`- [ ] CHK### <要件項目>`行、CHK001から始まるグローバルにインクリメントするID。

7. **レポート**: 作成されたチェックリストへのフルパス、項目数を出力し、各実行が新しいファイルを作成することをユーザーに通知します。要約：
   - 選択されたフォーカスエリア
   - 深さレベル
   - アクター/タイミング
   - 組み込まれたユーザー指定の明示的な必須項目

**Important**: Each `/speckit.checklist` command invocation creates a checklist file using short, descriptive names unless file already exists. This allows:

- 異なるタイプの複数のチェックリスト（例：`ux.md`、`test.md`、`security.md`）
- チェックリストの目的を示すシンプルで覚えやすいファイル名
- `checklists/`フォルダでの簡単な識別とナビゲーション

混乱を避けるために、説明的なタイプを使用し、完了したら不要なチェックリストをクリーンアップしてください。

## チェックリストタイプの例とサンプル項目

**UX要件品質:** `ux.md`

サンプル項目（実装ではなく要件のテスト）：

- "視覚的階層要件は測定可能な基準で定義されていますか？[明確性, Spec §FR-1]"
- "UI要素の数と配置が明示的に指定されていますか？[完全性, Spec §FR-1]"
- "対話状態要件（ホバー、フォーカス、アクティブ）は一貫して定義されていますか？[一貫性]"
- "すべての対話要素に対してアクセシビリティ要件が指定されていますか？[カバレッジ, Gap]"
- "画像の読み込みに失敗した場合のフォールバック動作が定義されていますか？[エッジケース, Gap]"
- "「目立つ表示」は客観的に測定できますか？[測定可能性, Spec §FR-4]"

**API要件品質:** `api.md`

サンプル項目：

- "すべての失敗シナリオに対してエラーレスポンス形式が指定されていますか？[完全性]"
- "レート制限要件は特定の閾値で定量化されていますか？[明確性]"
- "認証要件はすべてのエンドポイント間で一貫していますか？[一貫性]"
- "外部依存関係に対してリトライ/タイムアウト要件が定義されていますか？[カバレッジ, Gap]"
- "バージョニング戦略は要件に文書化されていますか？[Gap]"

**パフォーマンス要件品質:** `performance.md`

サンプル項目：

- "パフォーマンス要件は特定のメトリクスで定量化されていますか？[明確性]"
- "すべての重要なユーザージャーニーに対してパフォーマンス目標が定義されていますか？[カバレッジ]"
- "異なる負荷条件下でのパフォーマンス要件が指定されていますか？[完全性]"
- "パフォーマンス要件は客観的に測定できますか？[測定可能性]"
- "高負荷シナリオに対して劣化要件が定義されていますか？[エッジケース, Gap]"

**セキュリティ要件品質:** `security.md`

サンプル項目：

- "すべての保護されたリソースに対して認証要件が指定されていますか？[カバレッジ]"
- "機密情報に対してデータ保護要件が定義されていますか？[完全性]"
- "脅威モデルが文書化され、要件がそれに整合していますか？[トレーサビリティ]"
- "セキュリティ要件はコンプライアンス義務と一貫していますか？[一貫性]"
- "セキュリティ失敗/侵害対応要件が定義されていますか？[Gap, 例外フロー]"

## アンチパターン例：やってはいけないこと

**❌ 間違い - これらは実装ではなく要件をテストします:**

```markdown
- [ ] CHK001 - ランディングページが3つのエピソードカードを表示することを確認 [Spec §FR-001]
- [ ] CHK002 - デスクトップでホバー状態が正しく機能することをテスト [Spec §FR-003]
- [ ] CHK003 - ロゴクリックがホームページに移動することを確認 [Spec §FR-010]
- [ ] CHK004 - 関連エピソードセクションが3-5項目を表示することをチェック [Spec §FR-005]
```

**✅ 正しい - これらは要件品質をテストします:**

```markdown
- [ ] CHK001 - 特集エピソードの数とレイアウトが明示的に指定されていますか？[完全性, Spec §FR-001]
- [ ] CHK002 - ホバー状態の要件はすべての対話要素に対して一貫して定義されていますか？[一貫性, Spec §FR-003]
- [ ] CHK003 - すべてのクリック可能なブランド要素に対してナビゲーション要件は明確ですか？[明確性, Spec §FR-010]
- [ ] CHK004 - 関連エピソードの選択基準が文書化されていますか？[Gap, Spec §FR-005]
- [ ] CHK005 - 非同期エピソードデータの読み込み状態要件が定義されていますか？[Gap]
- [ ] CHK006 - "視覚的階層"要件は客観的に測定できますか？[測定可能性, Spec §FR-001]
```

**主な違い:**

- 間違い: システムが正しく動作するかをテスト
- 正しい: 要件が正しく書かれているかをテスト
- 間違い: 動作の確認
- 正しい: 要件品質の検証
- 間違い: "Xをするか？"
- 正しい: "Xが明確に指定されているか？"
