import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

const storageKey = 'sleeptracker.logs.v1';

type StoredLog = { id: string; loggedAt: string } & (
  { type: 'overnight'; start: string; end: string } |
  { type: 'sleepiness'; rating: number }
);

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static initialized = false;
	private static storedLogs: StoredLog[] = [];
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		if (!SleepService.initialized) {
			this.addDefaultData();
			this.restoreLogs();
			SleepService.initialized = true;
		}
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.addEntry(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.addEntry(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.addEntry(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(entry: OvernightSleepData): void {
		this.saveEntry(entry, {
			type: 'overnight', id: entry.id, loggedAt: entry.loggedAt.toISOString(),
			start: entry.sleepStart.toISOString(), end: entry.sleepEnd.toISOString(),
		});
	}

	public logSleepinessData(entry: StanfordSleepinessData): void {
		this.saveEntry(entry, {
			type: 'sleepiness', id: entry.id, loggedAt: entry.loggedAt.toISOString(), rating: entry.loggedValue,
		});
	}

	public removeLog(id: string): void {
		const logs = SleepService.storedLogs.filter(log => log.id !== id);
		if (logs.length === SleepService.storedLogs.length) return;

		this.writeLogs(logs);
		SleepService.AllSleepData = SleepService.AllSleepData.filter(entry => entry.id !== id);
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(entry => entry.id !== id);
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(entry => entry.id !== id);
	}

	private saveEntry(entry: OvernightSleepData | StanfordSleepinessData, log: StoredLog): void {
		this.writeLogs([...SleepService.storedLogs, log]);
		this.addEntry(entry);
	}

	private writeLogs(logs: StoredLog[]): void {
		localStorage.setItem(storageKey, JSON.stringify(logs));
		SleepService.storedLogs = logs;
	}

	private restoreLogs(): void {
		let logs: unknown;
		try {
			logs = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
		} catch {
			return;
		}
		if (!Array.isArray(logs)) return;

		for (const log of logs as (StoredLog | null)[]) {
			if (!log || typeof log.id !== 'string' || typeof log.loggedAt !== 'string') continue;
			const loggedAt = new Date(log.loggedAt);
			if (!Number.isFinite(loggedAt.getTime())) continue;

			let entry: OvernightSleepData | StanfordSleepinessData;
			if (log.type === 'overnight' && typeof log.start === 'string' && typeof log.end === 'string') {
				const start = new Date(log.start);
				const end = new Date(log.end);
				if (!(end > start)) continue;
				entry = new OvernightSleepData(start, end);
			} else if (log.type === 'sleepiness' && Number.isInteger(log.rating) &&
				log.rating >= 1 && log.rating < StanfordSleepinessData.ScaleValues.length) {
				entry = new StanfordSleepinessData(log.rating, loggedAt);
			} else {
				continue;
			}

			entry.id = log.id;
			entry.loggedAt = loggedAt;
			this.addEntry(entry);
			SleepService.storedLogs.push(log);
		}
	}

	private addEntry(entry: OvernightSleepData | StanfordSleepinessData): void {
		SleepService.AllSleepData.push(entry);
		if (entry instanceof OvernightSleepData) {
			SleepService.AllOvernightData.push(entry);
		} else {
			SleepService.AllSleepinessData.push(entry);
		}
	}
}
