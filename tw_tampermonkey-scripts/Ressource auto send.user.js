// ==UserScript==
// @name                Ressource auto send
// @description 	    Automatically sends resources to your own villages in need.
// @author		        Igor Ruivo (translated and documented by Claude)
// @match               http*tribalwars*mode=send*
// @match               https://*.die-staemme.de/*mode=send*
// @version     	    0.0.1
// @supportURL          https://github.com/igor-ruivo/tw-scripts
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// ==/UserScript==

// Configuration
const helpingSystem = [
	{
		sender: "578|595",
		saveStoragePercentage: 0,
		receivers: [
			{
				village: "578|593",
				fillStoragePercentage: 50,
				minimumToSend: 1000
			}
		]
	},
    {
		sender: "582|590",
		saveStoragePercentage: 0,
		receivers: [
			{
				village: "581|591",
				fillStoragePercentage: 50,
				minimumToSend: 1000
			}
		]
	}

];

const singleTradeForEachVillageAtTime = false;
const merchantCapacity = 1000;
const offsetTimeInMillis = 3000;
let resourcesPeekDate;

/**
 * Main function that initializes the script and controls the flow.
 */
(function () {
	'use strict';
	window.sessionStorage.prevWin = window.location.href;
	setTimeout(function () {
		document.getElementById("checkbox")?.click();
	}, 2 * 1000);
	garbageCollector();

	const helperSystemStatus = checkForCorruptedHelpingSystem();
	switch(helperSystemStatus) {
		case 1:
			console.log("Invalid helpingSystem. Duplicate sender.");
			break;
		case 2:
			console.log("Invalid helpingSystem. Duplicate receiver in a sender.");
			break;
		default:
			break;
	}

	if(helperSystemStatus !== 0) {
		console.log("Reloading in 10 minutes.");
		setTimeout(function () {
			window.location.reload(true);
		}, 10 * 60 * 1000);
		return;
	}

	if(!document.getElementById("village_switch_right")) {
		console.log("Your account is not premium or you only have one village.");
		console.log("Reloading in 10 minutes.");
		setTimeout(function () {
			window.location.reload(true);
		}, 10 * 60 * 1000);
		return;
	}

	if(!villageIsSupplier()) {
		console.log("Village without recipients... Visiting the next village in 45 seconds.");
		setTimeout(function () {
			document.getElementById("village_switch_right").click();
		}, 45 * 1000);
		return;
	}

	if(inConfirmationMenu()) {
		const formElement = document.getElementById("market-confirm-form");
		const villageName = formElement.querySelector("a").innerText;
		const KSplit = villageName.split("K");
		const name = KSplit[KSplit.length - 2];
		const coords = name.slice(name.lastIndexOf("(") + 1, name.lastIndexOf(")"));
		const timeComponents = formElement.querySelector("tbody").children[5].children[1].innerText.split(":");
		if(!villageIsSupplierOfSpecificVillage(coords)) {
			return;
		}
		setTimeout(function () {
			const newSupply = {
				sender: getCurrentVillage(),
				date: Date.parse(new Date()),
				tripTime: (Number(timeComponents[0]) * 3600 + Number(timeComponents[1]) * 60 + Number(timeComponents[2])) * 1000,
				resources: {
					wood: Number(formElement.querySelector(".wood")?.parentElement?.innerText?.replace(".", "") ?? 0),
					stone: Number(formElement.querySelector(".stone")?.parentElement?.innerText?.replace(".", "") ?? 0),
					iron: Number(formElement.querySelector(".iron")?.parentElement?.innerText?.replace(".", "") ?? 0)
				}
			}
			const key = "$$" + coords + "$$";
			const targetVillageStatus = localStorage[key];
			if(targetVillageStatus) {
				console.log("memory loaded from " + coords);
				const incomings = JSON.parse(targetVillageStatus);
				incomings.push(newSupply);
				console.log(incomings);
				localStorage[key] = JSON.stringify(incomings);
			} else {
				console.log("memory written for " + coords);
				localStorage[key] = JSON.stringify([newSupply]);
			}
			formElement.querySelector(".btn").click();
		}, 500);
		return;
	}

	setTimeout(function () {
		resourcesPeekDate = new Date();
		document.getElementsByClassName("target-select-links")[0]?.children[1]?.click();
	}, offsetTimeInMillis);

	setTimeout(function () {
		if(nextIteration()) {
			console.log("Visiting the next village in 60 seconds.");
			setTimeout(function () {
				document.getElementById("village_switch_right").click();
			}, 60 * 1000);
		} else {
			console.log("Reloading in 10 minutes.");
			setTimeout(function () {
				window.location.reload(true);
			}, 10 * 60 * 1000);
		}
	}, offsetTimeInMillis * 2);
})();

