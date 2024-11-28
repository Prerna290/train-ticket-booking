import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() message = '';
  @Input() duration = 3000;
  @Input() messageType = 'success';
  visible = false;

  ngOnInit() {
    console.log('called');
    if (this.message) {
      this.showToast();
    }
  }

  showToast() {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
      this.message = '';
    }, this.duration);
  }
}
