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
  undoOvernightId: string | null = null;
  overnightHistory = this.readHistory();

  readonly sleepinessRatings = [1, 2, 3, 4, 5, 6, 7];
  sleepinessRating = 4;
  sleepinessTime = this.currentLocalTime();
  sleepinessError = '';
  sleepinessStatus = '';
  undoSleepinessId: string | null = null;
  sleepinessHistory = this.readSleepinessHistory();

  constructor(private sleepService: SleepService) {}

  jumpToForm(heading: HTMLElement): void {
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start' });
  }

  saveOvernight(): void {
    this.error = '';
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

    const entry = new OvernightSleepData(start, end);
    try {
      this.sleepService.logOvernightData(entry);
    } catch {
      this.error = 'Could not save overnight sleep. Check that browser storage is available and try again.';
      return;
    }
    this.undoOvernightId = entry.id;
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

    const entry = new StanfordSleepinessData(rating, time);
    try {
      this.sleepService.logSleepinessData(entry);
    } catch {
      this.sleepinessError = 'Could not save sleepiness. Check that browser storage is available and try again.';
      return;
    }
    this.undoSleepinessId = entry.id;
    this.sleepinessHistory = this.readSleepinessHistory();
    this.sleepinessRating = 4;
    this.sleepinessTime = this.currentLocalTime();
    this.sleepinessStatus = 'Sleepiness saved.';
  }

  undoSave(type: 'overnight' | 'sleepiness'): void {
    const id = type === 'overnight' ? this.undoOvernightId : this.undoSleepinessId;
    if (!id) return;

    try {
      this.sleepService.removeLog(id);
    } catch {
      const message = 'Could not undo the save. The entry is still in your history.';
      if (type === 'overnight') this.error = message;
      else this.sleepinessError = message;
      return;
    }

    if (type === 'overnight') {
      this.undoOvernightId = null;
      this.error = '';
      this.status = 'Overnight sleep entry removed.';
      this.overnightHistory = this.readHistory();
    } else {
      this.undoSleepinessId = null;
      this.sleepinessError = '';
      this.sleepinessStatus = 'Sleepiness entry removed.';
      this.sleepinessHistory = this.readSleepinessHistory();
    }
  }

  private currentLocalTime(): string {
    return formatDate(new Date(), "yyyy-MM-dd'T'HH:mm", 'en-US');
  }

  private readSleepinessHistory(): StanfordSleepinessData[] {
    return [...SleepService.AllSleepinessData]
      .sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }
}
