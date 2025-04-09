import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SidebarState {
  isCollapsed: boolean;
  position: 'left' | 'right';
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarStates: { [key: string]: BehaviorSubject<SidebarState> } = {};

  getSidebarState(id: string): Observable<SidebarState> {
    if (!this.sidebarStates[id]) {
      this.sidebarStates[id] = new BehaviorSubject<SidebarState>({
        isCollapsed: false,
        position: 'left',
      });
    }
    return this.sidebarStates[id].asObservable();
  }

  setSidebarState(id: string, state: Partial<SidebarState>): void {
    if (!this.sidebarStates[id]) {
      this.sidebarStates[id] = new BehaviorSubject<SidebarState>({
        isCollapsed: false,
        position: 'left',
      });
    }
    const currentState = this.sidebarStates[id].value;
    this.sidebarStates[id].next({ ...currentState, ...state });
  }

  toggleSidebar(id: string): void {
    const currentState = this.sidebarStates[id]?.value;
    if (currentState) {
      this.sidebarStates[id].next({
        ...currentState,
        isCollapsed: !currentState.isCollapsed,
      });
    }
  }
}
