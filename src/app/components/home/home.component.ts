import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faCalendarDays,
  faLocationDot,
  faTrain,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  faTrain = faTrain;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faLocationDot = faLocationDot;
  faCalendarDays = faCalendarDays;
}
