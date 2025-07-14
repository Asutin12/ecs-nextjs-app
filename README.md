# ECS Next.js Todo App

ECSハンズオン用のNext.jsアプリケーションです。PostgreSQL RDSと接続し、シンプルなTodo管理機能を提供します。

## 機能

- ✅ Todo の追加・削除・完了状態の切り替え
- 🗄️ PostgreSQL RDS との接続
- 🐳 Docker コンテナ対応
- 🔍 データベース接続状態の確認
- 📱 レスポンシブデザイン

## 技術スタック

- **Frontend**: Next.js 14 (App Router)
- **Database**: PostgreSQL (RDS)
- **Styling**: Tailwind CSS + shadcn/ui
- **Container**: Docker
- **Language**: TypeScript

## セットアップ

### 1. 環境変数の設定

`.env.sample` を `.env` にコピーして、RDSの接続情報を設定してください：

\`\`\`bash
cp .env.sample .env
\`\`\`

### 2. ローカル開発

\`\`\`bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev
\`\`\`

### 3. Docker でのビルドと実行

\`\`\`bash
# Docker イメージのビルド
docker build -t ecs-nextjs-app .

# コンテナの実行
docker run -p 3000:3000 --env-file .env ecs-nextjs-app
\`\`\`

## API エンドポイント

- `GET /api/health` - ヘルスチェック・DB接続確認
- `GET /api/todos` - Todo一覧取得
- `POST /api/todos` - Todo作成
- `PUT /api/todos/[id]` - Todo更新
- `DELETE /api/todos/[id]` - Todo削除

## ECS デプロイメント

1. ECR にイメージをプッシュ
2. ECS タスク定義で環境変数を設定
3. RDS セキュリティグループでECSからのアクセスを許可
4. ECS サービスを起動

## データベーススキーマ

\`\`\`sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

アプリケーション起動時に自動的にテーブルが作成されます。
