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

function updateStats() {
    document.getElementById('player-stats').innerText = `Player Health: ${player.health}`;
    document.getElementById('monster-stats').innerText = `Monster Health: ${monster.health}`;
    document.getElementById('player-level').innerText = `Level: ${player.level}`;
    document.getElementById('player-exp').innerText = `EXP: ${player.exp}/${player.nextLevelExp}`;
    document.getElementById('player-gold').innerText = `Gold: ${player.gold}`;
    document.getElementById('potions-count').innerText = `Potions: ${player.potions}`;
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
    monster.maxHealth += player.level * 20;
    monster.health = monster.maxHealth;
    player.health = player.maxHealth;
    logMessage('A new monster appears!');
    updateStats();
}

function revive() {
    player.health = 30;
    logMessage('You revived with 30 health!');
    document.getElementById('attack').disabled = false;
    document.getElementById('heal').disabled = false;
    document.getElementById('revive').style.display = 'none';
    updateStats();
}

function processCheatCode(code) {
    const [command, value] = code.split('=');
    const numericValue = parseInt(value);
    
    if (command === 'health') {
        player.health = numericValue;
        player.maxHealth = numericValue;
        logMessage(`Cheat activated: Health set to ${numericValue}`);
    } else if (command === 'attack') {
        player.attack = numericValue;
        logMessage(`Cheat activated: Attack set to ${numericValue}`);
    } else if (command === 'gold') {
        player.gold = numericValue;
        logMessage(`Cheat activated: Gold set to ${numericValue}`);
    } else {
        logMessage('Invalid cheat code.');
    }
    updateStats();
}

document.getElementById('attack').addEventListener('click', attack);
document.getElementById('heal').addEventListener('click', heal);
document.getElementById('buy-potion').addEventListener('click', buyPotion);
document.getElementById('upgrade-attack').addEventListener('click', upgradeAttack);
document.getElementById('upgrade-health').addEventListener('click', upgradeHealth);
document.getElementById('revive').addEventListener('click', revive);

document.getElementById('cheat-code-button').addEventListener('click', () => {
    const code = prompt('Enter cheat code (e.g., health=500, attack=50, gold=1000):');
    if (code) {
        processCheatCode(code);
    }
});

updateStats();
logMessage('A wild monster appears!');

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
