import { warn, error, debug, i18n, log } from "../ThandulsTogglableEffects";
import { createTogglablesTable, openDialogThandulsTogglableEffects, openTab, nameSpells, nameFeatures, nameConditions, nameLights } from './htmlBuilder';
import { handleChatMessage } from './automation';
import * as LI_module from './macros/mix/lingering-injuries';
import * as MD_module from  './macros/mix/massive-damage';
import * as TH_module from  './macros/mix/token_hp';
import * as UE_module from  './macros/mix/unconscious_exhaustion';
import * as HS_module from  './macros/features/healing_surge';
import * as ER_module from  './macros/mix/exhaustion_recovery';
import { COMPENDIUM_PACK_MACRO, getCanvas, MODULE_NAME } from "./settings";
import { ThandulSpells } from "./categories/spells";
import { ThandulFeatures } from "./categories/features";
import { ThandulConditions } from "./categories/conditions";
import { getRandomItemFromCompendium } from "./helpers";
// import { preCreateActiveEffectBlindedFromConditionAutomation, preDeleteActiveEffectBlindedFromConditionAutomation, preUpdateTokenFlyFromConditionAutomation, preUpdateTokentBlindedFromConditionAutomation } from './condition-automation/condition-automation.ts.bak';
// import { preUpdateActorAdvCbtOpts, preUpdateTokenAdvCbtOpts, renderLongRestDialogAdvCbtOpts, renderShortRestDialogAdvCbtOpts } from "./executor/advanced-combat-options";
import { initLangEffect, LANG_EFFECT } from "./helperLang";

export let readyHooks = async () => {

  // log("Registering Sockets");
  // game.socket['on']('module.ThandulsTogglableEffects', async (data:any) => {
  //   if(data?.name === "LI" && game.settings.get(MODULE_NAME,'LI-SETTING'))
  //   {
  //     LI_module.recieveData(data?.data);
  //   }
  //   if(data?.name === "MD" && game.settings.get(MODULE_NAME,'LI-SETTING'))
  //   {
  //     MD_module.recieveData(data?.data);
  //   }
  //   if(data?.name === "UE" && game.settings.get(MODULE_NAME,'UE-SETTING'))
  //   {
  //     UE_module.recieveData(data?.data);
  //   }
  // });

  // ===============================================================
  // AUTOMATIC IMPORT OF THE COMPENDIUM MACRO PACK
  // ===============================================================

  const pack = game.packs.find(p => p.collection === COMPENDIUM_PACK_MACRO);
  if(!pack){
    error("Cannot find the compendium '" + COMPENDIUM_PACK_MACRO + "'");
  }
  const contents = await pack.getContent();
  const createData = contents.map(async (i:any) => {
    let item = i.data;
    await Macro.create(item);
  });

}

export let initHooks = () => {
  warn("Init Hooks processing");

  // setup all the hooks
  let togglablesHTML;

  // Hooks.on('renderSceneControls', async () => {
  //     if (!game.settings.get(MODULE_NAME, "showForPlayers") && game.user['role'] < 3) { return; }
  //     togglablesHTML = await createTogglablesTable();
  // });

  Hooks.on("createChatMessage", (message, params, actorId) => {
    if (game.user['role'] < 4) { return; }
    handleChatMessage(message);
  });

  Hooks.on("getSceneControlButtons", (sceneControlButtons) => {
    if (!game.settings.get(MODULE_NAME, "showForPlayers") && game.user['role'] < 3) { 
      return; 
    }
    let tokenButton = sceneControlButtons.find(b => b.name === "token");
    if (!tokenButton) { return; }
    tokenButton.tools.push(
      {
        name: LANG_EFFECT.ButtonsSceneName,
        title: LANG_EFFECT.ButtonsSceneTitle,
        icon: "fas fa-thandul",
        onClick: async () => {
          const selected = getCanvas().tokens.controlled;
          if (selected.length === 0) {
              return ui.notifications.error("You dont have your own token selected");
          }
          if (selected.length > 1) {
            return ui.notifications.error("Please selected a single token");
          }
          await createTogglablesTable();
        },
      }
      // {
      //   name: LANG_EFFECT.ButtonsSceneTitleDialog,
      //   title: LANG_EFFECT.ButtonsSceneTitleDialog,
      //   icon: "fas fa-thandul",
      //   // visible: game.user.isGM,
      //   onClick: async () => {
      //     // await createTogglablesTable();
      //     openDialogThandulsTogglableEffects(togglablesHTML);
      //   },
      //   button: true
      // }
    );
  });

  // ======================================
  // ADVANCED COMBAT
  // ======================================

  // Hooks.on('preCreateToken', (scene,token,options,id) => {
  //   preCreateTokenAdvCbtOpts(scene,token,options,id);
  // });

  // Hooks.on('preUpdateActor', (actor, updateData, diff, id)=>{
  //   preUpdateActorAdvCbtOpts(actor, updateData, diff, id);
  // });

  // Hooks.on(`renderLongRestDialog`, (dialog, html)=> {
  //   renderLongRestDialogAdvCbtOpts(dialog, html);
  // });

  // Hooks.on(`renderShortRestDialog`, (dialog,html) => {
  //   renderShortRestDialogAdvCbtOpts(dialog, html);
  // });

  // Hooks.on('preUpdateToken', (scene,token,update,diff, id)=>{
  //   preUpdateTokenAdvCbtOopts(scene, token, update,diff, id);
  // }

  // =============================
  // CONDITION AUTOMATION
  // =============================

  // Hooks.on("preCreateActiveEffect", async (actor, effects, options, someID) => {
  //     preCreateActiveEffectBlindedFromConditionAutomation(actor, effects);
  // });

  // Hooks.on("preDeleteActiveEffect", async (actor, effects, options, someID) => {
  //     preDeleteActiveEffectBlindedFromConditionAutomation(actor, effects);
  // });

  // Hooks.on("preUpdateToken", (scene, token, update,diff, id) => {
  //   preUpdateTokentBlindedFromConditionAutomation(token,update);
  //   preUpdateTokenFlyFromConditionAutomation(token, update);
  // });
}
