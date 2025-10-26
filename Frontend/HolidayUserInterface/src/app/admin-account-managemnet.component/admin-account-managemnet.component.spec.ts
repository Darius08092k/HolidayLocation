import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountManagemnetComponent } from './admin-account-managemnet.component';

describe('AdminAccountManagemnetComponent', () => {
  let component: AdminAccountManagemnetComponent;
  let fixture: ComponentFixture<AdminAccountManagemnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccountManagemnetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccountManagemnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