/**
 * Checks if the helpingSystem configuration is valid.
 * @returns {number} 0 if valid, 1 if duplicate sender, 2 if duplicate receiver
 */
function checkForCorruptedHelpingSystem() {
	const senders = new Map();
	helpingSystem.forEach(s => senders.set(s.sender, s.sender));
	if(senders.size !== helpingSystem.length) {
		return 1;
	}
	for(let i = 0; i < helpingSystem.length; i++) {
		const s = helpingSystem[i];
		const destinations = new Map();
		for(let j = 0; j < s.receivers.length; j++) {
			const r = s.receivers[j];
			destinations.set(r.village, r.village);
		}
		if(destinations.size !== s.receivers.length) {
			return 2;
		}
	}
	return 0;
}

/**
 * Removes outdated entries from localStorage.
 */
function garbageCollector() {
	const scriptStorage = Array.from(Object.keys(localStorage)).filter(k => k.startsWith("$$") && k.endsWith("$$") && k.includes("|"));
	let gcCount = 0;
	scriptStorage.forEach(s => {
		const value = JSON.parse(localStorage[s]);
		const newValue = [];
		value.forEach(v => {
			if(v.date + v.tripTime * 2 < Date.parse(new Date())) {
				gcCount++;
			} else {
				newValue.push(v);
			}
		});
		if(newValue.length === 0) {
			localStorage.removeItem(s);
		} else {
			localStorage[s] = JSON.stringify(newValue);
		}
	});
	if(gcCount !== 0) {
		console.log("Recycled " + gcCount + " memory entries.");
	}
}

/**
 * Gets the coordinates of the current village.
 * @returns {string} Village coordinates
 */
function getCurrentVillage() {
	const villageName = document.getElementById("menu_row2").querySelector("b").innerText.split(" ")[0];
	return villageName.slice(1, villageName.indexOf(")"));
}

/**
 * Checks if the current village is a supplier in the helpingSystem.
 * @returns {boolean} True if the village is a supplier, false otherwise
 */
function villageIsSupplier() {
	const coords = getCurrentVillage();
	return helpingSystem.some(e => e.sender === coords);
}

/**
 * Checks if the current village is a supplier for a specific village.
 * @param {string} coords - Coordinates of the village to check
 * @returns {boolean} True if the current village is a supplier for the specified village, false otherwise
 */
function villageIsSupplierOfSpecificVillage(coords) {
	const currentVillage = getCurrentVillage();
	const destination = helpingSystem.filter(e => e.sender === currentVillage);
	if(destination.length === 0) {
		return false;
	}
	const entry = destination[0];
	return entry.receivers.some(r => r.village === coords)
}

/**
 * Checks if the current page is the confirmation menu for sending resources.
 * @returns {boolean} True if in confirmation menu, false otherwise
 */
function inConfirmationMenu() {
	return !!document.getElementById("market-confirm-form");
}

/**
 * Gets the available resources in the current village.
 * @returns {Object} Available resources (wood, stone, iron)
 */
function getAvailableResources() {
	return {
		wood: Number(document.getElementById("wood").innerText),
		stone: Number(document.getElementById("stone").innerText),
		iron: Number(document.getElementById("iron").innerText)
	};
}

/**
 * Calculates the total resources of a helped village, including incoming resources.
 * @param {Element} helpedVillage - DOM element of the helped village
 * @param {string} coords - Coordinates of the helped village
 * @returns {Object} Total resources (wood, stone, iron)
 */
function getHelpedVillageResources(helpedVillage, coords) {
	const baseResources = {
		wood: Number(helpedVillage.querySelector(".wood").nextElementSibling.innerText.replace(".", "")),
		stone: Number(helpedVillage.querySelector(".stone").nextElementSibling.innerText.replace(".", "")),
		iron: Number(helpedVillage.querySelector(".iron").nextElementSibling.innerText.replace(".", "")),
	}
	const incomings = localStorage["$$" + coords + "$$"];
	if(!!incomings) {
		JSON.parse(incomings).filter(i => i.date + i.tripTime > Date.parse(resourcesPeekDate)).forEach(i => {
			baseResources.wood += i.resources.wood;
			baseResources.stone += i.resources.stone;
			baseResources.iron += i.resources.iron;
		});
	}
	return baseResources;
}

/**
 * Checks if the current village is already supplying resources to a specific village.
 * @param {string} coords - Coordinates of the village to check
 * @returns {boolean} True if already supplying, false otherwise
 */
function villageIsAlreadySupplying(coords) {
	const memory = localStorage["$$" + coords + "$$"];
	if(!memory) {
		return false;
	}
	return JSON.parse(memory).some(m => m.sender === getCurrentVillage() && m.date + m.tripTime > Date.parse(new Date()));
}

/**
 * Performs the next iteration of the resource distribution process.
 * @returns {boolean} True if there are more villages to process, false otherwise
 */
