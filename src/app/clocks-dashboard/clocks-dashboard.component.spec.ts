import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClocksDashboardComponent } from './clocks-dashboard.component';

describe('ClocksDashboardComponent', () => {
  let component: ClocksDashboardComponent;
  let fixture: ComponentFixture<ClocksDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClocksDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClocksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
