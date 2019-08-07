import { browser } from 'protractor';
import { Validator } from './../base/validator';
import { CommonSteps } from '../base/commonsteps';

let validator = new Validator();
let actions = new CommonSteps();

export class LoginPage {
  public openLoginPage(searchKeyword) {
    browser.get(browser.baseUrl);
    browser.driver
      .manage()
      .window()
      .maximize();
  }

  public login(username, password) {
    actions.sendKeys('login.username.loc', username);
    actions.sendKeys('login.password.loc', password);
    actions.click('login.submit.btn.loc');
  }

  public verifyPage() {
    validator.verifyPresent('login.username.loc');
  }

  public verifyPlaceholders() {
    actions.click('login.username.loc');
    validator.verifyAttribute('login.username.loc', 'placeholder', 'Username');
    actions.click('login.password.loc');
    validator.verifyAttribute('login.password.loc', 'placeholder', 'Password');
  }

  public verifyValidationErrors() {
    actions.click('login.username.loc');
    validator.verifyVisible('login.password.erricon.loc');
    validator.verifyText('login.password.errmsg.loc', 'Password is required.');
    actions.click('login.submit.btn.loc');
    validator.verifyVisible('login.username.erricon.loc');
    validator.verifyText('login.username.errmsg.loc', 'Username is required.');
    validator.verifyVisible('login.password.erricon.loc');
    validator.verifyText('login.password.errmsg.loc', 'Password is required.');
  }
}
