const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../sample.yaml');
const dest = path.join(__dirname, '../src/player.yaml');

if (fs.existsSync(dest)) {
    console.log('player.yaml は既に存在します。');
    process.exit(0);
}

fs.copyFile(src, dest, (err) => {
    if (err) {
        console.error('コピーに失敗しました:', err);
        process.exit(1);
    } else {
        console.log('player.yaml を sample.yaml から作成しました。');
    }
}); 