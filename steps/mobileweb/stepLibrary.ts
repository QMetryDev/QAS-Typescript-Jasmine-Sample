/**
* @author: kumar.shanu
*
*/
var commonStepsModule = require('../../base/commonsteps');
let actions = new commonStepsModule.CommonSteps();

export async function customStepLibrary(Qmetry){
     
     //Custom steps
     await actions.get("https://www.google.co.in"); 
     
    }


