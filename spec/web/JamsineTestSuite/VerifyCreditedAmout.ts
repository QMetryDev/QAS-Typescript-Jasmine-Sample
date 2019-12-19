/**
* @author: nidhi.shah
*
*/

import { browser, by, element, protractor } from 'protractor';
import { LocatorUtils } from '../../../base/locators';
import { CommonSteps } from '../../../base/commonsteps';
let actions = new CommonSteps();

describe("web", function () {
  browser.waitForAngularEnabled(false);
  browser.get(browser.baseUrl);

  it("VerifyCreditedAmout", async function () {

    await actions.get("https://qas.qmetry.com/bank/");
    await actions.clear("text.txtusername");
    await actions.sendKeys("Bob", "text.txtusername");
    await actions.clear("password.txtpassword");
    await actions.sendKeys("Bob", "password.txtpassword");
    await actions.click("button.btnlogin");
    await actions.verifyVisible("button.button");
    await actions.clear("number.enteramountforcredit");
    await actions.sendKeys("1000", "number.enteramountforcredit");
    await actions.click("button.button11");
    await actions.verifyPresent("div.div");
    await actions.click("button.button");
    await actions.verifyVisible("button.btnlogin");
  });

});
