import * as PropertiesReader from 'properties-reader';
import * as fs from 'fs';

export class ConfigurationManager {

  public static properties: PropertiesReader.Reader;
  public static defaultLocale: String;

  constructor() {
    if (!ConfigurationManager.properties) {
      ConfigurationManager.properties = PropertiesReader(
        'resources/application.properties'
      );
      if (ConfigurationManager.properties
        .get('env.default.locale') !== undefined && ConfigurationManager.properties
          .get('env.default.locale') !== null && ConfigurationManager.defaultLocale === undefined) {
        ConfigurationManager.defaultLocale = ConfigurationManager.properties
          .get('env.default.locale').toString();
      }
      ConfigurationManager.setup();
    }

  }
  static setup() {
    let resourceStrng: string = ConfigurationManager.properties
      .get('env.resources')
      .toString();
    let resourcesToLoad = resourceStrng.split(';');
    for (let resource in resourcesToLoad) {
      console.log('loading from ' + resourcesToLoad[resource]);
      ConfigurationManager.load(resourcesToLoad[resource]);
    }
  }
  static load(path: string) {
    if (fs.lstatSync(path).isDirectory()) {
      fs.readdirSync(path).map(function (child) {
        return ConfigurationManager.load(path + '/' + child);
      });
    } else if (path.endsWith('.loc') || path.endsWith('.properties') || path.endsWith('.' + ConfigurationManager.defaultLocale)) {
      this.properties.append(path);
    }
  }

  static getBundle(): PropertiesReader.Reader {
    return this.properties;
  }
}
new ConfigurationManager();
