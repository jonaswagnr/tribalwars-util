// ==UserScript==
// @name                 DS/TW Bashpoints in Reports
// @author               Samuel Essig (http://c1b1.de)
// @namespace            c1b1.de
// @homepage             http://c1b1.de
// @copyright            2008 - 2011, Samuel Essig (http://c1b1.de)
// @license              No Distribution!
// @description          Adds a line with bashpoints to reports; Fügt eine Zeile mit Bashpunkten in Berichten hinzu
// @include              https://de*.die-staemme.de/game.php*screen=report*mode=all*view=*
// @include              https://de*.die-staemme.de/game.php*mode=all*view=*screen=report*
// @include              https://ch*.die-staemme.ch/game.php*screen=report*mode=all*view=*
// @include              https://ch*.die-staemme.ch/game.php*mode=all*view=*screen=report*
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/220_bashpoints_in_reports_C1B1SE.js');