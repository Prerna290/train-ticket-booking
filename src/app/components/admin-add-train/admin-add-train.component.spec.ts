import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddTrainComponent } from './admin-add-train.component';

describe('AdminAddTrainComponent', () => {
  let component: AdminAddTrainComponent;
  let fixture: ComponentFixture<AdminAddTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddTrainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
