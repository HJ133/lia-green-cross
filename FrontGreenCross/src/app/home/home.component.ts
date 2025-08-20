import { Component } from '@angular/core';
import { GreenCrossComponent } from '../components/green-cross/green-cross.component';

@Component({
  selector: 'app-home',
  imports: [GreenCrossComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
