// ==UserScript==
// @name         DS UI Erweitert
// @version      3.0
// @description  A minimal aproach to improve TW by displaying summed info of a page and adding filters
// @author       suilenroc, Get Drunk, ruingvar
// @include      https://*.die-staemme.de/game.php?*screen=place*
// @include      https://*.die-staemme.de/game.php?*screen=info_village*
// @include      https://*.die-staemme.de/game.php?*screen=overview_villages*
// @include      https://*.die-staemme.de/game.php?*screen=report*
// @include      https://*.die-staemme.de/game.php?*screen=flags*
// @include      https://*.die-staemme.de/game.php?*screen=ally*mode=members*
// @include      https://*.die-staemme.de/public_report/*
// @include      https://*.die-staemme.de/game.php?*screen=settings*
// @license      MIT-Lizenz
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

//Einstellungen ab hier

// Doerfer Kopieren und WB Button (in 1. - 1.2)
win.CopyAndExportButton = true
// Produktion Zusammenfassung (1.1)
win.OverviewVillages = true
// Truppenzaehler (1.2)
win.TroopCounter = true
//Zusammenfassungen auf der Dorf-Informations Seite (2.)
win.InfoVillage = true
// Bericht BashPunkte Anzeige + UT-Bericht Zusammenfassung (4.1 - 4.2)
win.ReportBashPoints = true
// Bericht UEberlebende Truppen Zeile (4.1)
win.ReportSurvived = false
// Massen-Unterstuetzungs Zusammenfassung (3.2)
win.MassSupport = true
// Transport Zusammenfassung (1.3)
win.Transport = true
// Flaggen Zusammenfassung (6.)
win.FlagStats = true
// Mitglieder Verteidigungs und Truppen Zusammenfassungen (5.-5.2)
win.AllySummarie = true
// Ab wie vielen Speeren ein Dorf als Bunker zaehlen soll (fuer 5.2)
win.spear_bunker_value = 20000
// Sotier funktion im Versammlungsplatz (3.1)
win.PlaceFilters = true
// Zusatzinformation bei Spaehberichten
win.ReportSpyInfo = true
// Abschick und Retime Zeiten
win.ReportTimes = true
// Befehlsfreigabe Vertieler um Freunde daran zu erinnern..
win.CommandAndNotesSharing = true
// Ut Berichte Vorschau zusammengefasst anzeigen (4.2.1)
win.ReportPreview = true

//Einstellungen bis hier

win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/315_ds-ui_erweitern_suilenroc.js');