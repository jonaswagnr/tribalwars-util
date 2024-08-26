// ==UserScript==
// @name                Scavenging Deff
// @version     	    1.0.7
// @description         Scavenge for resources automatically
// @author              jonaswagnr
// @match               https://**.tribalwars.com.*/game.php?**&mode=scavenge*
// @match               https://*.die-staemme.de/*game.php?*&mode=scavenge*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/Scavenging.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/Scavenging.user.js
//
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// ==/UserScript==

/**
 * THIS SCRIPT WAS FORKED FROM TavinhuTurbinator!! Turbinando TW. All credits to him!
 */
(async (ModuleLoader) => {
    'use strict';

    // Dependency loading
    await ModuleLoader.loadModule('utils/notify-utils');

    // Controls the window title
    TwFramework.setIdleTitlePreffix('SCAVENGING', document.title);

    const gameData = TribalWars.getGameData();
    const tag = gameData.world + '' + gameData.player.name + '' + gameData.screen + '_' + gameData.mode;
    const nLoop = 5;
    unsafeWindow.window.name = tag;

    if (unsafeWindow.window.name === tag) {
        iniciar();
        loop(nLoop);
        recarregar(60);
    }

    function iniciar() {
        logica();
    }

    function aleatorio(menor, maior) {
        var intervalo = Math.round(maior - menor);
        return Math.floor(Math.random() * intervalo) + menor + Timing.offset_to_server;
    }

    // Loop no inicar a cada X segundos. nLoop = 0 para o loop
    function loop(segundos) {
        var timer = setInterval(function () {
            if (nLoop === 0) {
                clearInterval(timer);
            } else {
                setTimeout(function () {
                    iniciar();
                }, aleatorio(segundos * 1000 * 0.01, segundos * 1000 * 0.10));
            }
        }, segundos * 1000);
    }

    // Recarrega a pagina a cada X minutos
    function recarregar(minutos) {
        setInterval(function () {
            setTimeout(function () {
                window.location.reload();
            }, aleatorio(minutos * 60000 * 0.01, minutos * 60000 * 0.10));
        }, minutos * 60000);
    }

    // Buscar e Validar Objeto
    function buscarObjeto(sObj) {
        var objeto = document.querySelectorAll(sObj);
        if (objeto !== undefined && objeto[0] !== undefined) {
            return objeto;
        } else {
            return undefined;
        }
    }

    function parseAsInteger(txt, divisor) {
        var retInt = 0;
        var valor = parseInt(txt.replace('(', '').replace(')', ''));
        if (valor > 0 && divisor > 0) {
            retInt = Math.trunc(valor / divisor);
        }
        return retInt;
    }

    function selecionarTropas(botoesDisponiveis) {
        if (botoesDisponiveis <= 0) {
            return;
        }

        var divisor = 0;

        var lanca = document.getElementsByName("spear")[0];
        var espada = document.getElementsByName("sword")[0];
        var heavycav = document.getElementsByName("heavy")[0];

        if (botoesDisponiveis == 4) {
            divisor = 13;
            lanca.value = parseAsInteger($("a.units-entry-all[data-unit='spear']")[0].innerText, divisor);
            lanca.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

            espada.value = parseAsInteger($("a.units-entry-all[data-unit='sword']")[0].innerText, divisor);
            espada.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

            heavycav.value = parseAsInteger($("a.units-entry-all[data-unit='heavy']")[0].innerText, divisor);
            heavycav.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

        } else if (botoesDisponiveis == 3) {
            divisor = 8;
            lanca.value = parseAsInteger($("a.units-entry-all[data-unit='spear']")[0].innerText, divisor);
            lanca.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

            espada.value = parseAsInteger($("a.units-entry-all[data-unit='sword']")[0].innerText, divisor);
            espada.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

            heavycav.value = parseAsInteger($("a.units-entry-all[data-unit='heavy']")[0].innerText, divisor);
            heavycav.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

        } else if (botoesDisponiveis == 2) {
            divisor = 3.5;
            lanca.value = parseAsInteger($("a.units-entry-all[data-unit='spear']")[0].innerText, divisor);
            lanca.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

            espada.value = parseAsInteger($("a.units-entry-all[data-unit='sword']")[0].innerText, divisor);
            espada.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));

            heavycav.value = parseAsInteger($("a.units-entry-all[data-unit='heavy']")[0].innerText, divisor);
            heavycav.dispatchEvent(new KeyboardEvent('keyup', {
                'key': '0'
            }));
        } else {
            var nrLanca = $("a.units-entry-all[data-unit='spear']")[0];
            var nrEspada = $("a.units-entry-all[data-unit='sword']")[0];
            var nrHeavycav = $("a.units-entry-all[data-unit='heavy']")[0];

            nrLanca.click();
            nrEspada.click();
            nrHeavycav.click();
        }
    }

    function timeOver() {
        var tempo = document.getElementsByClassName('return-countdown');
        var lRecarregar = false;
        for (var i = 0; i < 4; i++) {
            if (tempo[i] !== undefined && parseInt(tempo[i].innerText.split(":")[1]) < 1) {
                lRecarregar = true;
            }
        }
        if (lRecarregar) {
            recarregar(2);
        }
    }

    /**
     * Get button count on the container
     *
     * @param {HtmlElement} obj
     */
    function getButtonCount(obj) {
        var objRet = {};
        var cont = 0;
        for (var i = 0; i < 4; i++) {
            if (obj[i] !== undefined) {
                cont = cont + 1;
                objRet.btn = obj[i];
            }
        }
        objRet.cont = cont;
        return objRet;
    }

    function logica() {
        var btns = buscarObjeto("a.btn.btn-default.free_send_button:not(.btn-disabled)");
        if (btns !== undefined) {
            var disp = getButtonCount(btns);
            if (disp.cont > 0) {
                selecionarTropas(disp.cont);
                setTimeout(function () {
                    disp.btn.click();
                }, aleatorio(700, 1500));
            }
        }
        timeOver();
    }

})({
    // ModuleLoader functions
    loadModule: moduleName => {
        return new Promise((resolve, reject) => {
            const modulePath = moduleName.replace('.', '/');
            const moduleUrl = `https://raw.githubusercontent.com/joaovperin/TribalWars/master/Modules/${modulePath}.js`;
            console.debug('[TwScripts] Loading ', modulePath, ' from URL ', moduleUrl, '...');
            return $.ajax({
                    method: "GET",
                    url: moduleUrl,
                    dataType: "text"
                }).done(res => resolve(eval(res)))
                .fail(req => reject(console.error("[TwScripts] Fail loading module '", moduleName, "'.")));
        })
    }
});