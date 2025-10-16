import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponenet } from './auth.componenet';

describe('AuthComponenet', () => {
  let component: AuthComponenet;
  let fixture: ComponentFixture<AuthComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponenet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponenet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
