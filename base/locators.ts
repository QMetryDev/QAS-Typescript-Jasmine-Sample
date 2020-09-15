import * as configurationmanager from "./configurationmanager";
export class LocatorUtils {
  getLocator(locator, ...text) {
    let description;
    if (
      configurationmanager.ConfigurationManager.getBundle().get(locator) !==
      undefined &&
      configurationmanager.ConfigurationManager.getBundle().get(locator) !==
      null
    ) {
      locator = configurationmanager.ConfigurationManager.getBundle().get(
        locator
      );
    } else {
    }

    try {
      let locatorJson = locator;
      locator = JSON.parse(locatorJson)['locator'];
      description = JSON.parse(locatorJson)['desc'];
    } catch (e) {
      try {
        let locatorJson = locator.replace(/\\\\/g, '\\').replace(/\\\"/g, '"');
        locator = JSON.parse(locatorJson)['locator'];
        description = JSON.parse(locatorJson)['desc'];
      } catch (error) {
        description = locator;
      }
    }
    let actualLocatorString = locator;
    let locatorType = locator.split("=", 1);
    let locValue = locator.substring(locator.indexOf("=") + 1);
    locValue = locValue.replace(/'/g, "\\'");
    let eleLocator = "by." + locatorType + "('" + locValue + "')";
    if (text && text.length > 0) {
      eleLocator = eleLocator.replace("%s", text[0]);
    }
    try {
      return { actualLocatorString, locator: eval(eleLocator), description };
    } catch (error) {
      expect(error).toBeUndefined("Error:" + JSON.stringify(error));
    }
  }
}
