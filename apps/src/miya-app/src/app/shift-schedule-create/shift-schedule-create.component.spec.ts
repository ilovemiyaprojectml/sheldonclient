import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftScheduleCreateComponent } from './shift-schedule-create.component';

describe('ShiftScheduleCreateComponent', () => {
  let component: ShiftScheduleCreateComponent;
  let fixture: ComponentFixture<ShiftScheduleCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftScheduleCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftScheduleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
