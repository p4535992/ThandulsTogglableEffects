import { MODULE_NAME } from "../settings";
//@ts-ignore
// import {TokenMagic} from '../../../tokenmagic/module/tokenmagic.js';

// export const preCreateActiveEffectBlindedFromConditionAutomation = function(actor, effects){
//     const blindedSetting = game.settings.get('condition-automation', 'Blinded');
//     const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
//     let blinded = effects.label === blindStatus;
//     let token = actor.getActiveTokens()[0]
//     let actorToken = game.actors.get(actor.data._id)
//     if (blinded) {
//         switch (blindedSetting) {
//             case 1: {
//                 actorToken.setFlag('condition-automation', 'sightAngleOld', actorToken.data.token.sightAngle)
//                 token.update({ "sightAngle": 1 });
//                 actorToken.update({ "token.sightAngle": 1 })
//             }
//                 break;
//             case 2: {
//                 token.update({ "vision": false });
//                 actorToken.update({ "token.vision": false })
//             }
//                 break;
//             case 3: {
//                 let oldVision = token.getFlag('perfect-vision', 'sightLimit');
//                 token.setFlag('condition-automation', 'PVold', oldVision);
//                 token.setFlag('perfect-vision', 'sightLimit', 0);
//                 actorToken.setFlag('perfect-vision', 'sightLimit', 0);
//             }
//                 break;
//         }
//     }
// }

// export const preDeleteActiveEffectBlindedFromConditionAutomation = function(actor, effects){
//     const blindedSetting = game.settings.get('condition-automation', 'Blinded');
//     const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
//     let blinded = effects.label === blindStatus;
//     let token = actor.getActiveTokens()[0]
//     let actorToken = game.actors.get(actor.data._id)
//     if (blinded) {
//         switch (blindedSetting) {
//             case 1: {
//                 let visionArc = actorToken.getFlag('condition-automation', 'sightAngleOld')
//                 token.update({ "sightAngle": visionArc });
//                 actorToken.update({ "token.sightAngle": visionArc })
//             }
//                 break;
//             case 2: {
//                 token.update({ "vision": true });
//                 actorToken.update({ "token.vision": true })
//             }
//                 break;
//             case 3: {
//                 let oldVision = token.getFlag('condition-automation', 'PVold');
//                 if (oldVision) {
//                     token.setFlag('perfect-vision', 'sightLimit', oldVision);
//                     actorToken.setFlag('perfect-vision', 'sightLimit', oldVision);
//                 }
//                 else {
//                     token.unsetFlag('perfect-vision', 'sightLimit');
//                     actorToken.unsetFlag('perfect-vision', 'sightLimit');
//                 }
//                 break;
//             }
//         }
//     }
// }

// export const preUpdateTokentBlindedFromConditionAutomation = function(token, update){
//     // if(!game.user === game.users.find((u) => u.isGM && u.active)) return;
//     if(game.user.isGM && game.user.active) return;
//     if(game.settings.get(MODULE_NAME, 'npcVision') === false) return;
//     let tokenInstance = canvas.tokens.get(token._id)
//     const blindedSetting = game.settings.get(MODULE_NAME, 'Blinded');
//     const blindStatus = game.settings.get(MODULE_NAME, 'BlindStatus');
//     if (!update?.actorData?.effects) return;
//     let blinded = update.actorData.effects.find(i => i.label.toLowercase().startsWith("blind"));
//     let currentlyBlinded = token.actorData?.effects?.find(i => i.label.toLowercase().startsWith("blind"))
//     if (blinded && !currentlyBlinded) {
//         switch (blindedSetting) {
//             case 1: {
//                 tokenInstance.setFlag(MODULE_NAME, 'sightAngleOld', token.sightAngle)
//                 update.sightAngle = 1;
//             }
//                 break;
//             case 2: {
//                 update.vision = false;
//             }
//                 break;
//             case 3: {
//                 let oldVision = tokenInstance.getFlag('perfect-vision', 'sightLimit');
//                 tokenInstance.setFlag(MODULE_NAME, 'PVold', oldVision);
//                 tokenInstance.setFlag('perfect-vision', 'sightLimit', 0);
//             }
//                 break;
//         }
//     }
//     else if (!blinded && currentlyBlinded) {
//         switch (blindedSetting) {
//             case 1: {
//                 let visionArc = tokenInstance.getFlag(MODULE_NAME, 'sightAngleOld')
//                 update.sightAngle = visionArc;
//                 tokenInstance.unsetFlag(MODULE_NAME, 'sightAngleOld')
//             }
//                 break;
//             case 2: {
//                 update.vision = true;
//             }
//                 break;
//             case 3: {
//                 let oldVision = tokenInstance.getFlag(MODULE_NAME, 'PVold');
//                 if (typeof oldVision !== 'number') oldVision = ""
//                 tokenInstance.setFlag('perfect-vision', 'sightLimit', oldVision);
//                 tokenInstance.unsetFlag(MODULE_NAME, 'PVold');
//             }
//                 break;
//         }
//     }
// }

