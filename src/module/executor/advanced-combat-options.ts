import { debug, log } from "../../ThandulsTogglableEffects";
import { MODULE_NAME } from "../settings";
import * as LI_module from '../macros/mix/lingering-injuries';
import * as MD_module from  '../macros/mix/massive-damage';
import * as TH_module from  '../macros/mix/token_hp';
import * as UE_module from  '../macros/mix/unconscious_exhaustion';
import * as HS_module from  '../macros/features/healing_surge';
import * as ER_module from  '../macros/mix/exhaustion_recovery';

export const renderShortRestDialogAdvCbtOpts = function(dialog,html){
    log(`Render Short Rest Dialog Capture`);
    debug(`Hooks | Render Short Rest Dialog | Variables | `, dialog,html);
    if(game.settings.get(MODULE_NAME,'HS-SETTING'))
    {

      let previousHD = 0, previousHP = 0, recoveredHD = 0, spentHD = 0, recoveredHP = 0;
      dialog.actor.items.filter(i=>i.data.type === "class").reduce((item)=>{
        previousHD += item.data.data.hitDiceUsed;
      });

      previousHP = dialog.actor.data.data.attributes.hp.value;

      document.getElementById(`short-rest-hd`)[3].addEventListener("click", async () => {
        //spentHD = await HS_module.onChange_Actor(dialog.actor,"shortrest", previousHD);
        await HS_module.onChange_Actor(dialog.actor,"shortrest");
      });

      //hit die & chat message messing with
      let hookID:any = Hooks.on(`preCreateChatMessage`, (message,options,userId) =>{
        log(`Pre Create Chat message | `, message);
        if(message.content.includes(`takes a short rest spending`))
        {
          let updated_actor = game.actors.get(dialog.actor.id);

          updated_actor.items.filter(i=>i.data.type === "class").reduce((item)=>{
            return recoveredHD += item.data.data['hitDiceUsed']; //amount of hitdie that are missing
          });

          recoveredHD -= previousHD;

          recoveredHP = updated_actor.data.data['attributes'].hp.value - previousHP;

          let newMessage = message.content.substr(0, message.content.indexOf('spending'));
          newMessage += `recovered ${recoveredHD} Hit Dice and spent ${spentHD} Hit Dice recovering ${recoveredHP} Hit Points.`;

          setProperty(message, "content", newMessage);
          previousHD = 0, previousHP = 0, recoveredHD = 0, spentHD = 0, recoveredHP = 0;

          Hooks.off(`preCreateChatMessage`, hookID);
        }
      });
    }
}

export const renderLongRestDialogAdvCbtOpts = function(dialog,html){
    log(`Render Long Rest Dialog Capture`);
    debug(`Hooks | Render Long Rest Dialog | Variables | `, dialog,html);
    if(game.settings.get(MODULE_NAME,'HS-SETTING'))
    {
      document.getElementById(`long-rest`)[1].addEventListener("click", async () => {
        await HS_module.onChange_Actor(dialog.actor,"longrest");
      });
    }

    if(game.settings.get(MODULE_NAME,'ER-SETTING'))
    {
      document.getElementById(`long-rest`)[1].addEventListener("click", async () => {
        await ER_module.onChange_Actor(dialog.actor,"longrest");
      });
    }
}

export const preUpdateTokenAdvCbtOpts = function(scene,token,updateData,diff, id){
    log("Pre Update Token Capture");
    debug("Pre Update Token | ",scene,token,updateData,diff,id);

    //Lingering Injuries
    if(game.settings.get(MODULE_NAME,'LI-SETTING') && hasProperty(updateData, "actorData.data.attributes.hp.value"))
    {
        LI_module.onChange_Token(token,updateData);
    }

    //Massive Damage
    if(game.settings.get(MODULE_NAME,'MD-SETTING') && hasProperty(updateData, "actorData.data.attributes.hp.value"))
    {
        MD_module.onChange_Token(token,updateData);
    }
}

export const preUpdateActorAdvCbtOpts = function(actor, updateData, diff, id){
    log("Pre Update Actor Capture");
    debug("Pre Update Actor | ",actor,updateData,diff,id);

    //Lingering Injuries
    if(game.settings.get(MODULE_NAME,'LI-SETTING'))
    {
      LI_module.onChange_Actor(actor,updateData);
    }

    //Massive Damage
    if(game.settings.get(MODULE_NAME,'MD-SETTING') && hasProperty(updateData, "data.attributes.hp.value"))
    {
      MD_module.onChange_Actor(actor,updateData);
    }

    //Unconscious Exhaustion
    if(game.settings.get(MODULE_NAME,'UE-SETTING') && hasProperty(updateData, "data.attributes.hp.value"))
    {
      UE_module.onChange_Actor(actor,updateData);
    }

    //Exhaustion Status (change some values maybe, mostly display and death id say.)
}

export const preCreateTokenAdvCbtOpts = function(scene,token,options,id){
    log("Pre Create Token Capture");
    debug("Pre Create Token | ", scene,token,options,id);

    TH_module.onCreate(scene,token);
}