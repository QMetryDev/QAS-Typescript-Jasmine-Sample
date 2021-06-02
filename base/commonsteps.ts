import { browser, by, element, protractor } from "protractor";
import { LocatorUtils } from "./locators";
import { ConfigurationManager } from "./configurationmanager";
let properties = ConfigurationManager.getBundle();

var EC = protractor.ExpectedConditions;
let locatorUtil = new LocatorUtils();
let jsScript=`function simulateDragDrop(sourceNode, destinationNode) {
	var EVENT_TYPES = {
	DRAG_END: 'dragend',
	DRAG_START: 'dragstart',
	DROP: 'drop'
	}

	function createCustomEvent(type) {
	var event = new CustomEvent("CustomEvent")
	event.initCustomEvent(type, true, true, null)
	event.dataTransfer = {
	data: {
	},
	setData: function(type, val) {
	this.data[type] = val
	},
	getData: function(type) {
	return this.data[type]
	}
	}
	return event
	}

	function dispatchEvent(node, type, event) {
	if (node.dispatchEvent) {
	return node.dispatchEvent(event)
	}
	if (node.fireEvent) {
	return node.fireEvent("on" + type, event)
	}
	}

	var event = createCustomEvent(EVENT_TYPES.DRAG_START)
	dispatchEvent(sourceNode, EVENT_TYPES.DRAG_START, event)

	var dropEvent = createCustomEvent(EVENT_TYPES.DROP)
	dropEvent.dataTransfer = event.dataTransfer
	dispatchEvent(destinationNode, EVENT_TYPES.DROP, dropEvent)

	var dragEndEvent = createCustomEvent(EVENT_TYPES.DRAG_END)
	dragEndEvent.dataTransfer = event.dataTransfer
	dispatchEvent(sourceNode, EVENT_TYPES.DRAG_END, dragEndEvent)
	}`;

export class CommonSteps {
	public async addLocator(locatorName, functionOrScript) {
		await by.addLocator(locatorName, functionOrScript);
	}

	public async bindElement(name) {
		return await element(by.binding(name));
	}
	public async expectBinding(name) {
		return await by.exactBinding(name);
	}

	public async waitForPresence(locator) {
		var until = protractor.ExpectedConditions;
		await browser.wait(
			until.presenceOf(element(locatorUtil.getLocator(locator).locator)),
			5000,
			"Element (" +
			locatorUtil.getLocator(locator).description +
			") taking too long to appear in the DOM"
		);
	}
	public async get(url) {
		await browser.get(url);
	}

