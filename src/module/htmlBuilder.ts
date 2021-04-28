import { isDAEEnabled, isBarbarianClassItem, getDurationData, arrayChunk } from './helpers';
import { ThandulSpells } from './categories/spells';
import { ThandulFeatures } from './categories/features';
import { ThandulConditions } from './categories/conditions';

// import './jquery-ui/external/jquery/jquery.js'
// import './jquery-ui/jquery-ui.min.js';
import { i18n } from '../ThandulsTogglableEffects';
import { LANG_EFFECT } from './helperLang';
import { MODULE_NAME } from './settings';

let currentActive = "Spells";

let dialogContent;

export const nameSpells = "Spells";
export const nameFeatures = "Features";
export const nameConditions = "Conditions";
export const nameLights = "Lights";

export const createTogglablesTable = async function() {

    // Create array of HTML elements for effects enabled in settings.
    let effectsPerRow = parseInt(<string>game.settings.get(MODULE_NAME, "togglesPerRow")) || 4;

    let togglablesSpellsHTML;
    await ThandulSpells.getEnabledEffects()
    .then(enabledEffects =>{
      let html = arrayChunk(enabledEffects, effectsPerRow).map((effects:any) =>
        createEffectsRowHTML(effects)
      ).join('');
      togglablesSpellsHTML =html;
    })
    .catch(error =>
      console.error(error.message)
    );

    let togglablesFeaturesHTML;
    await ThandulFeatures.getEnabledEffects()
    .then(enabledEffects =>{
      let html = arrayChunk(enabledEffects, effectsPerRow).map((effects:any) =>
        createEffectsRowHTML(effects)
      ).join('');
      togglablesFeaturesHTML =html;
    })
    .catch(error =>
      console.error(error.message)
    );

    let togglablesConditionsHTML;
    await ThandulConditions.getEnabledEffects()
    .then(enabledEffects =>{
      let html = arrayChunk(enabledEffects, effectsPerRow).map((conditions:any) =>
      createEffectsRowHTML(conditions)
      ).join('');
      togglablesConditionsHTML =html;
    })
    .catch(error =>
      console.error(error.message)
    );

    let togglablesLightsHTML = createEffectsRowHTML([]);

    // let togglablesLightsHTML;
    // await ThandulBuffsAndEffects.getEnabledLights()
    // .then(enabledEffects =>{
    //   let html = arrayChunk(enabledEffects, effectsPerRow).map(effects => createEffectsRowHTML(effects)).join('');
    //   togglablesEffectsHTML =html;
    // })
    // .catch(error =>
    //   console.error(error.message)
    // );

    // let nameSpells = "Spells";
    // let nameFeatures = "Features";
    // let nameConditions = "Conditions";
    // let nameLights = "Lights";

    // Inspired from https://codepen.io/E-nathan/pen/MXLRdB for manage multitab with vanilla js

    // TODO PREPARE A HTML TEMPLATE FOR BETTER MANTAIN THIS BECAUSE I HATE THIS PIECE OF CODE


    let divsHTMLSpells =
      `<div id="tabdiv-` + nameSpells + `" class="thandulsTogglableEffects-tab-pane ` + (currentActive==nameSpells ? "active" : "") + `">
        <span class="col-md-10">
          ` + togglablesSpellsHTML +  `
        </span>
      </div>`;

    let divsHTMLFeatures =
      `<div id="tabdiv-` + nameFeatures + `" class="thandulsTogglableEffects-tab-pane ` + (currentActive==nameFeatures ? "active" : "") + `">
        <span class="col-md-10">
          ` + togglablesFeaturesHTML +  `
        </span>
      </div>`;

    let divsHTMLConditions =
       `<div id="tabdiv-` +  nameConditions + `" class="thandulsTogglableEffects-tab-pane ` + (currentActive==nameConditions ? "active" : "") + `">
         <span class="col-md-10">
           ` + togglablesConditionsHTML +  `
        </span>
      </div>`;

    let divsHTMLLights =
      `<div id="tabdiv-` +  nameLights + `" class="thandulsTogglableEffects-tab-pane ` + (currentActive==nameLights ? "active" : "") + `">
        <span class="col-md-10">
          ` + togglablesLightsHTML +  `
        </span>
      </div>`;

    
    let tabsHTML =
    `<div id="tabs" class="thandulsTogglableEffects-container--tabs">
      <section class="row" id="thandulsTogglableEffects-tab-row">
        <ul class="nav nav-tabs">

          <li id="thandulsTogglableEffects-tab-` + nameSpells +
           `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameSpells ? "active" : "") + 
           `"><p id="thandulsTogglableEffects-tablink-` + nameSpells + `" >` + nameSpells + `</p></li>

          <li id="thandulsTogglableEffects-tab-` + nameFeatures + 
          `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameFeatures ? "active" : "") + 
          `"><p id="thandulsTogglableEffects-tablink-` + nameFeatures + `" >` + nameFeatures + `</p></li>

          <li id="thandulsTogglableEffects-tab-` + nameConditions + 
          `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameConditions ? "active" : "") + 
          `"><p id="thandulsTogglableEffects-tablink-` + nameConditions + `" >` + nameConditions + `</p></li>

          <li id="thandulsTogglableEffects-tab-` + nameLights + 
          `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameLights ? "active" : "") +
          `"><p id="thandulsTogglableEffects-tablink-` + nameLights + `" >` + nameLights + `</p></li>

        </ul>
        <div class="thandulsTogglableEffects-tab-content">
          ` + divsHTMLSpells +  `
          ` + divsHTMLFeatures +  `
          ` + divsHTMLConditions +  `
          ` + divsHTMLLights +  `
        </div>
      </section>
    </div>`;

    /*
    let tabsHTML =
    `<div id="tabs" class="thandulsTogglableEffects-container--tabs">
        <ul class="nav nav-tabs">
          <li id="thandulsTogglableEffects-tab-` + nameSpells + `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameSpells ? "active" : "") + `"><a id="thandulsTogglableEffects-tablink-` + nameSpells + `" href="#tabdiv-` + nameSpells + `" >` + nameSpells + `</a></li>
          <li id="thandulsTogglableEffects-tab-` + nameFeatures + `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameFeatures ? "active" : "") + `"><a id="thandulsTogglableEffects-tablink-` + nameFeatures + `" href="#tabdiv-` + nameFeatures + `" >` + nameFeatures + `</a></li>
          <li id="thandulsTogglableEffects-tab-` + nameConditions + `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameConditions ? "active" : "") + `"><a id="thandulsTogglableEffects-tablink-` + nameConditions + `" href="#tabdiv-` + nameConditions + `" >` + nameConditions + `</a></li>
          <li id="thandulsTogglableEffects-tab-` + nameLights + `" class="thandulsTogglableEffects-tablinks ` + (currentActive==nameLights ? "active" : "") + `"><a id="thandulsTogglableEffects-tablink-` + nameLights + `" href="#tabdiv-` + nameLights + `" >` + nameLights + `</a></li>
        </ul>
        
          ` + divsHTMLSpells +  `
          ` + divsHTMLFeatures +  `
          ` + divsHTMLConditions +  `
          ` + divsHTMLLights +  `
        
    </div>`;
    */
    let togglablesHTML = "<div class=\"thandulTogglables\">"+ tabsHTML +"</div>";

    // Extract token controls button for this module.
    let thandulControl = document.querySelector('li[data-tool="'+LANG_EFFECT.ButtonsSceneName+'"]');
    if(!thandulControl) { 
      return; 
    }

    // Try extracting existing div element with effect togglables and remove it.
    let togglablesDiv = thandulControl.getElementsByClassName('thandulTogglables')[0];
    if (togglablesDiv) { thandulControl.removeChild(togglablesDiv); }

    // Insert new HTML for togglables div.
    thandulControl.insertAdjacentHTML('beforeend', togglablesHTML);
    // thandulControl.querySelectorAll('div.thandulTogglables li').forEach(element => {
    //     element.addEventListener("click", ThandulBuffsAndEffects.handleEffectToggleEvent);
    // });

    thandulControl.querySelectorAll('li.thandulsTogglableEffects-effect').forEach(element => {
      if(element.parentElement.parentElement.parentElement.id==("tabdiv-" +  nameSpells)){
        element.addEventListener("click", ThandulSpells.handleEffectToggleEvent);
      }else if(element.parentElement.parentElement.parentElement.id==("tabdiv-" +  nameFeatures)){
        element.addEventListener("click", ThandulFeatures.handleEffectToggleEvent);
      }else if(element.parentElement.parentElement.parentElement.id==("tabdiv-" +  nameConditions)){
        element.addEventListener("click", ThandulConditions.handleEffectToggleEvent);
      }else if(element.parentElement.parentElement.parentElement.id==("tabdiv-" +  nameLights)){
        //element.addEventListener("click", ThandulLights.handleEffectToggleEvent);
      }
    });

    thandulControl.querySelectorAll('li.thandulsTogglableEffects-tablinks').forEach(element2 => {
      element2.addEventListener("click", (event) => {
        openTab(event,element2);
      });
    });

    return togglablesHTML;
  }

  export const openDialogThandulsTogglableEffects = function(dialogContent) {
    let d = new Dialog({
      title: LANG_EFFECT.ButtonsSceneTitleDialog,
      content: dialogContent,
      buttons: {
          // done: {
          //     label: "Send to Chat!",
          //     callback: (html) => {
          //         ThandulsTogglableEffectsMessage(html, "chat");
          //         d.render(true);
          //     }
          // },
          // show: {
          //     label: "Show pop out!",
          //     callback: (html) => {
          //         ThandulsTogglableEffectsMessage(html, "popout");
          //         d.render(true);
          //     }
          // }
          // yes: {
          //   icon: "<i class='fas fa-check'></i>",
          //   label: `Apply Changes`,
          //   callback: () => {}
          // },
          // no: {
          //   icon: "<i class='fas fa-times'></i>",
          //   label: `Cancel Changes`,
          //   callback: () => {}
          // },
      },
      default: "show" 
      // close: html => {}  
    });
    d.render(true)
  }


  function createEffectsRowHTML(effects) {
    // return `<ul>` + effects.map(effect => `
    //     <li class="thandulsTogglableEffects-effect" data-effect-name="` + effect.name + `">
    //         <div data-effect-name="` + effect.name + `">
    //             <img src="` + effect.icon + `" data-effect-name="` + effect.name + `"/>
    //             <p data-effect-name="` + effect.name + `">` + effect.name + `</p>
    //         </div>
    //     </li>`
    // ) + `</ul>`;
    let list = "";
    effects.map(effect => {
      list += `
        <li class="thandulsTogglableEffects-effect" data-effect-name="` + effect.name + `">
            <div data-effect-name="` + effect.name + `">
                <img src="` + effect.icon + `" data-effect-name="` + effect.name + `"/>
                <p data-effect-name="` + effect.name + `">` + effect.name + `</p>
            </div>
        </li>`;
    });
    return `<ul>` + list + `</ul>`;
  } 

