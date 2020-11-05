
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material';
import {
  RufAppCanvasModule,
  RufBannerModule,
  RufFooterModule,
  RufIconModule,
  RufMenubarModule,
  RufNavbarModule,
  RufPageHeaderModule
} from '@ruf/shell';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        RouterTestingModule,
        RufAppCanvasModule,
        RufBannerModule,
        RufFooterModule,
        RufIconModule,
        RufMenubarModule,
        RufNavbarModule,
        RufPageHeaderModule,
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  const title = 'miya-app';
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have proper title', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual(title);
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(title);
  }));
});
