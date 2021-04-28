import { ThandulFeatures } from './categories/features';
import {ThandulSpells} from './categories/spells.js';
import { LANG_EFFECT } from './helperLang';
import { MODULE_NAME } from './settings';
import { ThandulBuffsAndEffects } from './ThandulBuffsAndEffects';

export const handleChatMessage = function(message) {
    if (!game.settings.get(MODULE_NAME, "enableAutomation")) { 
        return; 
    }
    const itemIdRegex = /data-item-id="(.*?)"/gm;

    const messageData = message.data;
    const matchResults = itemIdRegex.exec(messageData.content);
    console.warn("matchResults:" + matchResults);
    if(!matchResults) {
        return;
    }

    const itemId = matchResults.length > 1 ? matchResults[1] : null;
    console.warn("itemId:" + itemId);
    if (!itemId) {
        return;
    }

	const actorId = messageData.speaker.actor || null;
    console.warn("actorId:" + actorId);
    if (!actorId) {
        return;
    }

    const actor:any = game.actors.get(actorId);
    console.warn("actor:" + actor);
    if (!actor || actor.permission < 3) {
        return;
    }

    const item = actor.getOwnedItem(itemId);
    console.warn("item:" + item);
    if (!item) {
        return;
    }

    let togglableEffect = ThandulBuffsAndEffects.effects.find(effect => effect.name == item.name);
    console.warn("togglableEffect:" + togglableEffect);
    if (!togglableEffect) { return; }
    let effect:any = {};
    let customEffectValue;
    switch (togglableEffect.name) {
    //switch (item.name) {
        case LANG_EFFECT.spellBarkskin: effect = ThandulSpells.barkskin(); break;
        case LANG_EFFECT.featureRage: effect = ThandulFeatures.rage(); break;
        case LANG_EFFECT.spellMageArmor: effect = ThandulSpells.mageArmor(actor.data.data['abilities'].dex.mod); break;
        case LANG_EFFECT.spellShield: effect = ThandulSpells.shield(); break;
        case LANG_EFFECT.featureSharpshooter : effect = ThandulFeatures.sharpShooter(); break;
        case LANG_EFFECT.featureGreatWeaponMaster : effect = ThandulFeatures.greaterWeaponMastery(); break;
        default: break;
    }
    effect.origin = "Actor." + actor.id;

    let effectToRemove = actor.data.effects.find(e => e['label'] == effect.label);
    if (effectToRemove) {
        actor.deleteEmbeddedEntity("ActiveEffect", effectToRemove._id);
    }
    actor.createEmbeddedEntity("ActiveEffect", effect);
    // if (effectToRemove) {
    //     actor.deleteOwnedItem(effectToRemove['_id']);
    // }
    // actor.createOwnedItem(effect);
    return effect;
}
