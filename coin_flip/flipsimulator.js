function flipCoin() {
    return Math.random() < 0.5 ? 'heads' : 'tails';
}

function simulateStreakInARow(targetStreak, targetSide) {
    return new Promise((resolve) => {
        let streak = 0;
        let attempts = 0;

        function runSimulation() {
            while (streak < targetStreak) {
                if (flipCoin() === targetSide) {
                    streak += 1;
                } else {
                    streak = 0;
                }
                attempts += 1;

                if (streak < targetStreak) {
                    setTimeout(runSimulation, 0);
                    return;
                }
            }
            resolve(attempts);
        }
        runSimulation();
    });
}

async function startSimulation() {
    const targetSide = document.getElementById('side').value;
    const targetStreak = parseInt(document.getElementById('streak').value);
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = '';
    loader.style.display = 'block';

    const attempts = await simulateStreakInARow(targetStreak, targetSide);

    loader.style.display = 'none';
    const theoreticalOdds = 1 / Math.pow(2, targetStreak);

    resultDiv.innerHTML = `
        <p>It took ${attempts} attempts to get ${targetStreak} ${targetSide} in a row.</p>
        <p>The theoretical odds of getting ${targetStreak} ${targetSide} in a row are 1 in ${Math.pow(2, targetStreak)} (${theoreticalOdds.toFixed(8)}).</p>
    `;
}
