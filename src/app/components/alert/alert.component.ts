import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleExclamation,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() messageType: 'error' | 'info' = 'error';
  @Input() errorMessage = 'Required Field';
  @Input() infoMessage!: string;

  faCircleExclamation = faCircleExclamation;
  faCircleInfo = faCircleInfo;
}
