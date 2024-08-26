// ==UserScript==
// @name         Auto Bot-Schutz Clicker and hCaptcha Checkbox Checker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically clicks the Bot-Schutz button and checks the hCaptcha checkbox in Die Stämme
// @match        *://*.die-staemme.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickBotSchutzButton() {
        const button = document.querySelector('#bot_check a.btn.btn-default');
        if (button && button.textContent.includes('Beginne Bot-Schutz-Prüfung')) {
            button.click();
            console.log('Bot-Schutz button clicked!');
            return true;
        }
        return false;
    }

    function checkHCaptchaCheckbox() {
        const checkbox = document.querySelector('#checkbox[role="checkbox"][aria-checked="false"]');
        if (checkbox) {
            checkbox.click();
            console.log('hCaptcha checkbox checked!');
            return true;
        }
        return false;
    }

    function handleBotSchutz() {
        if (clickBotSchutzButton() || checkHCaptchaCheckbox()) {
            // If either action was successful, set up a short interval to check for the checkbox
            let attempts = 0;
            const checkInterval = setInterval(() => {
                if (checkHCaptchaCheckbox() || attempts > 10) {
                    clearInterval(checkInterval);
                }
                attempts++;
            }, 500); // Check every 500ms for up to 5 seconds
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', handleBotSchutz);

    // Also run the function periodically in case elements appear dynamically
    setInterval(handleBotSchutz, 2000); // Check every 2 seconds
})();