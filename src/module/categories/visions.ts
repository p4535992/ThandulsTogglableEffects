import {retrieveEffectFromCompendium, isDAEEnabled, isBarbarianClassItem, getDurationData, arrayChunk, getDurationDataForEffect, ACTIVE_EFFECT_MODES} from '../helpers.js';
import { i18n } from '../../ThandulsTogglableEffects';
import { getCanvas } from '../settings.js';
export class ThandulVisions {

    static getEnabledEffects() {
        let enabledEffects = [];
        
        // enabledEffects.push(this.blinded());
        
        return enabledEffects;
    }
    
    static handleEffectToggleEvent(toggleEvent) {
        const updates = [];
        for (let token of getCanvas().tokens.controlled ) {
            const actor = token.actor;
        // for (const actor of getCanvas().tokens.controlled.map(token => token.actor)) {
            let toggledEffect = ThandulVisions.getEffectForActor(actor, toggleEvent);
            if (!toggledEffect) { continue; }
            if(toggledEffect.effects){
                toggledEffect = toggledEffect.effects.find(effect => effect.label == toggledEffect.label);
            }
            let effectToRemove = actor.data.effects.find(effect => effect.label == toggledEffect.label);
            if(effectToRemove){ 
                actor.deleteEmbeddedEntity("ActiveEffect", effectToRemove._id);
            }else{
                actor.createEmbeddedEntity("ActiveEffect", toggledEffect);
            }          
        }
        if(updates.length>0){
            // use canvase.tokens.updateMany instead of token.update to prevent race conditions
            // (meaning not all updates will be persisted and might only show locally)
            getCanvas().tokens.updateMany(updates);
        }
    }  

    static getEffectForActor(actor, toggleEvent) {
        let effect:any = {};
        switch(toggleEvent.target.dataset.effectName) {

            // =======================
            // VISIONS
            // =======================

            // case "Blinded": effect = this.blinded(); break;

            default: return undefined;
        }
        effect.origin = "Actor." + actor.id;
        return effect;
    }

    //value="0" Custom
    //value="1" Multiply
    //value="2" Add
    //value="3" Downgrade
    //value="4" Upgrade
    //value="5" Override

    
}
