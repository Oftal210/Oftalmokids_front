import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSemanalComponent } from './monitoreo-semanal.component';

describe('MonitoreoSemanalComponent', () => {
  let component: MonitoreoSemanalComponent;
  let fixture: ComponentFixture<MonitoreoSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoreoSemanalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonitoreoSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
