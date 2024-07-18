function toggleSkipOptions() {
    const skipCheckbox = document.getElementById('skipUnits');
    const skipOptions = document.getElementById('skipOptions');

    if (skipCheckbox.checked) {
        skipOptions.style.display = 'block';
    } else {
        skipOptions.style.display = 'none';
    }
}

function toggleDailyTimeInputs() {
    const dailyTimeCheckbox = document.getElementById('watchTimeType');
    const dailyTimeInputs = document.getElementById('dailyTimeInputs');

    if (dailyTimeCheckbox.checked) {
        dailyTimeInputs.style.display = 'block';
    } else {
        dailyTimeInputs.style.display = 'none';
    }
}

document.getElementById('calculateBtn').addEventListener('click', function() {
    const episodes = parseInt(document.getElementById('episodes').value);
    const duration = parseInt(document.getElementById('duration').value);
    const skipSeconds = document.getElementById('skipSeconds').checked;
    const skipMinutes = document.getElementById('skipMinutes').checked;
    const skipHours = document.getElementById('skipHours').checked;
    const skipDays = document.getElementById('skipDays').checked;
    const skipWeeks = document.getElementById('skipWeeks').checked;
    const skipMonths = document.getElementById('skipMonths').checked;
    const calculateDailyTime = document.getElementById('watchTimeType').checked;
    const dailyHours = parseInt(document.getElementById('dailyHours').value) || 0;
    const dailyMinutes = parseInt(document.getElementById('dailyMinutes').value) || 0;

    let totalMinutes = episodes * duration;
    let totalSeconds = totalMinutes * 60;
    let totalHours = totalMinutes / 60;
    let totalDays = totalHours / 24;
    let totalWeeks = totalDays / 7;
    let totalMonths = totalDays / 30;

    let results = "";
    if (calculateDailyTime && (dailyHours > 0 || dailyMinutes > 0)) {
        let dailyLimit = (dailyHours * 60) + dailyMinutes;
        let totalDaysLimited = totalMinutes / dailyLimit;
        let totalWeeksLimited = totalDaysLimited / 7;
        let totalMonthsLimited = totalDaysLimited / 30;

        results += "<h2>With Daily Watch Time</h2>";
        results += `<p>Seconds: ${(totalDaysLimited * 24 * 60 * 60).toFixed(2)}</p>`;
        results += `<p>Minutes: ${(totalDaysLimited * 24 * 60).toFixed(2)}</p>`;
        results += `<p>Hours: ${(totalDaysLimited * 24).toFixed(2)}</p>`;
        if (!skipDays) results += `<p>Days: ${totalDaysLimited.toFixed(2)}</p>`;
        if (!skipWeeks) results += `<p>Weeks: ${totalWeeksLimited.toFixed(2)}</p>`;
        if (!skipMonths) results += `<p>Months: ${totalMonthsLimited.toFixed(2)}</p>`;
    } else {
        results += "<h2>Total Watch Time</h2>";
        if (!skipSeconds) results += `<p>Seconds: ${totalSeconds.toFixed(2)}</p>`;
        if (!skipMinutes) results += `<p>Minutes: ${totalMinutes.toFixed(2)}</p>`;
        if (!skipHours) results += `<p>Hours: ${totalHours.toFixed(2)}</p>`;
        if (!skipDays) results += `<p>Days: ${totalDays.toFixed(2)}</p>`;
        if (!skipWeeks) results += `<p>Weeks: ${totalWeeks.toFixed(2)}</p>`;
        if (!skipMonths) results += `<p>Months: ${totalMonths.toFixed(2)}</p>`;
    }

    document.getElementById('results').innerHTML = results;
});
