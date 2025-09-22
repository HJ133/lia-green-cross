import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

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

interface ColorOption {
  value: DayStatus;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-green-cross',
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './green-cross.component.html',
  styleUrls: ['./green-cross.component.scss']
})
export class GreenCrossComponent {

  popupAnchor: HTMLElement | null = null;

  private apiUrl = '/api/clickevents';

  days: Day[] = [];
  
  colorOptions: ColorOption[] = [
    { value: 'green', label: 'Bra dag', icon: 'sentiment_satisfied', description: 'En positiv dag' },
    { value: 'yellow', label: 'Ok dag', icon: 'sentiment_neutral', description: 'En normal dag' },
    { value: 'red', label: 'Dålig dag', icon: 'sentiment_dissatisfied', description: 'En utmanande dag' },
    { value: 'white', label: 'Ingen data', icon: 'radio_button_unchecked', description: 'Ingen information' }
  ];

  showPopup = false;
  selectedDay?: Day;
  descriptionText = '';
  selectedColour: DayStatus | string = 'white';
  
  // View toggle
  showCalendar = true; // true = calendar view, false = comments view

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

  openPopup(day: Day, dayDiv: any) {
    if (!day.active || !day.day) return;

    this.selectedDay = day;
    this.selectedColour = day.status || 'white';
    this.descriptionText = day.description || '';
    // Accept any anchor, cast to HTMLElement or fallback to null
    this.popupAnchor = (dayDiv instanceof HTMLElement) ? dayDiv : null;
    this.showPopup = true;
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

  getActiveDaysWithComments(): Day[] {
    return this.days.filter(day => day.active && day.description && day.description.trim() !== '');
  }

  getColorDisplayName(status?: DayStatus | string): string {
    const colorOption = this.colorOptions.find(option => option.value === status);
    return colorOption ? colorOption.label : 'Standard';
  }

  selectColor(color: DayStatus): void {
    this.selectedColour = color;
  }

  toggleView(): void {
    this.showCalendar = !this.showCalendar;
  }

  getActiveDayCount(): number {
    return this.days.filter(d => d.active && d.day).length;
  }
}
