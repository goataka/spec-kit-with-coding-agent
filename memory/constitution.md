# Project Constitution: 勤怠管理システム (Attendance Management System)

**Version**: 1.0.0  
**Ratified**: 2025-12-24  
**Last Amended**: 2025-12-24

## Purpose

このプロジェクトは、spec-kitを使用した仕様駆動開発により、勤怠管理システムを構築します。
This project aims to build an attendance management system using spec-driven development with spec-kit.

## Language Policy

**PRIMARY LANGUAGE**: 日本語 (Japanese)
**SECONDARY LANGUAGE**: English (for code, technical documentation, and international collaboration)

### Language Guidelines

1. **Specifications (仕様書)**: MUST be written primarily in Japanese
   - User stories and scenarios: Japanese
   - Requirements and acceptance criteria: Japanese
   - Comments and explanations: Japanese

2. **Code**: MUST follow English conventions
   - Variable names, function names, class names: English
   - Code comments: English preferred, Japanese acceptable for complex business logic
   - Commit messages: English

3. **Technical Documentation**: Bilingual when possible
   - Architecture documents: Japanese with English summaries
   - API documentation: English with Japanese descriptions
   - Setup/deployment guides: Bilingual

4. **Communication**: 
   - Team discussions: Japanese
   - Issue tracking: Japanese titles, English technical details acceptable
   - Pull request descriptions: Japanese

## Core Principles

### Principle 1: 仕様駆動開発 (Specification-Driven Development)

**Rule**: すべての機能実装は、事前に承認された仕様書から開始すること。
All feature implementations MUST begin with a pre-approved specification.

**Rationale**: 仕様書を先に作成することで、開発の方向性を明確にし、手戻りを最小限に抑える。
By creating specifications first, we clarify development direction and minimize rework.

### Principle 2: 段階的な実装 (Incremental Implementation)

**Rule**: 機能は独立してテスト可能な単位で実装すること。
Features MUST be implemented in independently testable units.

**Rationale**: 各機能を独立して開発・テスト・デプロイできることで、リスクを軽減し、フィードバックサイクルを短縮する。
Independent development, testing, and deployment of each feature reduces risk and shortens feedback cycles.

### Principle 3: ドキュメントファースト (Documentation-First)

**Rule**: コードを書く前に、必ずドキュメントを作成すること。
Documentation MUST be created before writing code.

- 仕様書 (Specification): ユーザーシナリオと要件
- 計画書 (Plan): 技術的なアプローチとアーキテクチャ
- タスク (Tasks): 実装可能な作業項目

**Rationale**: ドキュメントを先に作成することで、設計の質が向上し、チーム全体の理解が深まる。
Creating documentation first improves design quality and deepens team understanding.

### Principle 4: テスト可能性 (Testability)

**Rule**: すべての機能は自動テスト可能な形で実装すること。
All features MUST be implemented in an automatically testable form.

**Rationale**: 自動テストにより、品質を保ちながら開発速度を維持できる。
Automated testing maintains development speed while ensuring quality.

### Principle 5: シンプルさの追求 (Pursuit of Simplicity)

**Rule**: 必要最小限の複雑さで実装すること。
Implement with minimum necessary complexity.

**Rationale**: シンプルなシステムは理解しやすく、保守しやすい。
Simple systems are easier to understand and maintain.

## Governance

### Amendment Procedure

1. 憲法の変更提案は、プロジェクトメンバーの誰でも行える
2. 変更は、チームの過半数の承認が必要
3. 重大な変更（メジャーバージョン）は、全員の合意が必要

Amendment proposals can be made by any project member.
Changes require majority approval from the team.
Major changes require unanimous agreement.

### Versioning Policy

- **MAJOR**: 後方互換性のない原則の削除または再定義
- **MINOR**: 新しい原則の追加または既存原則の大幅な拡張
- **PATCH**: 明確化、表現の改善、タイポ修正

### Compliance Review

- 各スプリント終了時に憲法への準拠を確認
- 違反が見つかった場合は、次のスプリントで是正

Review compliance at the end of each sprint.
Address violations in the next sprint if found.

## Tools and Workflow

### Development Environment / 開発環境

**DevContainerの使用を推奨 / Use of DevContainer (Recommended)**

このプロジェクトでは、開発環境のセットアップにDevContainerを使用します。
This project uses DevContainer for development environment setup.

**理由 / Rationale**:
- 一貫した開発環境の提供 / Provides consistent development environment
- 自動セットアップの簡素化 / Simplifies automatic setup
- ローカル開発とCopilot Agentの両方で同じ環境を使用 / Same environment for both local dev and Copilot Agent
- 将来の依存関係追加が容易 / Easy to add future dependencies

**設定ファイル / Configuration Files**:
- `.devcontainer/devcontainer.json` - DevContainer設定
- `.github/workflows/copilot-setup-steps.yml` - DevContainer設定を参照

**新しいツールや依存関係の追加 / Adding New Tools or Dependencies**:

将来、新しいセットアップ要件が発生した場合、以下の手順で追加すること：
When new setup requirements arise in the future, add them as follows:

1. `.devcontainer/devcontainer.json` の `postCreateCommand` または `features` を更新
   Update `postCreateCommand` or `features` in `.devcontainer/devcontainer.json`

2. `.github/workflows/copilot-setup-steps.yml` も必要に応じて更新
   Update `.github/workflows/copilot-setup-steps.yml` if needed

3. この憲法を更新し、追加理由を記録
   Update this constitution and document the reason for addition

### Spec-Kit Usage

このプロジェクトでは、GitHub Copilot Coding Agent経由でspec-kitを使用します。
This project uses spec-kit through GitHub Copilot Coding Agent.

**Workflow Commands**:
- `/constitution`: プロジェクト憲法の作成・更新
- `/specify`: 機能仕様の作成
- `/plan`: 技術計画の作成
- `/tasks`: 実装タスクの作成
- `/implement`: タスクの実装

### Documentation Structure

```
.devcontainer/      # DevContainer設定
  devcontainer.json # 開発環境定義
  README.md         # DevContainer使用ガイド
.github/
  workflows/
    copilot-setup-steps.yml  # Copilot Agent自動セットアップ
.specify/           # spec-kit設定とテンプレート
  templates/        # ドキュメントテンプレート
  commands/         # ワークフローコマンド定義
memory/            # プロジェクト記憶と憲法
specs/             # 機能仕様書（ブランチごと）
docs/              # 確定した仕様と実装ドキュメント
```

### Future Migration

将来的にローカル環境（CLI/VSCode）への切り替えを考慮し、確定した仕様は実装時に`docs/`フォルダに保存すること。
For future migration to local environments (CLI/VSCode), save finalized specifications in the `docs/` folder during implementation.

## Project Scope

### Initial Scope

このプロジェクトは勤怠管理システムを構築しますが、初期セットアップではspec-kitの最小限の構成のみを行います。
This project will build an attendance management system, but the initial setup includes only minimal spec-kit configuration.

### Target System Features (Future)

- 出退勤記録 (Clock in/out recording)
- 休暇申請と承認 (Leave request and approval)
- 勤怠データの集計とレポート (Attendance data aggregation and reporting)
- ユーザー管理 (User management)

These features will be specified and implemented in future iterations following the spec-driven development workflow.
