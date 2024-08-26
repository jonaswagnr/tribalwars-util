// ==UserScript==
// @name         Bevölkerungsanzeige
// @version      1.0
// @description  Fügt die übrige Bevölkerungsanzahl in der Kopfzeile hinzu.
// @author       c1aas, Zareko
// @match        https://*.die-staemme.de/game.php?*
// @grant        none
// ==/UserScript==

const win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
win.colorAbove1500 = 'green';
win.colorBelow1500 = '#e67e00';
win.colorBelow1000 = 'red';
win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/710_bevoelkerungsanzeige_c1aas.js');