// ==UserScript==
// @name         Kartenicons verkleinern
// @version      1.0
// @description  Verkleinerung der Gruppenicons auf der Karte
// @author       catonbook
// @match        https://*.die-staemme.de/game.php?*&screen=map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/770_kartenicons_verkleinern_catonbook.js');