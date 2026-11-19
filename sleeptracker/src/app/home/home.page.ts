import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

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

    this.sleepService.logOvernightData(new OvernightSleepData(start, end));
    this.overnightHistory = this.readHistory();
    this.bedtime = '';
    this.wakeUp = '';
    this.status = 'Overnight sleep saved.';
  }

  private readHistory(): OvernightSleepData[] {
    return [...SleepService.AllOvernightData]
      .sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime());
  }
}
