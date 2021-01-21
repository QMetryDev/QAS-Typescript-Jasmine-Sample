
import { Listener } from './../../base/jasmine';
import { browser } from 'protractor';

let listener = new Listener();
import { SpecReporter } from '../../support/reporter';
import * as HtmlReporter from 'protractor-beautiful-reporter';
import { Global } from '../../support/global';

//let SpecReporter = require('jasmine');
// import * as SpecReporter from 'jasmine-spec-reporter';
const configurationManager_1 = require("../../base/configurationmanager");
let isDIrectConnectSupported = true;
let seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
let browserProperty = configurationManager_1.ConfigurationManager.getBundle().get("driver.name");
let driverCaps = {};
driverCaps["browserName"] = 'chrome';
driverCaps["chromeOptions"] = {'mobileEmulation':{'deviceName':'iPhone X'}};
if (browserProperty && browserProperty.toLowerCase().indexOf("remote") >= 0) {
    isDIrectConnectSupported = false;
    seleniumAddress=configurationManager_1.ConfigurationManager.getBundle().get("remote.server");
    let caps = configurationManager_1.ConfigurationManager.getBundle().get("remote.additional.capabilities");
    try {
        if (caps !== null && caps !== undefined) {
            driverCaps = JSON.parse(caps);
        }
    }
    catch (error) {
        console.log(caps + " defined at remote.additional.capabilities" + " is not a valid json");
    }
}
module.exports = {
	// seleniumAddress: 'http://localhost:4723/wd/hub',
	// directConnect: true,
	// capabilities: {
	// 	browserName: 'chrome',
	// 	'chromeOptions':{'mobileEmulation':{'deviceName':'iPhone X'}}
	// },
	directConnect: isDIrectConnectSupported,
	seleniumAddress: seleniumAddress,
	capabilities: driverCaps,
	specs: ['./spec/mobileweb/*.js','./spec/mobileweb/**/*.js'],
	baseUrl:  'https://qas.qmetry.com/bank/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 5000000
	},
	onPrepare: function() {
		// set browser size...
		browser.manage().window().maximize();

		// better jasmine 2 reports...

		jasmine.getEnv().addReporter(
		  new SpecReporter()
		);
		Global.executionTimeStamp = getDate();
		jasmine.getEnv().addReporter(
		  new HtmlReporter({
			baseDirectory: 'test-results/' + Global.executionTimeStamp,
			screenshotsSubfolder: 'images',
			jsonsSubfolder: 'jsons'
		  }).getJasmine2Reporter()
		);

		jasmine.getEnv().addReporter(listener);
	  },
	  params: {},
	  allScriptsTimeout: 45000,
	  restartBrowserBetweenTests: false
};



function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + '_' + minutes + '_' + ampm;
	return strTime;
  }
  function getDate() {
	const date = new Date();
	const year = date.getFullYear();
	const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	];
	const formatedMonth = monthShortNames[date.getMonth()];
	const day = date.getDate().toString();
	const formatedDay = (day.length === 1) ? ('0' + day) : day;
	const timeFormat = formatAMPM(date);
	return formatedDay + '_' + formatedMonth + '_' + year + '_' + timeFormat;
  }