/**
 * TODO I HATE THIS CODE ASK TO SOMEONE MORE SKILLED FOR UPGRADE
 * @param tabClickEvent
 */
export const openTab = function (tabClickEvent, element) {// thandulsTogglableEffects-tab-Effects
  //if(tabClickEvent && tabClickEvent.currentTarget.parentNode){
  if(tabClickEvent && tabClickEvent.currentTarget){
      var tabName = element.id;
      var clickedTab = tabClickEvent.currentTarget;
      var clickedTabLinkId = tabClickEvent.target.id;//thandulsTogglableEffects-tablink-Conditions

      var tabParent = document.getElementById("thandulsTogglableEffects-tab-row");//tabClickEvent.currentTarget.parentNode.parentNode.parentNode;
      var theTabs = tabParent.querySelectorAll("ul.nav-tabs > li.thandulsTogglableEffects-tablinks");
      for (var i = 0; i < theTabs.length; i++) {
          theTabs[i].classList.remove("active");
      }
      //clickedTab.classList.add("active");
      tabClickEvent.preventDefault();
      var contentPanes = tabParent.querySelectorAll(".thandulsTogglableEffects-tab-pane");
      for (i = 0; i < contentPanes.length; i++) {
          contentPanes[i].classList.remove("active");
      }

      // var anchorReference = tabClickEvent.target;
      // var activePaneId = anchorReference.getAttribute("href");
      // var activePane = tabParent.querySelector(activePaneId);

      var s = tabName.split("thandulsTogglableEffects-tab-").join("");
      var t = document.getElementById(tabName).innerText;//clickedTabLinkId.split("thandulsTogglableEffects-tablink-").join("") ;
      var activePane = document.getElementById(tabName);
      if(s == t){
          activePane.classList.add("active");
          document.getElementById("tabdiv-"+s).style.display = "block";
          currentActive = t;
      }else{
          activePane.classList.remove("active");
          document.getElementById("tabdiv-"+s).style.display = "none";
      }


  }
}

