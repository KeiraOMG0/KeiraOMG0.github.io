const player = {
    health: 100,
    maxHealth: 100,
    attack: 10,
    heal: 15,
    level: 1,
    exp: 0,
    gold: 0,
    potions: 0,
    nextLevelExp: 20,
    critChance: 0.05
};

const monster = {
    health: 100,
    maxHealth: 100,
    attack: 12
};

let monstersKilled = 0;

function updateStats() {
    document.getElementById('player-stats').innerText = `Player Health: ${player.health}`;
    document.getElementById('monster-stats').innerText = `Monster Health: ${monster.health}`;
    document.getElementById('player-level').innerText = `Level: ${player.level}`;
    document.getElementById('player-exp').innerText = `EXP: ${player.exp}/${player.nextLevelExp}`;
    document.getElementById('player-gold').innerText = `Gold: ${player.gold}`;
    document.getElementById('potions-count').innerText = `Potions: ${player.potions}`;
    document.getElementById('monster-counter').innerText = `Monsters Killed: ${monstersKilled}`;
}

function logMessage(message) {
    const log = document.getElementById('log');
    const p = document.createElement('p');
    p.innerText = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

function levelUp() {
    player.level++;
    player.exp = 0;
    player.nextLevelExp *= 2;
    player.maxHealth += 20;
    player.attack += 2;
    player.critChance += 0.01;
    player.health = player.maxHealth;
    logMessage(`You leveled up to level ${player.level}! Health and stats have been increased.`);
    resetMonster();
}

function gainExp(exp) {
    player.exp += exp;
    if (player.exp >= player.nextLevelExp) {
        levelUp();
    }
}

function attack() {
    let playerDamage = Math.floor(Math.random() * player.attack) + 1;
    let criticalHit = Math.random() < player.critChance;
    
    if (criticalHit) {
        playerDamage *= 2;
        logMessage(`Critical hit! You dealt ${playerDamage} damage to the monster.`);
    } else {
        logMessage(`You attacked the monster for ${playerDamage} damage.`);
    }

    monster.health -= playerDamage;
    
    if (monster.health <= 0) {
        logMessage('You defeated the monster!');
        player.gold += 10;
        monstersKilled++;
        gainExp(10);
        resetMonster();
        return;
    }

    const monsterDamage = Math.floor(Math.random() * monster.attack) + 1;
    player.health -= monsterDamage;
    logMessage(`The monster attacked you for ${monsterDamage} damage.`);
    
    if (player.health <= 0) {
        logMessage('You were defeated by the monster!');
        document.getElementById('attack').disabled = true;
        document.getElementById('heal').disabled = true;
        document.getElementById('revive').style.display = 'inline-block';
    }

    updateStats();
}

function heal() {
    if (player.potions > 0) {
        player.health += player.heal;
        if (player.health > player.maxHealth) {
            player.health = player.maxHealth;
        }
        player.potions--;
        logMessage(`You used a potion and healed yourself for ${player.heal} health.`);

        const monsterDamage = Math.floor(Math.random() * monster.attack) + 1;
        player.health -= monsterDamage;
        logMessage(`The monster attacked you for ${monsterDamage} damage.`);

        if (player.health <= 0) {
            logMessage('You were defeated by the monster!');
            document.getElementById('attack').disabled = true;
            document.getElementById('heal').disabled = true;
            document.getElementById('revive').style.display = 'inline-block';
        }

        updateStats();
    } else {
        logMessage('You have no potions left!');
    }
}

function buyPotion() {
    if (player.gold >= 10) {
        player.gold -= 10;
        player.potions++;
        logMessage('You bought a health potion.');
        updateStats();
    } else {
        logMessage('Not enough gold to buy a potion.');
    }
}

function upgradeAttack() {
    if (player.gold >= 10) {
        player.gold -= 10;
        player.attack += 5;
        logMessage('You upgraded your attack.');
        updateStats();
    } else {
        logMessage('Not enough gold to upgrade attack.');
    }
}

function upgradeHealth() {
    if (player.gold >= 10) {
        player.gold -= 10;
        player.maxHealth += 20;
        player.health = player.maxHealth;
        logMessage('You upgraded your health.');
        updateStats();
    } else {
        logMessage('Not enough gold to upgrade health.');
    }
}

function resetMonster() {
    // Increase monster attack by 20% to 60% with each level
    const attackMultiplier = 1 + (Math.random() * 0.4 + 0.2); // Random between 20% and 60%
    monster.attack = Math.floor(monster.attack * attackMultiplier);
    
    monster.maxHealth += player.level * 20;
    monster.health = monster.maxHealth;
    player.health = player.maxHealth;
    logMessage('A new monster appears!');
    updateStats();
}

function revive() {
    if (player.gold >= 20) {
        player.gold -= 20;
        player.health = player.maxHealth;
        document.getElementById('attack').disabled = false;
        document.getElementById('heal').disabled = false;
        document.getElementById('revive').style.display = 'none';
        logMessage('You have been revived!');
        updateStats();
    } else {
        logMessage('Not enough gold to revive.');
    }
}

function processCheatCode(code) {
    const [command, value] = code.split('=');
    switch (command) {
        case 'level':
            player.level = parseInt(value);
            player.exp = 0;
            player.nextLevelExp = 20 * Math.pow(2, player.level - 1);
            player.maxHealth = 100 + (player.level - 1) * 20;
            player.attack = 10 + (player.level - 1) * 2;
            player.health = player.maxHealth;
            logMessage(`Level set to ${player.level}. Stats updated.`);
            resetMonster();
            updateStats();
            break;
        case 'health':
            cheat.health(parseInt(value));
            break;
        case 'attack':
            cheat.attack(parseInt(value));
            break;
        case 'gold':
            cheat.gold(parseInt(value));
            break;
        default:
            logMessage('Unknown cheat code.');
            break;
    }
}

document.getElementById('attack').addEventListener('click', attack);
document.getElementById('heal').addEventListener('click', heal);
document.getElementById('buy-potion').addEventListener('click', buyPotion);
document.getElementById('upgrade-attack').addEventListener('click', upgradeAttack);
document.getElementById('upgrade-health').addEventListener('click', upgradeHealth);
document.getElementById('revive').addEventListener('click', revive);

document.getElementById('cheat-code-button').addEventListener('click', () => {
    const cheatCode = prompt('Enter cheat code:');
    processCheatCode(cheatCode);
});

// Expose cheat object to the global scope
const cheat = {
    health: (value) => {
        player.health = value;
        player.maxHealth = value;
        updateStats();
        logMessage(`Cheat activated: Health set to ${value}`);
    },
    attack: (value) => {
        player.attack = value;
        updateStats();
        logMessage(`Cheat activated: Attack set to ${value}`);
    },
    gold: (value) => {
        player.gold = value;
        updateStats();
        logMessage(`Cheat activated: Gold set to ${value}`);
    }
};

// Expose cheat object to the global scope
window.cheat = cheat;
