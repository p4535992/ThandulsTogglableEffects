import {i18n, log, debug} from '../ThandulsTogglableEffects';
export const MODULE_NAME = 'ThandulsTogglableEffects';

/**
 * Because typescript doesn’t know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it’s typed as declare let canvas: Canvas | {ready: false}.
 * That’s why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because a „no canvas“ mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
 export function getCanvas(): Canvas {
    if (!(canvas instanceof Canvas) || !canvas.ready) {
        throw new Error("Canvas Is Not Initialized");
    }
    return canvas;
}

export const COMPENDIUM_PACK = MODULE_NAME + ".ThandulsTogglableEffects Pack";
export const COMPENDIUM_LINGERING_INJURIES_ITEMS = MODULE_NAME + ".ThandulsTogglableEffects Lingering Injuries Items";
export const COMPENDIUM_LINGERING_INJURIES_TABLES = MODULE_NAME + ".ThandulsTogglableEffects Lingering Injuries Tables";
export const COMPENDIUM_LINGERING_INJURIES_CONDITIONS = MODULE_NAME + ".ThandulsTogglableEffects Pack Conditions";

export const COMPENDIUM_PACK_VISIONS_AND_LIGHTS =  MODULE_NAME + ".ThandulsTogglableEffects Pack Visions and Lights";
export const COMPENDIUM_PACK_MACRO =  MODULE_NAME + ".ThandulsTogglableEffects Pack Macro";
//export const COMPENDIUM_PACK_FEATS =  MODULE_NAME + ".ThandulsTogglableEffects Pack";

export const COMPENDIUM_DAE_SRD_SPELLS = "Dynamic-Effects-SRD.DAE SRD Spells";
export const COMPENDIUM_DAE_SRD_FEATS = "Dynamic-Effects-SRD.DAE SRD Feats";
export const COMPENDIUM_ATL_TOKEN_LIGHTING_PREMADE = "ATL.Token Lighting Premade";

export const registerSettings = function () {
	game.settings.register(MODULE_NAME, "showForPlayers", {
		name: "Show for players",
		hint: "Enables panel with effect toggles for non-gm players.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
        onChange: _ => window.location.reload()
	});

	game.settings.register(MODULE_NAME, "togglesPerRow", {
		name: "Number of effect toggles per row",
		hint: "Number of effect toggles thatg will be displayed in one row of the panel.",
		scope: "world",
		config: true,
		default: 4,
		//type: String
	});

	game.settings.register(MODULE_NAME, "sortToggles", {
		name: "Sort effect toggles by name",
		hint: "Effect toggles can be sroted on the panel alphabetically by name",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	game.settings.register(MODULE_NAME, "enableAutomation", {
		name: "Enable effect automation",
		hint: "Some effects like Barkskin, Rage, Mage Armor and Shield can be automatically applied to Actor that used appropiate skill.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	// // Enabling effects for client.
	// game.settings.register(MODULE_NAME, "enabledEffects.Bane", {
	// 	name: "Bane",
	// 	hint: "Enables Bane toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Barkskin", {
	// 	name: "Barkskin",
	// 	hint: "Enables Barkskin toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Bless", {
	// 	name: "Bless",
	// 	hint: "Enables Bless toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Enlarge", {
	// 	name: "Enlarge",
	// 	hint: "Enables Enlarge toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.FavouredEnemy", {
	// 	name: "Favoured Enemy",
	// 	hint: "Enables Favoured Enemy toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.GreaterFavouredEnemy", {
	// 	name: "Greater Favoured Enemy",
	// 	hint: "Enables Greater Favoured Enemy toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Fly", {
	// 	name: "Fly",
	// 	hint: "Enables Fly toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.FortunesFavor", {
	// 	name: "Fortune's Favor",
	// 	hint: "Enables Fortune's Favor toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.GiftOfAlacrity", {
	// 	name: "Gift of Alacrity",
	// 	hint: "Enables Gift of Alacrity toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Guidance", {
	// 	name: "Guidance",
	// 	hint: "Enables Guidance toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Haste", {
	// 	name: "Haste",
	// 	hint: "Enables Haste toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.HuntersMark1h", {
	// 	name: "Hunter's Mark 1h",
	// 	hint: "Enables Hunter's Mark (1h concentration) toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.HuntersMark8h", {
	// 	name: "Hunter's Mark 8h",
	// 	hint: "Enables Hunter's Mark (8h concentration) toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.HuntersMark24h", {
	// 	name: "Hunter's Mark 24h",
	// 	hint: "Enables Hunter's Mark (24h concentration) toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Longstrider", {
	// 	name: "Longstrider",
	// 	hint: "Enables Longstrider toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.MageArmor", {
	// 	name: "Mage Armor",
	// 	hint: "Enables Mage Armor toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.PassWithoutTrace", {
	// 	name: "Pass without Trace",
	// 	hint: "Enables Pass without Trace toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Rage", {
	// 	name: "Rage",
	// 	hint: "Enables Rage toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Reduce", {
	// 	name: "Reduce",
	// 	hint: "Enables Reduce toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Shield", {
	// 	name: "Shield",
	// 	hint: "Enables Shield toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.ShieldOfFaith", {
	// 	name: "Shield of Faith",
	// 	hint: "Enables Shield of Faith toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });
	// game.settings.register(MODULE_NAME, "enabledEffects.Slow", {
	// 	name: "Slow",
	// 	hint: "Enables Slow toggle.",
	// 	scope: "client",
	// 	config: true,
	// 	default: true,
	// 	type: Boolean
	// });

	// =======================
	// Advanced combat options
	// =======================

	// log("Registering Lingering Injuries");
	// game.settings.register(MODULE_NAME,'LI-SETTING', {
	// 	name : i18n("EFFECT.LI-SETTING.title"),
	// 	hint : i18n("EFFECT.LI-SETTING.hint"),
	// 	scope :"world",
	// 	config : true,
	// 	default : false,
	// 	type : Boolean,
	// 	onChange : value => {
	// 		window.location.reload();
	// 	}
	// });

	// log("Registering Massive Damage");
	// game.settings.register(MODULE_NAME,'MD-SETTING', {
	// 	name : i18n("EFFECT.MD-SETTING.title"),
	// 	hint : i18n("EFFECT.MD-SETTING.hint"),
	// 	scope :"world",
	// 	config : true,
	// 	default : false,
	// 	type : Boolean,
	// 	onChange : value => {
	// 		window.location.reload();
	// 	}
	// });

	// log("Registering Token Settings");
	// game.settings.register(MODULE_NAME,'TH-SETTING', {
	// 	name : i18n("EFFECT.TH-SETTING.title"),
	// 	hint : i18n("EFFECT.TH-SETTING.hint"),
	// 	scope :"world",
	// 	config : true,
	// 	default : false,
	// 	type : Boolean,
	// 	onChange : value => {
	// 		window.location.reload();
	// 	}
	// });

	// log("Registering Unconscious Exhaustion Settings");
	// game.settings.register(MODULE_NAME,'UE-SETTING', {
	// 	name : i18n("EFFECT.UE-SETTING.title"),
	// 	hint : i18n("EFFECT.UE-SETTING.hint"),
	// 	scope :"world",
	// 	config : true,
	// 	default : false,
	// 	type : Boolean,
	// 	onChange : value => {
	// 		window.location.reload();
	// 	}
	// });

	// log("Registering Healing Surge Settings");
	// game.settings.register(MODULE_NAME,'HS-SETTING', {
	// 	name : i18n("EFFECT.HS-SETTING.title"),
	// 	hint : i18n("EFFECT.HS-SETTING.hint"),
	// 	scope :"world",
	// 	config : true,
	// 	default : false,
	// 	type : Boolean,
	// 	onChange : value => {
	// 		window.location.reload();
	// 	}
	// });

	// log("Registering Exhaustion Removal Settings");
	// game.settings.register(MODULE_NAME,'ER-SETTING', {
	// 	name : i18n("EFFECT.ER-SETTING.title"),
	// 	hint : i18n("EFFECT.ER-SETTING.hint"),
	// 	scope :"world",
	// 	config : true,
	// 	default : false,
	// 	type : Boolean,
	// 	onChange : value => {
	// 		window.location.reload();
	// 	}
	// });

	// ===========================
	// CONDITION AUTOMATION
	// ===========================

	// game.settings.register(MODULE_NAME, 'Blinded',
	// {
	// 	name: game.i18n.localize("EFFECT.BlindingSettingTitle"),
	// 	scope: 'world',
	// 	type: Number,
	// 	default: 0,
	// 	config: true,
	// 	hint: game.i18n.localize("EFFECT.BlindingSettingHint"),
	// 	choices: {
	// 		0: game.i18n.localize("EFFECT.BlindingSettingOption0"),
	// 		1: game.i18n.localize("EFFECT.BlindingSettingOption1"),
	// 		2: game.i18n.localize("EFFECT.BlindingSettingOption2"),
	// 		3: game.i18n.localize("EFFECT.BlindingSettingOption3")
	// 	},
	// 	onChange: () => {
	// 		if (game.settings.get(MODULE_NAME, 'Blinded') === 3 && !game.modules.get("perfect-vision")?.active && game.settings.get(MODULE_NAME, 'shadows')) {
	// 			ui.notifications.error(game.i18n.localize("EFFECT.condition-automationError"))
	// 		}
	// 	}
	// });

	// game.settings.register(MODULE_NAME, 'BlindStatus',
	// {
	// 	name: game.i18n.localize("EFFECT.BlindStatusTitle"),
	// 	hint: game.i18n.localize("EFFECT.BlindStatusHint"),
	// 	scope: "world",
	// 	config: true,
	// 	default: i18n("EFFECT.StatusBlinded"),
	// 	type: String,
	// });

	// game.settings.register(MODULE_NAME, 'npcVision',
	// {
	// 	name: game.i18n.localize("EFFECT.npcVisionTitle"),
	// 	scope: 'world',
	// 	type: Boolean,
	// 	default: false,
	// 	config: true,
	// 	hint: game.i18n.localize("EFFECT.npcVisionHint"),
	// });

	// game.settings.register(MODULE_NAME, 'shadows',
	// {
	// 	name: game.i18n.localize("EFFECT.shadowsTitle"),
	// 	scope: 'world',
	// 	type: String,
	// 	default: "off",
	// 	choices: {
	// 		"off": game.i18n.localize("EFFECT.shadowsSetting1"),
	// 		"shadow": game.i18n.localize("EFFECT.shadowsSetting2"),
	// 		"bulge": game.i18n.localize("EFFECT.shadowsSetting3"),
	// 	},
	// 	config: true,
	// 	hint: game.i18n.localize("EFFECT.shadowsHint"),
	// 	onChange: () => {
	// 		if (!game.modules.get("tokenmagic")?.active && game.settings.get(MODULE_NAME, 'shadows')) {
	// 			ui.notifications.error(game.i18n.localize("EFFECT.shadowsError"))
	// 		}
	// 	},
	// });

}
