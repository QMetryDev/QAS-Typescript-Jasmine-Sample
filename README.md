
# TypeScript Jasmine

#### Pre-requisites
1.NodeJS installed globally in the system.
https://nodejs.org/en/download/

2.Chrome or Firefox browsers installed.

* All the dependencies from package.json and ambient typings would be installed in node_modules folder.
```
npm install
npm install -g protractor
npm install -g tsc
```
``` # Note : Ignore the error and run the Scripts ```
#### Run Scripts

* First step is to fire up the selenium server which could be done in many ways,  **webdriver-manager** proves very handy for this.The below command should download the **chrome & gecko driver** binaries locally for you!

```
npm run prepare
```
* Now compile the code and create Javascript files for executing tests.
```
npm run build
```

* Now just run the test command which launches the Chrome Browser and runs the scripts.
```
npm run test
```

#### Writing Spec.ts
```
import { browser } from "protractor";
import { CommonSteps } from "../../base/commonsteps";
let actions = new CommonSteps();
describe("Scenario Name", function() {
  it("valid Login", function() {
    browser.get(browser.baseUrl);
    browser.driver
      .manage()
      .window()
      .maximize();
      actions.sendKeys("login.username.loc", "username");
      actions.sendKeys("login.password.loc", "password");
      actions.click("login.submit.btn.loc");
  });
});


```
#### Writing Required TS file
```
export class HomePage {
  acceptTerms = function() {
    element(locators.getLocator("home.accept.terms.checkbox.loc"))
      .isDisplayed()
      .then(isDisplayed => {
        if (isDisplayed) {
          actions.click("home.accept.terms.checkbox.loc");
          actions.click("home.accept.terms.btn.loc");
        }
      });

```
#### HTML Reports
```
Report is generated in the `test-results` folder when you run `npm test`.
```

#### Upload Reports
To upload reports to QTM or QTM4J run below command
`npm run uploadresults`

##### Enjoy Coding !😊