/**
 * TODO I HATE THIS CODE ASK TO SOMEONE MORE SKILLED FOR UPGRADE
 * @param tabClickEvent
 */
export const openTab2 = function (tabName) {// thandulsTogglableEffects-tab-Effects
  var tabParent = document.getElementById("thandulsTogglableEffects-tab-row");//tabClickEvent.currentTarget.parentNode.parentNode.parentNode;
  var theTabs = tabParent.querySelectorAll("ul.nav-tabs > li.thandulsTogglableEffects-tablinks");
  for (var i = 0; i < theTabs.length; i++) {
      theTabs[i].classList.remove("active");
  }
  var contentPanes = tabParent.querySelectorAll(".thandulsTogglableEffects-tab-pane");
  for (i = 0; i < contentPanes.length; i++) {
      contentPanes[i].classList.remove("active");
  }
  var s = tabName.split("thandulsTogglableEffects-tab-").join("");
  var t = document.getElementById(tabName).innerText;//clickedTabLinkId.split("thandulsTogglableEffects-tablink-").join("") ;
  var activePane = document.getElementById(tabName);
  if(s == t){
      activePane.classList.add("active");
      document.getElementById("tabdiv-"+s).style.display = "block";
      currentActive = t;
  }else{
      activePane.classList.remove("active");
      document.getElementById("tabdiv-"+s).style.display = "none";
  }
}

