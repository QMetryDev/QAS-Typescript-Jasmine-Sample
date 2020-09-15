import { browser } from 'protractor';

export declare let listner : Listener;

export class Listener {
	public jasmineStarted(suiteInfo) {
		// console.log('jasmine started');
	}
	public suiteStarted(result) {
		// console.log('suite start');
	}
	public specStarted(result) {
		// console.log('spec start');
	}
	public specDone(result) {
		// console.log('spec done');
	}
	public suiteDone(result) {
		// console.log('suite done');
	}
}
