import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export type ToastType = 'success' | 'error';
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
  @Input() messageType: ToastType = 'success';
  @Input() dismissible = false;
  showToast = false;
  timeout: any;

  icons = {
    success: faCircleCheck,
    error: faCircleExclamation,
    warning: faTriangleExclamation,
    info: faCircleInfo,
  };
  faXmark = faXmark;

  ngOnInit() {}

  showToastPopup(message: string, messageType: ToastType) {
    this.message = message;
    this.messageType = messageType;
    this.showToast = true;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.duration > 0) {
      this.timeout = setTimeout(() => {
        this.showToast = false;
        this.message = '';
      }, this.duration);
    }
  }

  dismiss() {
    this.showToast = false;
    this.message = '';
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
