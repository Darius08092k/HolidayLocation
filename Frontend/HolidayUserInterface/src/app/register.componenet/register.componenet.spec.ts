import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponenet } from './register.componenet';

describe('RegisterComponenet', () => {
  let component: RegisterComponenet;
  let fixture: ComponentFixture<RegisterComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponenet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponenet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
