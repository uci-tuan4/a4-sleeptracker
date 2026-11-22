import { DatePipe, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [DatePipe, FormsModule, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  bedtime = '';
  wakeUp = '';
  error = '';
  status = '';
  overnightHistory = this.readHistory();

  readonly sleepinessRatings = [1, 2, 3, 4, 5, 6, 7];
  sleepinessRating = 4;
  sleepinessTime = this.currentLocalTime();
  sleepinessError = '';
  sleepinessStatus = '';
  sleepinessHistory = this.readSleepinessHistory();

  constructor(private sleepService: SleepService) {}

  saveOvernight(): void {
    this.error = '';
    this.status = '';
    const start = new Date(this.bedtime);
    const end = new Date(this.wakeUp);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      this.error = 'Enter a date and time for both bedtime and wake-up.';
      return;
    }
    if (end <= start) {
      this.error = 'Wake-up must be after bedtime. If you woke up the next morning, select the next date.';
      return;
    }

    try {
      this.sleepService.logOvernightData(new OvernightSleepData(start, end));
    } catch {
      this.error = 'Could not save overnight sleep. Check that browser storage is available and try again.';
      return;
    }
    this.overnightHistory = this.readHistory();
    this.bedtime = '';
    this.wakeUp = '';
    this.status = 'Overnight sleep saved.';
  }

  private readHistory(): OvernightSleepData[] {
    return [...SleepService.AllOvernightData]
      .sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime());
  }

  saveSleepiness(): void {
    this.sleepinessError = '';
    this.sleepinessStatus = '';
    const rating = this.sleepinessRating;
    const time = new Date(this.sleepinessTime);

    if (!this.sleepinessRatings.includes(rating)) {
      this.sleepinessError = 'Choose a sleepiness rating from 1 to 7.';
      return;
    }
    if (Number.isNaN(time.getTime())) {
      this.sleepinessError = 'Enter the date and time you felt this way.';
      return;
    }

    try {
      this.sleepService.logSleepinessData(new StanfordSleepinessData(rating, time));
    } catch {
      this.sleepinessError = 'Could not save sleepiness. Check that browser storage is available and try again.';
      return;
    }
    this.sleepinessHistory = this.readSleepinessHistory();
    this.sleepinessRating = 4;
    this.sleepinessTime = this.currentLocalTime();
    this.sleepinessStatus = 'Sleepiness saved.';
  }

  private currentLocalTime(): string {
    return formatDate(new Date(), "yyyy-MM-dd'T'HH:mm", 'en-US');
  }

  private readSleepinessHistory(): StanfordSleepinessData[] {
    return [...SleepService.AllSleepinessData]
      .sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }
}
