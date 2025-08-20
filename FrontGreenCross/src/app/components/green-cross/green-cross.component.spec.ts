import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenCrossComponent } from './green-cross.component';

describe('GreenCrossComponent', () => {
  let component: GreenCrossComponent;
  let fixture: ComponentFixture<GreenCrossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenCrossComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenCrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
