import { ConfigurationManager } from './base/configurationManager';

let platform=ConfigurationManager.getBundle().get("platform");
console.log("Plarform is :"+platform)
export let config = require('./resources/'+platform+'/env');

