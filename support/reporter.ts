import CustomReporter = jasmine.CustomReporter;
import SuiteInfo = jasmine.SuiteInfo;
import RunDetails = jasmine.RunDetails;
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import { MetaInfo } from './metainfo/MetaInfo';
import * as path from 'path';
import { Global } from './global';
import { JsonMetaInfo } from './metainfo/JsonMetaInfo';
import { BrowserDesiredCapabilities } from './overview/BrowserDesiredCapabilities';
import { BrowserActualCapabilities } from './overview/BrowserActualCapabilities';
import { IsfwBuildInfo } from './overview/IsfwBuildInfo';
import { RunParameters } from './overview/RunParameters';
import { ExecutionEnvInfo } from './overview/ExecutionEnvInfo';
import { EnvInfo } from './overview/EnvInfo';
import { Overview } from './overview/Overview';
import { ScenarioMetaInfo } from './metainfo/ScenarioMetaInfo';
import { ScenarioMetaData } from './metainfo/ScenarioMetadata';
import { SeleniumLog } from './sample-test/SeleniumLog';
import { SubCheckPoints } from './sample-test/SubCheckPoints';
import { CheckPoints } from './sample-test/CheckPoints';
import { SampleTest } from './sample-test/SampleTest';
const metaInfoJson = path.join(process.cwd(), '/test-results/meta-info.json');
const cucumberReportJsonPath = path.join(process.cwd(), '/test-results/' + Global.executionTimeStamp + '/json/cucumber_report.json');


export interface CustomReporterResult extends jasmine.CustomReporterResult {
    duration?: string;
}
const rootMetaPath = 'test-results/meta-info.json';


function createRootMetaInfo(executionTimeStamp) {
    var rootMeta = {'reports':[]};
    if (fs.existsSync(rootMetaPath)) {
        rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, 'UTF-8'));
    }
    let currentMeta = new MetaInfo('QAF Demo', 'test-results/' + executionTimeStamp + '/json', new Date().getTime());
    rootMeta['reports'].unshift(currentMeta);
    fsExtra.ensureFileSync(metaInfoJson);
    fs.writeFileSync(metaInfoJson, JSON.stringify(rootMeta, null, 4));
}

