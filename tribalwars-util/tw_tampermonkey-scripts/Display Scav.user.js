// ==UserScript==
// @name         Display Scav
// @namespace    http://tampermonkey.net/
// @version      0.7
// @author       jonaswagnr
// @description  Displays scavenging rank value on the resource bar
// @match        https://*.die-staemme.de/*game.php*
// @match        https://*.die-staemme.de/*screen=place*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentServer() {
        const match = window.location.hostname.match(/^(de\d+)\.die-staemme\.de$/);
        return match ? match[1] : null;
    }

    function getTargetUrl() {
        const server = getCurrentServer();
        if (!server) {
            console.error('Unable to determine current server');
            return null;
        }
        return `https://${server}.die-staemme.de/game.php?screen=ranking&mode=in_a_day&type=scavenge`;
    }

    function extractValue(responseText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');

        const resultParagraph = Array.from(doc.getElementsByTagName('p')).find(p =>
            p.textContent.includes('Mein heutiges Ergebnis:')
        );

        if (resultParagraph) {
            const boldText = resultParagraph.querySelector('b');
            if (boldText) {
                return boldText.textContent.replace(/[^\d.]/g, '');
            }
        }

        return 'Value not found';
    }

    function displayValue(value) {
        const resourceTable = document.querySelector('table.header-border.menu_block_right');
        if (!resourceTable) {
            console.error('Resource table not found');
            return;
        }

        const resourceRow = resourceTable.querySelector('table.box.smallPadding tr');
        if (!resourceRow) {
            console.error('Resource row not found');
            return;
        }

        const iconCell = document.createElement('td');
        iconCell.className = 'box-item icon-box';
        iconCell.innerHTML = '<span class="icon" style="background-image: url(\'https://dsde.innogamescdn.com/asset/4f05e65d/graphic/unit/unit_spear.png\')"></span>';

        const valueCell = document.createElement('td');
        valueCell.className = 'box-item';
        valueCell.style.whiteSpace = 'nowrap';
        valueCell.textContent = `${value}`;

        resourceRow.appendChild(iconCell);
        resourceRow.appendChild(valueCell);
    }

    function main() {
        const targetUrl = getTargetUrl();
        if (!targetUrl) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: targetUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const value = extractValue(response.responseText);
                    displayValue(value);
                } else {
                    console.error('Failed to fetch the page:', response.status);
                }
            }
        });
    }

    main();
})();