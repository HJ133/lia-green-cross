import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

type DayStatus = 'green' | 'yellow' | 'red' | 'white';

interface Day {
  day?: number;
  status?: DayStatus | string;
  active?: boolean;
  description?: string;
}

interface ClickEvent {
  dayNo: number;
  colour: string;
  description: string;
}

@Component({
  selector: 'app-green-cross',
  imports: [CommonModule, FormsModule],
  templateUrl: './green-cross.component.html',
  styleUrls: ['./green-cross.component.scss']
})
export class GreenCrossComponent {

  private apiUrl = '/api/clickevents';

  days: Day[] = [];

  showPopup = false;
  selectedDay?: Day;
  descriptionText = '';
  selectedColour: DayStatus | string = 'white';

  constructor() {
    this.generateCross();
  }

  async generateCross() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch clicks');
      const data: ClickEvent[] = await response.json();

      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      let n = 1;

      this.days = [];

      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
          // CROSS LOGIC
          const isActive = (row >= 2 && row <= 4) || (col >= 2 && col <= 4);
          if (isActive) {
            if (n <= daysInMonth) {
              const clickForDay = data.find(c => c.dayNo === n);
              this.days.push({
                day: n++,
                status: clickForDay ? clickForDay.colour.toLowerCase() : 'white',
                description: clickForDay ? clickForDay.description : '',
                active: true
              });
            } else {
              this.days.push({ active: false });
            }
          } else {
            this.days.push({ active: false });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching clicks:', error);
    }
  }

    popupTop = 0;
  popupLeft = 0;

  openPopup(day: Day, dayDiv: HTMLElement) {
  if (!day.active || !day.day) return;

  this.selectedDay = day;
  this.selectedColour = day.status || 'white';
  this.descriptionText = day.description || '';
  this.showPopup = true;

  const rect = dayDiv.getBoundingClientRect();

  this.popupTop = rect.top + window.scrollY;
  this.popupLeft = rect.right + window.scrollX + 5;
}


  closePopup() {
    this.showPopup = false;
  }

  async saveDay() {
    if (!this.selectedDay || !this.selectedDay.day) return;

    this.selectedDay.status = this.selectedColour;
    this.selectedDay.description = this.descriptionText;


    const payload = {
      dayNo: this.selectedDay.day,
      colour: this.selectedColour,
      description: this.descriptionText
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Failed to save click to API');
      } else {
        console.log('Click saved', await response.json());
      }
    } catch (error) {
      console.error('Error posting click:', error);
    }

    this.closePopup();
  }
}
