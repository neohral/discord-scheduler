const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setupGoogleAuth() {
    console.log('Google Calendar API の認証設定を開始します...\n');

    // 1. Google Cloud Console でプロジェクトを作成し、Calendar API を有効化
    console.log('1. Google Cloud Console (https://console.cloud.google.com/) で以下を実行してください:');
    console.log('   - 新しいプロジェクトを作成');
    console.log('   - Google Calendar API を有効化');
    console.log('   - OAuth 2.0 クライアントIDを作成（デスクトップアプリケーション）\n');

    // 2. クライアントIDとシークレットを入力
    const clientId = await question('Google Cloud Console で取得したクライアントIDを入力してください: ');
    const clientSecret = await question('Google Cloud Console で取得したクライアントシークレットを入力してください: ');

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'http://localhost'
    );

    // 3. 認証URLを生成
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('\n2. 以下のURLにアクセスして認証を完了してください:');
    console.log(authUrl);
    console.log('\n認証後、表示されるコードをコピーしてください。\n');

    // 4. 認証コードを入力
    const code = await question('認証コードを入力してください: ');

    try {
        // 5. トークンを取得
        const { tokens } = await oauth2Client.getToken(code);

        console.log('\n✅ 認証が完了しました！\n');
        console.log('以下の情報を .env ファイルに設定してください:\n');
        console.log(`GOOGLE_CLIENT_ID=${clientId}`);
        console.log(`GOOGLE_CLIENT_SECRET=${clientSecret}`);
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log('\nまた、Google Calendar のIDも設定してください:');
        console.log('通常は "primary" またはメールアドレス形式です。\n');

        // 6. カレンダーIDを確認
        oauth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        try {
            const calendarList = await calendar.calendarList.list();
            console.log('利用可能なカレンダー:');
            calendarList.data.items.forEach(cal => {
                console.log(`- ${cal.summary} (ID: ${cal.id})`);
            });
        } catch (error) {
            console.log('カレンダーリストの取得に失敗しました:', error.message);
        }

    } catch (error) {
        console.error('❌ 認証に失敗しました:', error.message);
    }

    rl.close();
}

function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

setupGoogleAuth().catch(console.error); 