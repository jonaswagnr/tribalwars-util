// ==UserScript==
// @name         		Inc-Renamer
// @description      	Die Staemme: Umbenennen von Angriffen
// @author         		SlowTarget, angepasst von RokKeT und Harpstennah
// @icon         		http://help.die-staemme.de/images/4/46/Att.png
// @include         	https://de*.die-staemme.de/game.php*&screen=info_command*
// @exclude         	https://*/game.php*type=own*&screen=info_command
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

// --- Anfang einstellbare Variablen ------

//win.theFormat = '{unit} - Start: {origin} - {player} - Ank: {arrival} - Zurueck: {return}';
win.theFormat = '{unit} | s: {sent}  |  r: {return}';
win.theFormatII = '{unit} - {origin} {player} s:{sent}';
// win.arrUnitNames=['Sp\u00e4h','LKAV','SKAV','Axt','Schwert','Rammbock', 'Kata', '**AG**', 'UNBK'];
// win.arrKeys=[49,50,51,52,53,54,55,56,57];
// win.insertSymbol=".";

// --- Ende einstellbare Variablen ------

win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/240_inc_renamer_harpstennah.js');