import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipPlacement } from './ship-placement';

describe('ShipPlacement', () => {
  let component: ShipPlacement;
  let fixture: ComponentFixture<ShipPlacement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipPlacement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipPlacement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
