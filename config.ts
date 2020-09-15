import { ConfigurationManager } from './base/configurationmanager';

let platform=ConfigurationManager.getBundle().get("platform");
console.log("Plarform is :"+platform)
export let config = require('./resources/'+platform+'/env');

