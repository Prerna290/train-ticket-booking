import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterModule } from '@angular/router';

export type SidebarPosition = 'left' | 'right';
export type SidebarWidth = 'small' | 'medium' | 'large';

export interface SidebarItem {
  label: string;
  icon?: string;
  path?: string;
  children?: SidebarItem[];
  isExpanded?: boolean;
  isHeader?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() position: SidebarPosition = 'left';
  @Input() width: SidebarWidth = 'medium';
  @Input() title: string = '';
  @Input() highlightColor: string = '#f0f7ff';
  @Input() items: SidebarItem[] = [];
  @Input() activeItemPath: string = '';

  isCollapsed = false;

  @Output() itemClick = new EventEmitter<SidebarItem>();

  @HostBinding('class')
  get hostClasses(): string {
    return `sidebar-${this.position} sidebar-${this.width}`;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  trackByFn(index: number, item: SidebarItem): string {
    return item.label + (item.path || '');
  }

  onItemClick(item: SidebarItem, event: Event): void {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
      event.preventDefault();
    } else if (item.path) {
      this.itemClick.emit(item);
    }
  }
}

// <app-sidebar
//   [title]="'My App'"
//   [position]="'left'"
//   [width]="'medium'"
//   [items]="sidebarItems"
//   [activeItemPath]="activeItemPath"
//   [highlightColor]="'4A5568'"
// >
// </app-sidebar>

// <app-sidebar
//   [title]="'My App'"
//   [position]="'right'"
//   [width]="'medium'"
//   [items]="sidebarItems"
//   [activeItemPath]="activeItemPath"
//   [highlightColor]="'4A5568'"
// >
// </app-sidebar>
// 1. Make Service
// 2. Icons
// 3. on page change SidebarComponent, should not hide

// sidebarItems: SidebarItem[] = [
//   { label: 'Dashboard', icon: 'fas fa-home', path: '/admin' },
//   { label: 'Documents', icon: 'fas fa-file', path: '/home' },
//   { label: 'Integrations', icon: 'fas fa-plug', path: '/integrations' },
//   { isHeader: true, label: 'COMPLIANCE' },
//   {
//     label: 'Frameworks',
//     icon: 'fas fa-shield-alt',
//     children: [
//       { label: 'Controls', path: '/admin' },
//       { label: 'Monitors', path: '/frameworks/monitors' },
//     ],
//   },
// ];

// activeItemPath = '/dashboard';
// highlightColor = '#e3f2fd';

// import { SidebarComponent, SidebarItem } from '../sidebar/sidebar.component';