// export const preUpdateTokenFlyFromConditionAutomation = async function(token, updateData){
//     const shadowSetting = game.settings.get(MODULE_NAME, 'shadows');
//     let elevation = getProperty(updateData, "elevation");
//     let tokenInstance = canvas.tokens.get(token._id);
//     let CAEffectId = "ConditionAutomationShadows"
//     let bulge1:any =
//         {
//             filterType: "twist",
//             filterId: CAEffectId,
//             autoDestroy: true,
//             padding: 10,
//             radiusPercent: 600,
//             angle: 0,
//             animated:
//             {
//                 angle:
//                 {
//                     active: true,
//                     animType: "syncSinOscillation",
//                     loopDuration: 6000,
//                     val1: -0.03 * Math.PI,
//                     val2: +0.03 * Math.PI
//                 }
//             }
//         }
//         let bulge2:any =
//         {
//             filterType: "bulgepinch",
//             filterId: CAEffectId,
//             padding: 10,
//             autoDestroy: true,
//             strength: 0,
//             zIndex: 2,
//             radiusPercent: (elevation * 5),
//             animated:
//             {
//                 strength:
//                 {
//                     active: true,
//                     animType: "syncCosOscillation",
//                     loopDuration: 6000,
//                     val1: 0.3,
//                     val2: .35
//                 }
//             }
//         }
//     let shadow = {
//         filterType: "shadow",
//         filterId: CAEffectId,
//         rotation: 35,
//         autoDestroy: true,
//         blur: 2,
//         quality: 5,
//         distance: elevation,
//         alpha: 0.33,
//         padding: 10,
//         shadowOnly: false,
//         color: 0x000000,
//         animated:
//         {
//             blur:
//             {
//                 active: true,
//                 loopDuration: 6000,
//                 animType: "syncCosOscillation",
//                 val1: 2,
//                 val2: 3
//             },
//             distance:
//             {
//                 active: true,
//                 loopDuration: 6000,
//                 animType: "syncSinOscillation",
//                 val1: 75,
//                 val2: 80
//             },
//             alpha:
//             {
//                 active: true,
//                 loopDuration: 6000,
//                 animType: "syncSinOscillation",
//                 val1: .33,
//                 val2: .2
//             }
//         }
//     };
//     if (elevation === undefined || shadowSetting === "off") {
//         return;
//     }
//     let params = [shadow]
//     if(shadowSetting === "bulge") params = [shadow, bulge1, bulge2]

//     let filter = (elevation > 5) ? true : false;
//     console.log(params)
//     await tokenInstance.TMFXdeleteFilters(CAEffectId)
//     if (filter) {
//         await TokenMagic.addUpdateFilters(tokenInstance, params);
//     }
// }