function nextIteration() {
	const storageSpace = Number(document.getElementById("storage").innerText);
	const availableMerchants = Number(document.getElementById("market_merchant_available_count").innerText);
	if(availableMerchants === 0) {
		console.log("No merchants available.");
		return true;
	}

	const resources = getAvailableResources();

	const ownVillages = document.getElementById("own")?.nextElementSibling;
	if(!ownVillages) {
		console.log("Unable to send resources.");
		return false;
	}

	const villages = ownVillages.querySelectorAll("tr");

	const villagesToBeHelped = [];

	villages.forEach(v => {
		const coords = v.querySelectorAll("td")[3].innerText;
		if(villageIsSupplier() && villageIsSupplierOfSpecificVillage(coords)) {
			if(singleTradeForEachVillageAtTime && villageIsAlreadySupplying(coords)) {
				console.log("The village is already sending resources to " + coords);
				return;
			}
			villagesToBeHelped.push(v);
		}
	});

	const currentVillageEntry = helpingSystem.filter(e => e.sender === getCurrentVillage())[0];
	const ownStorageSavingPercentage = currentVillageEntry.saveStoragePercentage;
	const receiverVillages = currentVillageEntry.receivers;

	for(let i = 0; i < villagesToBeHelped.length; i++) {
		const currentVillage = villagesToBeHelped[i];
		const coordinates = currentVillage.children[3].innerText;

		console.log("Analyzing possible supply for " + coordinates);

		const helpedVillageResources = getHelpedVillageResources(currentVillage, coordinates);
		console.log("Resources in the village (including those already on the way):");
		console.log(helpedVillageResources);
		const helpedVillageStorage = Number(currentVillage.querySelector(".ressources").parentElement.innerText.replace(".", ""));
		const resourcesInput = document.getElementsByClassName("resources_max");
		const maxResourcesToSend = merchantCapacity * availableMerchants;
		const receiverVillageData = receiverVillages.filter(v => v.village === coordinates)[0];
		const maxResourcesToReceive = Math.floor(receiverVillageData.fillStoragePercentage / 100 * helpedVillageStorage);
		const minimumResourcesToSend = receiverVillageData.minimumToSend;
		console.log("Maximum storage to fill: " + maxResourcesToReceive);
		const helpedMissingResources = {
			wood: Math.max(maxResourcesToReceive - helpedVillageResources.wood, 0),
			stone: Math.max(maxResourcesToReceive - helpedVillageResources.stone, 0),
			iron: Math.max(maxResourcesToReceive - helpedVillageResources.iron, 0)
		}
		console.log("Missing resources:");
		console.log(helpedMissingResources);
		const missingSum = helpedMissingResources.wood + helpedMissingResources.stone + helpedMissingResources.iron;
		if(missingSum === 0) {
			console.log("No resources are missing in the village.");
			continue;
		}
		const intendedResourcesToSend = {
			wood: Math.min(helpedMissingResources.wood, Math.min(resources.wood, Math.floor(helpedMissingResources.wood / missingSum * maxResourcesToSend))),
			stone: Math.min(helpedMissingResources.stone, Math.min(resources.stone, Math.floor(helpedMissingResources.stone / missingSum * maxResourcesToSend))),
			iron: Math.min(helpedMissingResources.iron, Math.min(resources.iron, Math.floor(helpedMissingResources.iron / missingSum * maxResourcesToSend)))
		};
const resourcesToSend = {
			wood: Math.min(intendedResourcesToSend.wood, Math.max(Math.round(resources.wood - storageSpace * ownStorageSavingPercentage / 100), 0)),
			stone: Math.min(intendedResourcesToSend.stone, Math.max(Math.round(resources.stone - storageSpace * ownStorageSavingPercentage / 100), 0)),
			iron: Math.min(intendedResourcesToSend.iron, Math.max(Math.round(resources.iron - storageSpace * ownStorageSavingPercentage / 100), 0))
		};
		const resourcesToSendSum = resourcesToSend.wood + resourcesToSend.stone + resourcesToSend.iron;
		console.log("Resources to actually send:");
		console.log(resourcesToSend);
		if(resourcesToSendSum < minimumResourcesToSend) {
			console.log("Resource quantity does not justify a shipment. Minimum for this target village: " + minimumResourcesToSend);
			continue;
		}
		resourcesInput[0].value = resourcesToSend.wood;
		resourcesInput[1].value = resourcesToSend.stone;
		resourcesInput[2].value = resourcesToSend.iron;
		setTimeout(function () {
			currentVillage.querySelector("a").click();
		}, 1000);
		setTimeout(function () {
			document.getElementById("delivery_target").querySelector(".btn").click();
		}, 2000);
		break;
	}

	console.log("This village has no more villages to supply");
	return true;
}
