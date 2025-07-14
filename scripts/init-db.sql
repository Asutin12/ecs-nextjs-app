-- PostgreSQL RDS用の初期化スクリプト
-- このスクリプトはアプリケーション起動時に自動実行されますが、
-- 手動でRDSに接続して実行することも可能です

-- データベースの作成（RDSでは事前に作成済みの想定）
-- CREATE DATABASE todoapp;

-- テーブルの作成
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- サンプルデータの挿入（オプション）
INSERT INTO todos (title, completed) VALUES 
    ('ECSクラスターの作成', false),
    ('タスク定義の設定', false),
    ('サービスの起動', false),
    ('ロードバランサーの設定', false)
ON CONFLICT DO NOTHING;

-- 権限の確認（必要に応じて）
-- GRANT ALL PRIVILEGES ON TABLE todos TO your_db_user;
-- GRANT USAGE, SELECT ON SEQUENCE todos_id_seq TO your_db_user;
