import { element } from "protractor";
import {} from "jasmine";
import { LocatorUtils } from "./locators";
let locatorUtil = new LocatorUtils();
export let Validator = function() {
  this.verifyText = function(locator, expectedText) {
    expect(element(locatorUtil.getLocator(locator)).getText()).toBe(
      expectedText
    );
  };

  this.verifyPartialText = function(locator, expectedText) {
    expect(element(locatorUtil.getLocator(locator)).getText()).toContain(
      expectedText
    );
  };

  this.verifyPresent = function(locator) {
    expect(element(locatorUtil.getLocator(locator)).isPresent()).toBeTruthy();
  };

  this.verifyNotPresent = function(locator) {
    expect(element(locatorUtil.getLocator(locator)).isPresent()).toBeFalsy();
  };

  this.verifyVisible = function(locator) {
    expect(element(locatorUtil.getLocator(locator)).isDisplayed()).toBeTruthy();
  };

  this.verifyNotVisible = function(locator) {
    if (element(locatorUtil.getLocator(locator)).isPresent()) {
      expect(
        element(locatorUtil.getLocator(locator)).isDisplayed()
      ).toBeFalsy();
    }
  };

  this.verifyAttribute = function(locator, attribute, expectedValue) {
    expect(
      element(locatorUtil.getLocator(locator)).getAttribute(attribute)
    ).toBe(expectedValue);
  };
};
