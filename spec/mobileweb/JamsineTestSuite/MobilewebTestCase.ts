/**
* @author: ankit.detroja
*
*/

import { browser, by, element, protractor } from 'protractor';
import { LocatorUtils } from '../../../base/locators';
import { CommonSteps } from '../../../base/commonsteps';
let actions = new CommonSteps();

describe("mobileweb", function() {
  browser.waitForAngularEnabled(false);
  browser.get(browser.baseUrl);
 
  it("mobileweb", async function() {
    
         await actions.get("https://www.gmail.com"); 
         await actions.clear("email.identifierid_1"); 
         await actions.sendKeys("demoqas2019@gmail.com" , "email.identifierid_1"); 
         await actions.verifyValue("email.identifierid_1" ,"demoqas2019@gmail.com"); 
         await actions.verifyPresent("div.div11111_2"); 
         await actions.click("div.div11111_1_1"); 
         await actions.waitForVisible("password.qas2019_1"); 
         await actions.clear("password.qas2019_1"); 
         await actions.sendKeys("QAS@2019" , "password.qas2019_1"); 
         
         await actions.verifyValue("password.qas2019_1" ,"QAS@2019"); 
         await actions.verifyPresent("span.span1111_1"); 
         await actions.click("span.span1111_1"); 
  });
  
});
