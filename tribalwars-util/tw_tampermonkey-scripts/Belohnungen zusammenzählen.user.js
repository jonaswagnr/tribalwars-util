// ==UserScript==
// @name Belohnungen zusammenzählen
// @description Zählt die Belohnungen zusammen
// @version 1.0
// @author Osse,TheHebel97
// @match https://*.die-staemme.de/game.php?*
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/460_belohnungen_zusammenzaehlen_osse-thehebel97.js');