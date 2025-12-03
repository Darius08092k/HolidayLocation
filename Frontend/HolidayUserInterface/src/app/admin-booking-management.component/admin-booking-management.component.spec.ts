import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingManagementComponent } from './admin-booking-management.component';

describe('AdminBookingManagementComponent', () => {
  let component: AdminBookingManagementComponent;
  let fixture: ComponentFixture<AdminBookingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBookingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
