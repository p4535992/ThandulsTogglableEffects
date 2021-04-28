
import { debug } from "../../../ThandulsTogglableEffects";
import { getCanvas } from "../../settings";

export function onChange_Actor(actor, updateData)
{
  let data = {
    actorData : actor.data,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    actorMax : actor.data.data.attributes.hp.max,
    updateHP : (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : 0),
    hpChange : (actor.data.data.attributes.hp.value - (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : actor.data.data.attributes.hp.value))
  };

  if(data.hpChange >= Math.ceil(data.actorMax/2) && data.updateHP !== 0)
  {
    debug(`Massive Actor Damage Detected ${actor.name}`);

    game.socket['emit']('module.advanced-combat-options', { name : "MD", data : data});
    recieveData(data);
  }else{
    debug(`Massive Actor Damage NOT Detected ${actor.name}`); 
  }  
}

export function onChange_Token(token, updateData)
{
  let data = {
    actorData : getCanvas().tokens.get(token._id).actor.data,
    updateData : updateData,
    actorHP : token.actorData.data.attributes.hp.value,
    actorMax : token.actorData.data.attributes.hp.max,
    updateHP : updateData.actorData.data.attributes.hp.value,
    hpChange : (token.actorData.data.attributes.hp.value- updateData.actorData.data.attributes.hp.value)
  }

  if(data.hpChange >= Math.ceil(data.actorMax/2) && data.updateHP !== 0)
  {
    debug(`Massive Token Damage Detected ${token.name}`);

    game.socket['emit']('module.advanced-combat-options', { name : "MD", data : data});
    recieveData(data);
  }else{
    debug(`Massive Token Damage NOT Detected ${token.name}`);
  } 
}

export function recieveData(data)
{
  debug("Recieved Data", data);

  let actor:any = getCanvas().tokens.get(data.actorData.token._id)?.actor ? getCanvas().tokens.get(data.actorData.token._id).actor : game.actors.get(data.actorData._id);

  if(actor.data.permission[game.userId] === CONST.ENTITY_PERMISSIONS.OWNER && !game.user.isGM)
  {
    debug("Entered inside the logic statement --- con save should result");

    actor.rollAbilitySave("con").then((results)  =>{
      if(!results) return;

      setTimeout(()=> {
        if(results.total < 15)
        {
          //fix solution
          game.packs.find(p=>p.metadata.label === "ThandulsTogglableEffects Tables").getContent().then((result) =>{
            if(!result) return;

            let table:any = result.find(r => r.name === "Massive Damage")

            table.draw();
          });
        }
      }, 1000);
    });
  }else if(game.user.isGM && !hasPlayerOwner(data.actorData))
  {
    //maybe do stuff?
    debug("This isn't owned by any player --- default to GM");

    let actor:any = getCanvas().tokens.get(data.actorData.token._id)?.actor ? getCanvas().tokens.get(data.actorData.token._id)?.actor : game.actors.get(data.actorData._id);

    actor.rollAbilitySave("con").then((results)  =>{
      if(!results) return;

      setTimeout(()=> {
        if(results.total < 15)
        {
          game.packs.find(p=>p.title === "ThandulsTogglableEffects Tables").getContent().then((result) =>{
            if(!result) return;

            let table:any = result.find(r => r.name === "Massive Damage; System Shock");

            table.draw();
          });
        }
      }, 1000);
    });
  }
}

function hasPlayerOwner(actorData)
{
  if ( actorData.permission["default"] >= CONST.ENTITY_PERMISSIONS.OWNER ) return true;
  for ( let u of game.users.entities ) {
    if ( u.isGM ) continue;
    if ( actorData.permission[u.id] >= CONST.ENTITY_PERMISSIONS.OWNER ) return true;
  }
  return false;
}