import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() message = '';
  @Input() duration = 7000;
  @Input() messageType: 'success' | 'error' | 'warning' | 'info' = 'success';
  showToast = false;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faCircleExclamation = faCircleExclamation;
  faCircleInfo = faCircleInfo;

  ngOnInit() {
  }

  showToastPopup(
    message: string,
    messageType: 'success' | 'error' | 'warning' | 'info'
  ) {
    this.message = message;
    this.messageType = messageType;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.message = '';
    }, this.duration);
  }
