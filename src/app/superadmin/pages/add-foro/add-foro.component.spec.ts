import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForoComponent } from './add-foro.component';

describe('AddForoComponent', () => {
  let component: AddForoComponent;
  let fixture: ComponentFixture<AddForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddForoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
