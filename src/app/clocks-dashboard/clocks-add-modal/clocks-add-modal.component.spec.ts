import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClocksAddModalComponent } from './clocks-add-modal.component';

describe('ClocksAddModalComponent', () => {
  let component: ClocksAddModalComponent;
  let fixture: ComponentFixture<ClocksAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClocksAddModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClocksAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
