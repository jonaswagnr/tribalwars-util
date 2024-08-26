// ==UserScript==
// @name         autoMassScav
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automates scavenging based on parsed game data with manual start, state persistence, and auto-refresh
// @match        *://*.die-staemme.de/*screen=place&mode=scavenge_mass*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = GM_getValue('autoScavengerRunning', false);

    function log(message) {
        console.log(`[AutoScavenger] ${message}`);
    }

    function error(message) {
        console.error(`[AutoScavenger Error] ${message}`);
    }

    function parseScavengeData() {
        log('Parsing scavenge data');
        let scavengeInfo = [];
        let lowestDuration = Infinity;
        let lowestDurationEndTime = null;

        const scriptContent = $('script:contains("ScavengeMassScreen")').html();
        if (!scriptContent) {
            error('Could not find scavenge data in page');
            return null;
        }

        const jsonMatch = scriptContent.match(/\{.*\:\{.*\:.*\}\}/g);
        if (!jsonMatch) {
            error('Could not extract JSON data from script');
            return null;
        }

        try {
            scavengeInfo = JSON.parse("[" + jsonMatch[2] + "]");
        } catch (e) {
            error('Failed to parse scavenge JSON data: ' + e);
            return null;
        }

        $.each(scavengeInfo, function(villageNr) {
            $.each(scavengeInfo[villageNr]["options"], function(villageCategoryNr) {
                if (scavengeInfo[villageNr]["options"][villageCategoryNr]["scavenging_squad"] != null) {
                    const endTime = parseInt(scavengeInfo[villageNr]["options"][villageCategoryNr]["scavenging_squad"]["return_time"]) * 1000;
                    const duration = (endTime - Date.now()) / 1000;
                    if (duration < lowestDuration) {
                        lowestDuration = duration;
                        lowestDurationEndTime = endTime;
                    }
                }
            });
        });

        log(`Lowest duration: ${lowestDuration} seconds, End time: ${new Date(lowestDurationEndTime)}`);
        return { duration: lowestDuration, endTime: lowestDurationEndTime };
    }

    function runScavengeScript() {
        if (!isRunning) return;
        log('Running scavenge script');
        var premiumBtnEnabled = false;
        $.getScript('https://shinko-to-kuma.com/scripts/massScavenge.js')
            .done(function() {
                log('Scavenge script loaded successfully');
                clickButtons();
            })
            .fail(function(jqxhr, settings, exception) {
                error(`Failed to load the scavenge script: ${exception}`);
                scheduleNextRun();
            });
    }

    function clickButtons() {
        log('Clicking buttons');
        const calculateButton = document.querySelector('input.btn.btnSophie[value="Calculate runtimes for each page"]');
        if (calculateButton) {
            calculateButton.click();
            log('Clicked Calculate button');
            setTimeout(clickLaunchButtons, 2000);
        } else {
            error('Calculate button not found');
            scheduleNextRun();
        }
    }

    function clickLaunchButtons() {
        log('Clicking launch buttons');
        const launchButtons = document.querySelectorAll('input.btn.btnSophie[value^="Launch group"]');
        log(`Found ${launchButtons.length} launch buttons`);

        function clickNextButton(index) {
            if (!isRunning) return;
            if (index < launchButtons.length) {
                launchButtons[index].click();
                log(`Clicked ${launchButtons[index].value}`);
                setTimeout(() => clickNextButton(index + 1), 1000);
            } else {
                log('All launch buttons clicked');
                scheduleNextRun();
            }
        }

        clickNextButton(0);
    }

    function scheduleNextRun() {
        if (!isRunning) return;
        const scavengeData = parseScavengeData();
        let delay;

        if (!scavengeData || scavengeData.duration === Infinity || !scavengeData.endTime) {
            log('No active scavenging found or failed to parse data, using default delay');
            delay = 5 * 60 * 1000; // 5 minutes in milliseconds
        } else {
            delay = (scavengeData.endTime - Date.now()) + 3000;
        }

        log(`Scheduling next run in ${delay / 1000} seconds`);
        setTimeout(() => {
            log('Refreshing page for next run');
            location.reload();
        }, delay);
    }

    function createStartButton() {
        const container = document.querySelector('#content_value');
        if (!container) {
            error('Could not find container for button');
            return;
        }

        const button = document.createElement('a');
        button.href = '#';
        button.className = 'btn';
        button.textContent = isRunning ? 'Stop Auto Scavenger' : 'Start Auto Scavenger';
        button.style.marginBottom = '10px';
        if (isRunning) {
            button.style.backgroundColor = '#f44336';
        }

        button.onclick = function(e) {
            e.preventDefault();
            isRunning = !isRunning;
            GM_setValue('autoScavengerRunning', isRunning);
            if (isRunning) {
                button.textContent = 'Stop Auto Scavenger';
                button.style.backgroundColor = '#f44336';
                log('Auto Scavenger started');
                runScavengeScript();
            } else {
                button.textContent = 'Start Auto Scavenger';
                button.style.backgroundColor = '';
                log('Auto Scavenger stopped');
            }
        };

        container.insertBefore(button, container.firstChild);
    }

    log('Script loaded');
    createStartButton();
    if (isRunning) {
        log('Auto Scavenger was running before refresh, restarting...');
        runScavengeScript();
    }
})();