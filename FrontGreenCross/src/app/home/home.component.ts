import { Component } from '@angular/core';
import { GreenCrossComponent } from '../components/green-cross/green-cross.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-home',
  imports: [GreenCrossComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
