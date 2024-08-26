// ==UserScript==
// @name         Karte zentrieren nach oben
// @version      1.0
// @description  verschiebt "Karte zentrieren" nach oben
// @author       TheHebel97
// @match        https://*.die-staemme.de/*screen=map*
// ==/UserScript==

let win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

win.onTop = true;

win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/660_karte-zentrieren-nach-oben_thehebel97.js');