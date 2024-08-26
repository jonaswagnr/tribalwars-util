// ==UserScript==
// @name        Produktion zusammenzählen
// @version     1.1
// @description Rechnet die Produktion der Minen zusammen
// @author      Osse, Imdra
// @match       https://*.die-staemme.de/game.php?*screen=overview_villages*
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

// Einstellungen ab hier

// Prozent an extra Produktion  Bsp: 20% Premium + 30% Kriegsanstengung = 0.5
win.bonusProd = 0.0;
// true um Ressi Flaggen mitzurechnen, false um sie zu ignorieren
win.useFlags = false;

// Einstellungen bis hier

win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/510_produktionen_zusammenzaehlen_osse.js');