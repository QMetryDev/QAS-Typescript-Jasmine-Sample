import { element, browser, protractor } from 'protractor';
import { LocatorUtils } from '../base/locators';
import { CommonSteps } from '../base/commonsteps';
let locators = new LocatorUtils();
let actions = new CommonSteps();
export class HomePage {
  acceptTerms = function() {
    element(locators.getLocator('home.accept.terms.checkbox.loc'))
      .isDisplayed()
      .then(isDisplayed => {
        if (isDisplayed) {
          actions.click('home.accept.terms.checkbox.loc');
          actions.click('home.accept.terms.btn.loc');
        }
      });
    element(locators.getLocator('home.popup.close.loc'))
      .isDisplayed()
      .then(isDisplayed => {
        if (isDisplayed) {
          actions.click('home.popup.close.loc');
          browser.wait(
            protractor.ExpectedConditions.invisibilityOf(
              element(locators.getLocator('home.popup.close.loc'))
            ),
            10000
          );
        }
      });
  };
  selectLink = function(link) {
    this.acceptTerms();
    if (link == 'REPAIR') {
      actions.click('home.repair.icon.loc');
    } else if (link == 'COMMUNITY') {
      actions.click('home.community.icon.loc');
    } else if (link == 'QUOTE') {
      actions.click('home.quote.icon.loc');
    }
  };

  logout = function() {
    actions.click('home.user.account.loc');
    actions.click('home.logout.loc');
    browser.wait(
      protractor.ExpectedConditions.invisibilityOf(
        element(locators.getLocator('home.logout.loc'))
      ),
      10000
    );
  };
}
