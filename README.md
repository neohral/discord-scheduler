# Discord Scheduler

Google カレンダーの予定を Discord に自動通知するシステムです。

## 機能

- **月曜日の朝 0 時**: 今週の予定を一覧で通知
- **火曜〜日曜の朝 0 時**: 今週の予定を確認（新しい予定があれば通知）
- GitHub Actions を使用した自動実行
- 日本語対応の通知メッセージ
- Discord Webhook を使用した簡単設定
- 通知するアイコンと名前のガチャ要素

## アーキテクチャ

このプロジェクトは以下のアーキテクチャで設計されています：

```
src/
├── config.js                 # 設定管理
├── scheduler.js              # メインスケジューラー
├── index.js                  # ローカル実行エントリーポイント
├── utils/
│   ├── dateUtils.js          # 日付処理ユーティリティ
│   └── index.js
└── services/
    ├── PlayerService.js      # プレイヤー管理
    ├── GoogleCalendarService.js  # Google Calendar API
    ├── DiscordService.js     # Discord通知
    └── index.js
```

### 設計原則

- **単一責任の原則**: 各クラスは 1 つの責任のみを持つ
- **依存性注入**: サービス間の依存関係を明確化
- **設定の集中管理**: 環境変数とアプリケーション設定を分離
- **エラーハンドリング**: 適切なエラー処理とログ出力

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <your-repository-url>
cd discord-scheduler
npm install
```

### 2. Discord Webhook の作成

1. Discord サーバーで通知を送信したいチャンネルを右クリック
2. "編集" → "統合機能" を選択
3. "ウェブフック" をクリック
4. "新しいウェブフック" をクリック
5. ウェブフック名を入力（例: "カレンダー通知"）
6. "ウェブフック URL をコピー" をクリック（これが `DISCORD_WEBHOOK_URL` になります）

### 3. Google Calendar API の設定

#### 方法 1: 自動セットアップスクリプトを使用

```bash
node scripts/setup-google-auth.js
```

スクリプトの指示に従って設定を完了してください。

#### 方法 2: 手動設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. "API とサービス" → "ライブラリ" で "Google Calendar API" を有効化
4. "認証情報" → "認証情報を作成" → "OAuth 2.0 クライアント ID"
5. アプリケーションの種類で "デスクトップアプリケーション" を選択
6. クライアント ID とクライアントシークレットを取得
7. [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) でリフレッシュトークンを取得

### 4. 環境変数の設定

`.env` ファイルを作成し、以下の内容を設定：

```env
# Discord Webhook URL
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Google Calendar API
GOOGLE_CALENDAR_ID=your_calendar_id_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here
```

### 5. GitHub Secrets の設定

GitHub リポジトリの "Settings" → "Secrets and variables" → "Actions" で以下のシークレットを設定：

- `DISCORD_WEBHOOK_URL`: Discord Webhook の URL
- `GOOGLE_CALENDAR_ID`: Google カレンダーの ID
- `GOOGLE_CLIENT_ID`: Google API のクライアント ID
- `GOOGLE_CLIENT_SECRET`: Google API のクライアントシークレット
- `GOOGLE_REFRESH_TOKEN`: Google API のリフレッシュトークン

### 6. GitHub variables の設定

GitHub リポジトリの "Settings" → "Secrets and variables" → "Actions" で以下の variables を設定：

- `PLAYER_YAML_CONTENT`: sample.yaml の内容

## 使用方法

### ローカルでの実行

```bash
# 開発モード（継続実行）
npm run dev

# 本番モード
npm start
```

### GitHub Actions での自動実行

リポジトリをプッシュすると、GitHub Actions が自動的にスケジュールされます：

- **JST の毎日 0 時**: 今週の予定を一覧で通知（月曜日）または新しい予定を確認（火曜〜日曜）

手動実行も可能です：

1. GitHub リポジトリの "Actions" タブを開く
2. "Discord Scheduler" ワークフローを選択
3. "Run workflow" をクリック

## テスト

```bash
# テストの実行
npm test

# テストカバレッジの確認
npm run test:coverage
```

## Webhook vs Bot の比較

| 項目         | Webhook    | Bot        |
| ------------ | ---------- | ---------- |
| 設定の簡単さ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| 機能の豊富さ | ⭐⭐       | ⭐⭐⭐⭐⭐ |
| 権限管理     | ⭐⭐       | ⭐⭐⭐⭐⭐ |
| セキュリティ | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ |

**Webhook の利点:**

- 設定が簡単（URL をコピーするだけ）
- Bot を作成する必要がない
- 軽量で高速

**Webhook の制限:**

- 読み取り専用（メッセージを送信するだけ）
- ユーザーインタラクションができない
- 権限管理が限定的

## ファイル構成

```
discord-scheduler/
├── src/
│   ├── config.js              # 設定管理
│   ├── scheduler.js            # メインスケジューラー
│   ├── index.js                # ローカル実行用
│   ├── utils/
│   │   ├── dateUtils.js        # 日付処理ユーティリティ
│   │   └── index.js
│   └── services/
│       ├── PlayerService.js    # プレイヤー管理
│       ├── GoogleCalendarService.js  # Google Calendar API
│       ├── DiscordService.js   # Discord通知
│       └── index.js
├── tests/
│   └── scheduler.test.js       # テストファイル
├── scripts/
│   └── setup-google-auth.js    # Google API 認証セットアップ
├── .github/workflows/
│   └── scheduler.yml           # GitHub Actions ワークフロー
├── package.json
└── README.md
```

## トラブルシューティング

### よくある問題

1. **Discord Webhook がメッセージを送信できない**

   - Webhook URL が正しいか確認
   - Webhook が削除されていないか確認
   - チャンネルの権限設定を確認

2. **Google Calendar API でエラーが発生**

   - リフレッシュトークンが有効か確認
   - カレンダー ID が正しいか確認
   - API が有効化されているか確認

3. **GitHub Actions が実行されない**
   - Secrets が正しく設定されているか確認
   - ワークフローファイルの構文が正しいか確認

## ライセンス

MIT License
