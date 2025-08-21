import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  imports: [HomeComponent],
  template: `
    <app-home />
  `,
  styles: [],
})
export class AppComponent {
  title = 'green-cross-project';
}
