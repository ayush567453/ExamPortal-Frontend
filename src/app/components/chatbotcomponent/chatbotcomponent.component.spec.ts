import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotcomponentComponent } from './chatbotcomponent.component';

describe('ChatbotcomponentComponent', () => {
  let component: ChatbotcomponentComponent;
  let fixture: ComponentFixture<ChatbotcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotcomponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