	public async sendKeys(val, locator) {
		this.waitForPresence(locator);
		if (val.startsWith("${")) {
			val = properties.get(val.substring(2, val.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.sendKeys(val)
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}
	public async comment(value) {
		console.log(this.processValue(value));
	}
	public async changeLocale(locale) {
		ConfigurationManager.defaultLocale = locale;
		ConfigurationManager.setup();
	}
	public processValue(value) {
		if (value.startsWith("${")) {
			value = properties.get(value.substring(2, value.length - 1));
		}
		return value;
	}
	public async click(locator) {
		await this.waitForPresence(locator);

		await element(locatorUtil.getLocator(locator).locator)
			.click()
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}

	public async submit(locator) {
		await this.waitForPresence(locator);

		await element(locatorUtil.getLocator(locator).locator)
			.submit()
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}

	public async clear(locator) {
		await this.waitForPresence(locator);

		await element(locatorUtil.getLocator(locator).locator)
			.clear()
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}

	public async mouseOver(locator) {
		await this.waitForPresence(locator);
		await browser
			.actions()
			.mouseMove(element(locatorUtil.getLocator(locator).locator))
			.perform();
	}

	public async select(val, locator) {
		this.waitForPresence(locator);
		if (val.startsWith("${")) {
			val = properties.get(val.substring(2, val.length - 1));
		}
		await element(by.cssContainingText('option', val)).click()
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}
	public async verifyTitle(title) {
		if (title.startsWith("${")) {
			title = properties.get(title.substring(2, title.length - 1));
		}
		browser.getTitle().then(pageTitle => {
			expect(title).toEqual(
				pageTitle,
				"Page Title should be " + title + ", actual is " + pageTitle
			);
		});
	}

	public async verifyPresent(locator) {
		expect(
			await element(locatorUtil.getLocator(locator).locator).isPresent()
		).toBe(
			true,
			"Element (" +
			locatorUtil.getLocator(locator).description +
			") should be present"
		);
	}

	public async verifyLinkPresent(link) {
		expect(await element(by.linkText(link)).isPresent()).toBe(
			true,
			"Element (" + by.linkText(link) + ") should be present"
		);
	}

	public async verifyPartiallyLinkPresent(link) {
		expect(await element(by.partialLinkText(link)).isPresent()).toBe(
			true,
			"Element (" + by.partialLinkText(link) + ") should be present"
		);
	}

	public async verifyNotPresent(locator) {
		expect(
			await element(locatorUtil.getLocator(locator).locator).isPresent()
		).toBe(
			false,
			"Element (" +
			locatorUtil.getLocator(locator).description +
			") should not be present"
		);
	}

	public async verifyText(locator, text) {
		if (text.startsWith("${")) {
			text = properties.get(text.substring(2, text.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getText()
			.then(textOfElement => {
				expect(textOfElement).toEqual(
					text,
					"Text of (" +
					locatorUtil.getLocator(locator).description +
					") should be " +
					text +
					", actual is " +
					textOfElement
				);
			});
	}

	public async verifyNotText(locator, text) {
		if (text.startsWith("${")) {
			text = properties.get(text.substring(2, text.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getText()
			.then(textOfElement => {
				expect(textOfElement).not.toEqual(
					text,
					"Text of (" +
					locatorUtil.getLocator(locator).description +
					") should not be " +
					text +
					", actual is " +
					textOfElement
				);
			});
	}

	public async verifyValue(locator, value) {
		if (value.startsWith("${")) {
			value = properties.get(value.substring(2, value.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getAttribute("value")
			.then(valueOfElement => {
				expect(valueOfElement).toEqual(
					value,
					"Value of (" +
					locatorUtil.getLocator(locator).description +
					") should be " +
					value +
					", actual is " +
					valueOfElement
				);
			});
	}

	public async verifyNotValue(locator, value) {
		if (value.startsWith("${")) {
			value = properties.get(value.substring(2, value.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getAttribute("value")
			.then(valueOfElement => {
				expect(valueOfElement).not.toEqual(
					value,
					"Value of (" +
					locatorUtil.getLocator(locator).description +
					") should not be " +
					value +
					", actual is " +
					valueOfElement
				);
			});
	}

	public async verifyVisible(locator) {
		let condition = EC.presenceOf(
			element(locatorUtil.getLocator(locator).locator)
		);
		await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined(
				"Element (" +
				locatorUtil.getLocator(locator).description +
				") was not present"
			);
		});
		expect(
			await element(locatorUtil.getLocator(locator).locator).isDisplayed()
		).toBe(
			true,
			"Element " +
			locatorUtil.getLocator(locator).description +
			" should be visible"
		);
	}

	public async verifyNotVisible(locator) {
		let condition = EC.presenceOf(
			element(locatorUtil.getLocator(locator).locator)
		);
		await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined(
				"Element (" +
				locatorUtil.getLocator(locator).description +
				") was not present"
			);
		});
		expect(
			await element(locatorUtil.getLocator(locator).locator).isDisplayed()
		).toBe(
			false,
			"Element " +
			locatorUtil.getLocator(locator).description +
			" should not be visible"
		);
	}

	public async assertTitle(title) {
		browser.getTitle().then(pageTitle => {
			expect(title).toEqual(
				pageTitle,
				"Page Title should be " + title + ", actual is " + pageTitle
			);
		});
	}

	public async assertPresent(locator) {
		expect(
			await element(locatorUtil.getLocator(locator).locator).isPresent()
		).toBe(
			true,
			"Element (" +
			locatorUtil.getLocator(locator).description +
			") should be present"
		);
	}

	public async assertLinkPresent(link) {
		expect(await element(by.linkText(link)).isPresent()).toBe(
			true,
			"Element (" + by.linkText(link) + ") should be present"
		);
	}

	public async assertPartiallyLinkPresent(link) {
		expect(await element(by.partialLinkText(link)).isPresent()).toBe(
			true,
			"Element (" + by.partialLinkText(link) + ") should be present"
		);
	}

	public async assertNotPresent(locator) {
		expect(
			await element(locatorUtil.getLocator(locator).locator).isPresent()
		).toBe(
			false,
			"Element (" +
			locatorUtil.getLocator(locator).description +
			") should not be present"
		);
	}

	public async assertText(locator, text) {
		await element(locatorUtil.getLocator(locator).locator)
			.getText()
			.then(textOfElement => {
				expect(textOfElement).toEqual(
					text,
					"Text of (" +
					locatorUtil.getLocator(locator).description +
					") should be " +
					text +
					", actual is " +
					textOfElement
				);
			});
	}

	public async assertNotText(locator, text) {
		if (text.startsWith("${")) {
			text = properties.get(text.substring(2, text.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getText()
			.then(textOfElement => {
				expect(textOfElement).not.toEqual(
					text,
					"Text of (" +
					locatorUtil.getLocator(locator).description +
					") should not be " +
					text +
					", actual is " +
					textOfElement
				);
			});
	}

	public async assertValue(locator, value) {
		if (value.startsWith("${")) {
			value = properties.get(value.substring(2, value.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getAttribute("value")
			.then(valueOfElement => {
				expect(valueOfElement).toEqual(
					value,
					"Value of (" +
					locatorUtil.getLocator(locator).description +
					") should be " +
					value +
					", actual is " +
					valueOfElement
				);
			});
	}

	public async assertNotValue(locator, value) {
		if (value.startsWith("${")) {
			value = properties.get(value.substring(2, value.length - 1));
		}
		await element(locatorUtil.getLocator(locator).locator)
			.getAttribute("value")
			.then(valueOfElement => {
				expect(valueOfElement).not.toEqual(
					value,
					"Value of (" +
					locatorUtil.getLocator(locator).description +
					") should not be " +
					value +
					", actual is " +
					valueOfElement
				);
			});
	}

	public async assertVisible(locator) {
		let condition = EC.presenceOf(
			element(locatorUtil.getLocator(locator).locator)
		);
		await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined(
				"Element (" +
				locatorUtil.getLocator(locator).description +
				") was not present"
			);
		});
		expect(
			await element(locatorUtil.getLocator(locator).locator).isDisplayed()
		).toBe(true);
	}

	public async assertNotVisible(locator) {
		let condition = EC.presenceOf(
			element(locatorUtil.getLocator(locator).locator)
		);
		await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined("Element was not present");
		});
		expect(
			await element(locatorUtil.getLocator(locator).locator).isDisplayed()
		).toBe(false);
	}

	public async waitForElement(locator) {
		await this.waitForPresence(locator);
	}

	public async waitForVisible(locator) {
		let condition = EC.presenceOf(
			element(locatorUtil.getLocator(locator).locator)
		);
		await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined(
				"Element (" +
				locatorUtil.getLocator(locator).description +
				") was not present"
			);
		});
		condition = EC.visibilityOf(
			element(locatorUtil.getLocator(locator).locator)
		);
		await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined(
				"Element (" +
				locatorUtil.getLocator(locator).description +
				") was not visible"
			);
		});
	}

	public async switchToFrame(nameOrIndex) {
		try {
			if (
				locatorUtil.getLocator(nameOrIndex).actualLocatorString.includes("=")
			) {
				await protractor.browser
					.switchTo()
					.frame(element(locatorUtil.getLocator(nameOrIndex).locator).getWebElement());
			} else {
				await protractor.browser.switchTo().frame(nameOrIndex);
			}
		} catch {
			await protractor.browser.switchTo().frame(nameOrIndex);
		}
	}

	public async switchToDefaultContent() {
		await protractor.browser.switchTo().defaultContent();
	}

	public async getRepeaterElements(locator) {
		return element.all(locatorUtil.getLocator(locator).locator);
	}

	public async getByElement(locator) {
		return element(locatorUtil.getLocator(locator).locator);
	}

	public async clickDynamicLocators(locator, dynamicValue) {
		if (dynamicValue.startsWith("${")) {
			dynamicValue = properties.get(
				dynamicValue.substring(2, dynamicValue.length - 1)
			);
		}
		element(locatorUtil.getLocator(locator, dynamicValue)).click();
	}
	public async Enter(locator) {
		await this.waitForPresence(locator);

		await element(locatorUtil.getLocator(locator).locator)
			.sendKeys(protractor.Key.ENTER)
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}
	public async close(str) {
		await browser.driver.close();
	}

	public async switchWinodw(index) {
		await browser.driver.getAllWindowHandles().then((windowArray) => {
			browser.driver.switchTo().window(windowArray[index]);
		});

	}
	public async implicitWait(time) {
		if (time && /^[0-9]*$/mg.test(time.toString().trim())) {
			protractor.browser.sleep(time).then(() => { }).catch(err => { throw err; });
		} else {
			throw 'Invalid Input : ' + time;
		}
	}
	public async switchToDefaultWindow(str) {
		await browser.driver.getAllWindowHandles().then((windowArray) => {
			browser.driver.switchTo().window(windowArray[0]);
		});
	}
	public async maximizeWindow() {
		await browser.driver.manage().window().maximize();
	}
	public async dragAndDrop(locator, locator2) {
		await this.waitForPresence(locator);
		await browser.executeScript(jsScript + "simulateDragDrop(arguments[0], arguments[1])", await element(locatorUtil.getLocator(locator).locator), await element(locatorUtil.getLocator(locator2).locator))
			.then(() => { })
			.catch(err => {
				throw err;
			});
		await browser.actions().dragAndDrop(await element(locatorUtil.getLocator(locator).locator), await element(locatorUtil.getLocator(locator2).locator)).mouseUp().perform()
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}
	public async dragAndDropValue(locator, JSvalue) {
		await this.waitForPresence(locator);
		let executScriptValue = "arguments[0].setAttribute('value'," + JSvalue + ");if(typeof(arguments[0].onchange) === 'function'){arguments[0].onchange('');}";
		await browser.executeScript(executScriptValue, await element(locatorUtil.getLocator(locator).locator))
			.then(() => { })
			.catch(err => {
				throw err;
			});
	}
	public async dragAndDropOffset(locator, locator2) {
		await this.waitForPresence(locator);
		if (parseInt(locator2.split(',')[0])) {
			await browser.actions().dragAndDrop(await element(locatorUtil.getLocator(locator).locator), { x: parseInt(locator2.split(',')[0]), y: parseInt(locator2.split(',')[1]) }).mouseUp().perform()
				.then(() => { })
				.catch(err => {
					throw err;
				});
		} else {
			throw 'invalid Offset input'
		}
	}
	public async waitForAlert(time)  {
		if(time && /^[0-9]*$/mg.test(time.trim())){
			var timeout = +time.trim();
			await browser.driver.wait(protractor.until.alertIsPresent(), timeout).then(function() {
			});
		}else{
			throw 'Invalid Input : '+time;
		}
	}
	public async dismissAlert(time)  {
				await browser.driver.switchTo().alert().dismiss();
	}
	public async acceptAlert(time)  {
				await browser.driver.switchTo().alert().accept();
	}
	public async getAlertText(time)  {
			await browser.driver.switchTo().alert().getText();
	}
	public async setAlertText(text)  {
			await browser.driver.switchTo().alert().sendKeys(text);
	}
	public async verifyAlertNotPresent(time)  {
		if(time && /^[0-9]*$/mg.test(time.trim())){
			var timeout = +time.trim();
			return new Promise((resolve, reject) => {
				browser.driver.wait(protractor.until.alertIsPresent(), timeout)
			   .then(isVisible => {
				   if (isVisible) {
					   reject(new Error("Alert is present"));
				   }else {
						resolve();
				   }
			   })
			   .catch(err => {
				   resolve();
			   });
		   });
		}
	}
	public async verifyAlertPresent(time)  {
		if(time && /^[0-9]*$/mg.test(time.trim())){
			var timeout = +time.trim();
			await browser.driver.wait(protractor.until.alertIsPresent(), timeout).then(function() {
			}).catch(err => {
				throw 'Alert is not present. '+err;
			});
		}else{
			throw 'Invalid Input : '+time;
		}
	}
	public async executeJavaScript(jsScriptInput) {
		await browser.executeScript(jsScriptInput)
		.then(() => { })
		.catch(err => {
			throw err;
		});
	}
	public async executeAsyncJavaScript(jsScriptInput) {
		await browser.executeAsyncScript(jsScriptInput)
		.then(() => { })
		.catch(err => {
			throw err;
		});
	}
	public async storeValueIntoVariable(locator,varKey) {
		properties.set(varKey,await element(locatorUtil.getLocator(locator).locator).getAttribute("value"));
	}
	public async storeTextIntoVariable(locator,varKey) {
		properties.set(varKey,await element(locatorUtil.getLocator(locator).locator).getText());
	}
	public async storeTitleIntoVariable(varKey) {
		properties.set(varKey,await browser.driver.getTitle())
	}
	public async verifySelected(locator) {
		let condition = EC.presenceOf(browser.element(locatorUtil.getLocator(locator).locator));
		 await browser.wait(condition, 5000).catch(reason => {
			expect(reason).toBeUndefined("Element (" +
				locatorUtil.getLocator(locator).description +
				") was not present");
		});
		expect( await browser.element(locatorUtil.getLocator(locator).locator).isSelected()).toBe(true, "Element " +
			locatorUtil.getLocator(locator).description +
			" should be selected");
	}

	public async verifyNotSelected(locator) {
			let condition = EC.presenceOf(browser.element(locatorUtil.getLocator(locator).locator));
			await browser.wait(condition, 5000).catch(reason => {
				expect(reason).toBeUndefined("Element (" +
					locatorUtil.getLocator(locator).description +
					") was not present");
			});
			expect(await browser.element(locatorUtil.getLocator(locator).locator).isSelected()).toBe(false, "Element " +
				locatorUtil.getLocator(locator).description +
				" should not be selected");
	}
}
