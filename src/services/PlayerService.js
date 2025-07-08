const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../config');

class PlayerService {
    constructor() {
        this.players = this.loadPlayers();
    }

    loadPlayers() {
        try {
            const fileContents = fs.readFileSync(config.app.playerConfigPath, 'utf8');
            const data = yaml.load(fileContents);
            return data;
        } catch (error) {
            console.error('Error loading player.yaml:', error);
            return [config.app.defaultPlayer];
        }
    }

    getRandomPlayer() {
        const randomPlayer = this.players[Math.floor(Math.random() * this.players.length)];
        const selectedIcon = this.selectRandomIcon(randomPlayer.iconList);

        return {
            name: `${randomPlayer.name}${selectedIcon.rarity}`,
            avatar: selectedIcon.url
        };
    }

    selectRandomIcon(iconList) {
        // parentの値に基づいて確率を計算
        const nonZeroWeights = iconList.filter(icon => icon.parent > 0);
        const totalNonZeroWeight = nonZeroWeights.reduce((sum, icon) => sum + icon.parent, 0);

        // parent: 0のアイコンに残りの確率を割り当て
        const remainingWeight = Math.max(0, 100 - totalNonZeroWeight);

        // 重み付きリストを作成
        const weightedIcons = iconList.map(icon => ({
            ...icon,
            weight: icon.parent === 0 ? remainingWeight : icon.parent
        }));

        const totalWeight = weightedIcons.reduce((sum, icon) => sum + icon.weight, 0);

        let randomValue = Math.random() * totalWeight;
        let selectedIcon = weightedIcons[0]; // デフォルト

        for (const icon of weightedIcons) {
            if (randomValue <= icon.weight) {
                selectedIcon = icon;
                break;
            }
            randomValue -= icon.weight;
        }

        return selectedIcon;
    }
}

module.exports = PlayerService; 