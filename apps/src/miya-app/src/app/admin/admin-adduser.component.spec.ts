import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddUserComponent } from './admin-adduser.component';

describe('AdminAddUserComponent', () => {
  let component: AdminAddUserComponent;
  let fixture: ComponentFixture<AdminAddUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