function setPassFailSkipStableTotal(json, jsonMetaInfo, failFlag, total, suitName) {
    let totalKey = suitName + ' total';
    let passKey = suitName + ' ' + 'passed';
    let failKey = suitName + ' ' + 'failed';
    let skipKey = suitName + ' ' + 'skipped'

    if (json.passed == true) {
        jsonMetaInfo.pass++;
        failFlag = false;
        Global.hashMap.set(passKey, (Global.hashMap.get(passKey) === undefined
                ? 1 : parseInt(Global.hashMap.get(passKey)) +1));
    }
    if (json.pending) {
        jsonMetaInfo.skip++;
        failFlag = false;
        Global.hashMap.set(skipKey, (Global.hashMap.get(skipKey) === undefined
                ? 1 : parseInt(Global.hashMap.get(skipKey)) +1));
    }

    if (failFlag) {
        Global.hashMap.set(failKey, (Global.hashMap.get(failKey) === undefined
        ? 1 : parseInt(Global.hashMap.get(failKey)) +1));
        jsonMetaInfo.fail++;
        jsonMetaInfo.status = 'unstable';
    }
    Global.hashMap.set(totalKey, (Global.hashMap.get(totalKey) === undefined
    ? 1 : parseInt(Global.hashMap.get(totalKey)) +1));
    jsonMetaInfo.total = total;
    return jsonMetaInfo;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function createMetaInfoInJson() {
    const jsonMetaInfoJson = path.join(process.cwd(), '/test-results/' + Global.executionTimeStamp + '/json/meta-info.json');
    const jsonFolder = path.join(process.cwd(), '/test-results/' + Global.executionTimeStamp + '/jsons');
    const jsonReports = path.join(process.cwd(), '/test-results/' + Global.executionTimeStamp + '/json');

    let pass = 0;
    let skip = 0;
    let fail = 0;
    let total =0;
    let startTimeArray: number[] = [];
    let totalDuration = 0;
    let caseArray: string[] = [];
    let suitArray: string[] = [];
    let status = 'stable';

    let jsonMetaInfo ;
    let uniqueScenarioArray: string[] = [];
    Global.hashMap = new Map();

    // START
    // Loop each files of 'jsons' folder
    fs.readdirSync(jsonFolder).forEach(file => {
        let json = JSON.parse(fs.readFileSync(jsonFolder+ path.sep + file, 'UTF-8'));
        let failFlag = true;
        let splitArray = json.description.split('|');
        caseArray.push(splitArray[0]);
        suitArray.push(splitArray[1]);

        let caseKey = splitArray[1];

        // START
        // set classes for overview.json
        let suitCaseNameArray: string[] = [];
        if(Global.hashMap.get(caseKey) === undefined) {
            suitCaseNameArray.push(splitArray[0]);
        } else {
            suitCaseNameArray = Global.hashMap.get(caseKey);
            suitCaseNameArray.push(splitArray[0]);
        }
        Global.hashMap.set(caseKey,suitCaseNameArray);
        // END

        startTimeArray.push(json.timestamp);
        totalDuration = totalDuration + json.duration;
        total++;


        // START
        // set starttime and duration for overview.json
        let startTimeKey = caseKey + ' ' + 'startTime';
        let durationKey = caseKey + ' ' + 'duration';

        if(Global.hashMap.get(startTimeKey) === undefined &&
                Global.hashMap.get(durationKey) == undefined) {
            Global.hashMap.set(startTimeKey, json.timestamp);
            Global.hashMap.set(durationKey, json.duration);
        } else {
            if (parseInt(Global.hashMap.get(startTimeKey)) >
                parseInt(json.timestamp)) {
                Global.hashMap.set(startTimeKey, json.timestamp)
            }
            let durationTotal = parseInt(Global.hashMap.get(durationKey)) + parseInt(json.duration);
            Global.hashMap.set(durationKey, durationTotal);
        }
        Global.hashMap.set(caseKey,suitCaseNameArray);
        // END
        Global.hashMap.set(caseKey + ' browser', json.browser.name)
        jsonMetaInfo =  (Global.hashMap.get('jsonMetaInfo') === undefined) ?
            new JsonMetaInfo('QAF Report',
                'stable', caseArray, total, pass, fail, skip, json.timestamp,
                json.timestamp + totalDuration)
        :
            Global.hashMap.get('jsonMetaInfo');

        uniqueScenarioArray.push(splitArray[1]);
        jsonMetaInfo = setPassFailSkipStableTotal(json, jsonMetaInfo, failFlag, total, splitArray[1]);
        Global.hashMap.set('jsonMetaInfo',jsonMetaInfo);
        failFlag = false;
        let featureDir = jsonReports + path.sep + splitArray[1] + path.sep+ splitArray[0];
        createMetaInfoInScenario(featureDir, json);
        createScenario(featureDir, json, splitArray[0]);
    });
    // END
    jsonMetaInfo.tests = uniqueScenarioArray.filter(onlyUnique);
    jsonMetaInfo.startTime = Math.min.apply(Math, startTimeArray);
    jsonMetaInfo.endTime = jsonMetaInfo.startTime + totalDuration;
    Global.hashMap.set('jsonMetaInfo',jsonMetaInfo);
    fsExtra.ensureFileSync(jsonMetaInfoJson);
    fs.writeFileSync(jsonMetaInfoJson, JSON.stringify(Global.hashMap.get('jsonMetaInfo'), null, 4));

    // START
    // Create overview.json block
    uniqueScenarioArray.forEach(scenarioName => {
        let startTimeKey = scenarioName + ' ' + 'startTime';
        let durationKey = scenarioName + ' ' + 'duration';
        let endTime = parseInt(Global.hashMap.get(startTimeKey)) +
        parseInt(Global.hashMap.get(durationKey));

        createOverview(scenarioName, Global.hashMap.get(scenarioName), scenarioName,
        Global.hashMap.get(startTimeKey), endTime);
    });
    // END
}

function setStatus(scenario) {
    let status: string = 'pass';
    let failFlag = true;
    if (scenario.passed) {
        status = 'pass';
        failFlag = false;
    }
    if (scenario.pending) {
        status = 'skip';
        failFlag = false;
    }
    if (failFlag) {
        status = 'fail';
    }
    return status;
}

function createScenario(sampleTestJson, scenario, scenarioName) {
    let args = ['[/]'];
    let subLogs = [];
    let seleniumLogArray : Array<SeleniumLog> = [];
    let checkPointsArray : Array<CheckPoints> = [];
    let status: string = setStatus(scenario);

    if (status == 'pass') {
        let checkPoints = new CheckPoints('Message: ' + ' '
        + 'Success', 'TestStepPass', scenario.duration, 0, []);
        checkPointsArray.push(checkPoints);
    } else if (status == 'fail') {
        let checkPoints = new CheckPoints('Error Message: ' + ' '
        + scenario.message, 'TestStepFail', scenario.duration, 0, []);
        checkPointsArray.push(checkPoints);
    }

    let seleniumLog = new SeleniumLog('get', args, status, subLogs, scenario.duration);
    seleniumLogArray.push(seleniumLog);
    let sampleTest = new SampleTest(seleniumLogArray, checkPointsArray, scenario.message);
    fs.writeFileSync(sampleTestJson + path.sep + scenarioName +'.json', JSON.stringify(sampleTest, null, 4));
}

function createMetaInfoInScenario(scenarioMetaInfoJson, scenario) {
        let splitArray = scenario.description.split('|');
    var scenarioMeta = {'methods':[]};

    let senarioMetaData = new ScenarioMetaData(splitArray[0], [], 11, splitArray[0], 'REFERECE', 'SIGN');

    let status: string = setStatus(scenario);
    let scenarioMetaInfo = new ScenarioMetaInfo(1, 'test',
        [], senarioMetaData, [],  scenario.timestamp, scenario.duration, status, 0.0);
    scenarioMeta.methods.push(scenarioMetaInfo);
    fsExtra.ensureFileSync(scenarioMetaInfoJson + '/meta-info.json');
    fs.writeFileSync(scenarioMetaInfoJson + '/meta-info.json', JSON.stringify(scenarioMeta, null, 4));
}

function createOverview(scenarioName, scenarioDirsArray, scenarioCaseName, minStart, maxEnd) {
    const jsonReports = path.join(process.cwd(), '/test-results/' + Global.executionTimeStamp + '/json');

    let browserDesiredCapabilities = new BrowserDesiredCapabilities('chrome', true, true,
        '', 'ANY', true);
    let browserActualCapabilities = new BrowserActualCapabilities();
    let browserName = Global.hashMap.get(scenarioName + ' browser');
    let isfwBuildInfo = new IsfwBuildInfo(browserName, '10', '2.1', '03-Jan-2017 14:01:00');
    let runParameters = new RunParameters('resources/testdata', 'scenarios/android', 'http://www.replacedbufiles.org', 'resources/testdata;resources/android');
    let executionEnvInfo = new ExecutionEnvInfo('64', 'Oracle Corporation', '1.8.0_172', 'x86_64',
        'Administrators-MacBook-Pro-2.local', 'Mac OS X', 'shalinshah', '10.13.6');
    let envInfo = new EnvInfo(browserDesiredCapabilities,
        browserActualCapabilities,isfwBuildInfo,runParameters, executionEnvInfo);

    let passKey = scenarioCaseName + ' ' + 'passed';
    let failKey = scenarioCaseName + ' ' + 'failed';
    let skipKey = scenarioCaseName + ' ' + 'skipped';
    let totalKey = scenarioCaseName + ' total';
     let totalValue = (Global.hashMap.get(totalKey) === undefined ? 0 : Global.hashMap.get(totalKey));
    let passValue = (Global.hashMap.get(passKey) === undefined ? 0 : Global.hashMap.get(passKey));
    let failValue = (Global.hashMap.get(failKey) === undefined ? 0 : Global.hashMap.get(failKey));
    let skipValue = (Global.hashMap.get(skipKey) === undefined ? 0 : Global.hashMap.get(skipKey));
    let overview = new Overview(totalValue, passValue,
    failValue, skipValue, scenarioDirsArray, envInfo, minStart, maxEnd);

    let jsonString = Overview.formatFieldNames(JSON.stringify(overview, null, 4));
    let dir = jsonReports + path.sep + scenarioName + '/overview.json';
    fsExtra.ensureFileSync(dir);
    fs.writeFileSync(dir, jsonString);
}

export class SpecReporter implements CustomReporter {

    public jasmineStarted(suiteInfo: SuiteInfo): void {
        createRootMetaInfo(Global.executionTimeStamp);
    }

    public jasmineDone(runDetails: RunDetails): void {
        createMetaInfoInJson();
    }

    public suiteStarted(result: CustomReporterResult): void {
    }

    public suiteDone(result: CustomReporterResult): void {
    }

    public specStarted(result: CustomReporterResult): void {
    }

    public specDone(result: CustomReporterResult): void {

    }

    private runDetailsToResult(runDetails: RunDetails): CustomReporterResult {
        return {
            description: 'Non-spec failure',
            failedExpectations: runDetails.failedExpectations.map(expectation => {
                return {
                    actual: '',
                    expected: '',
                    matcherName: '',
                    message: expectation.message,
                    passed: false,
                    stack: (expectation as any).stack,
                };
            }),
            fullName: 'Non-spec failure',
            id: 'Non-spec failure',
        };
    }

}


