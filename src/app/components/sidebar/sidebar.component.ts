import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

export type SidebarPosition = 'left' | 'right';
export type SidebarWidth = 'small' | 'medium' | 'large';
// export type SidebarTheme = 'light' | 'dark' | 'custom';

export interface SidebarLabel {
  label: string;
  icon?: string;
  path?: string;
  children?: SidebarLabel[];
  isExpanded?: boolean;
}

export interface SidebarSection {
  header: string;
  icon?: string;
  labels: SidebarLabel[];
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
  @Input() backgroundHighlightColor: string = '#e0f7fa';
  @Input() items: SidebarSection[] = [];
  @Input() activeItemPath: string = '';
  @Input() sidebarId: string = '';
  @Input() collapsible: boolean = true;
  @Input() hideSidebarOnPathChange: boolean = true;
  @Input() closeOnClickOutside: boolean = false;
  // @Input() theme: SidebarTheme = 'light';
  // @Input() customClass: string = '';

  @Output() sidebarItemSelected = new EventEmitter<SidebarLabel>();
  @Output() toggleSidebar = new EventEmitter<boolean>();

  isCollapsed = false;
  hoverItemIndex: number | null = null; // corresponds to i
  hoverLabelIndex: number | null = null; // corresponds to j
  hoverChildIndex: number | null = null; // corresponds to k

  private stateSubscription?: Subscription;

  constructor(private sidebarService: SidebarService, private router: Router) {}

  ngOnInit(): void {
    this.sidebarService.setSidebarState(this.sidebarId, {
      isCollapsed: this.isCollapsed,
      position: this.position,
    });

    this.stateSubscription = this.sidebarService
      .getSidebarState(this.sidebarId)
      .subscribe((state) => {
        console.log(state);
        this.isCollapsed = state.isCollapsed;
        this.position = state.position;
      });

    if (this.hideSidebarOnPathChange) {
      this.stateSubscription.add(
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.sidebarService.setSidebarState(this.sidebarId, {
              isCollapsed: true,
            });
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }

  toggleSidebarState(): void {
    if (!this.collapsible) return;
    this.sidebarService.toggleSidebar(this.sidebarId);
    this.toggleSidebar.emit(this.isCollapsed);
  }

  onItemClick(item: SidebarLabel, event: Event): void {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
      event.preventDefault();
    } else if (item.path) {
      this.sidebarItemSelected.emit(item);
    }
  }
}

// activeItemPath = '/dashboard';
// highlightColor = '#e3f2fd';

// import { SidebarComponent, SidebarItem } from '../sidebar/sidebar.component';

// Icons
// on page change SidebarComponent, should not hide
// hideSidebarOnPathChange not working
// closeOnClickOutside not working

// <app-sidebar
//   [position]="'left'"
//   [width]="'small'"
//   [items]="sidebarItems"
//   [activeItemPath]="activeItemPath"
//   [backgroundHighlightColor]="'#4A5568'"
//   [sidebarId]="'leftt'"
//   [collapsible]="false"
//   [hideSidebarOnPathChange]="true"
//   [closeOnClickOutside]="true"
// >
//   <div sidebarHeaderContent>
//     <h3>My Bookings</h3>
//   </div>
//   <div sidebarFooterContent>
//     <h3>My Bookings 2</h3>
//   </div>
// </app-sidebar>

// <app-sidebar
//   [title]="'My App'"
//   [sidebarId]="'rightt'"
//   [position]="'right'"
//   [width]="'medium'"
//   [items]="sidebarItems"
//   [activeItemPath]="activeItemPath"
//   [backgroundHighlightColor]="'#FF3D71'"
// >
// </app-sidebar>
