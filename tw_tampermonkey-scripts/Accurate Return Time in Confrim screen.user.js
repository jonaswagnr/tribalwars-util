// ==UserScript==
// @name         Accurate Return Time in Confrim screen
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Adds an accurately calculated return time row to Tribal Wars attack confirmation page
// @match        https://*.die-staemme.de/game.php?*screen=place&try=confirm*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function parseTimeString(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function formatDate(date) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === now.toDateString()) {
            return 'heute um ' + date.toTimeString().split(' ')[0];
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'morgen um ' + date.toTimeString().split(' ')[0];
        } else {
            return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
                   ' um ' + date.toTimeString().split(' ')[0];
        }
    }

    function findRowByContent(content) {
        const rows = document.querySelectorAll('table.vis tr');
        for (let row of rows) {
            const firstCell = row.querySelector('td:first-child, th:first-child');
            if (firstCell && firstCell.textContent.trim().includes(content)) {
                return row;
            }
        }
        return null;
    }

    function analyzeAndAddReturnTime() {
        console.log("Script is running - Analyzing page structure");

        const arrivalRow = findRowByContent('Ankunft');
        const durationRow = findRowByContent('Dauer');

        if (!arrivalRow || !durationRow) {
            console.log("Could not find arrival or duration row");
            return;
        }

        const arrivalCell = arrivalRow.querySelector('td:last-child, th:last-child');
        const durationCell = durationRow.querySelector('td:last-child, th:last-child');

        if (!arrivalCell || !durationCell) {
            console.log("Could not find arrival or duration cell");
            return;
        }

        console.log("Arrival cell content:", arrivalCell.textContent);
        console.log("Duration cell content:", durationCell.textContent);

        // Create new row for return time
        const newRow = arrivalRow.parentNode.insertRow(arrivalRow.rowIndex + 1);
        newRow.innerHTML = `
            <td>Rückkehr:</td>
            <td id="date_backtime">
                <span class="relative_time">Calculating...</span>
            </td>
        `;

        console.log("Added new row for return time");

        // Set up real-time updates
        setupRealTimeUpdates(arrivalCell, durationCell, newRow.querySelector('#date_backtime .relative_time'));
    }

    function setupRealTimeUpdates(arrivalCell, durationCell, returnTimeSpan) {
        const arrivalTimeSpan = arrivalCell.querySelector('.relative_time');
        const durationSeconds = parseTimeString(durationCell.textContent.trim());

        if (!arrivalTimeSpan) {
            console.log("Could not find .relative_time span in arrival cell");
            return;
        }

        function updateReturnTime() {
            const arrivalText = arrivalTimeSpan.textContent;
            let arrivalDate;

            if (arrivalText.includes('heute')) {
                arrivalDate = new Date();
            } else if (arrivalText.includes('morgen')) {
                arrivalDate = new Date();
                arrivalDate.setDate(arrivalDate.getDate() + 1);
            } else {
                const dateParts = arrivalText.split(' ')[0].split('.');
                arrivalDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            }

            const timeParts = arrivalText.split(' ').pop().split(':');
            arrivalDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]));

            const returnDate = new Date(arrivalDate.getTime() + durationSeconds * 1000);
            returnTimeSpan.textContent = formatDate(returnDate);
        }

        // Update immediately and then use MutationObserver to sync with arrival time updates
        updateReturnTime();

        const observer = new MutationObserver(updateReturnTime);
        observer.observe(arrivalTimeSpan, { childList: true, characterData: true, subtree: true });
    }

    // Run the function when the page is loaded and also after a short delay
    window.addEventListener('load', analyzeAndAddReturnTime);
    setTimeout(analyzeAndAddReturnTime, 2000); // Try again after 2 seconds in case of dynamic content
})();