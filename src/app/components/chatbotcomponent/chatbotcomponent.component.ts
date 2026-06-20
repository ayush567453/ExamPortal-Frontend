import { Component, OnInit } from '@angular/core';
import { LlmService } from '../llm.service';

@Component({
  selector: 'app-chatbotcomponent',
  templateUrl: './chatbotcomponent.component.html',
  styleUrls: ['./chatbotcomponent.component.css']
})
export class ChatbotcomponentComponent implements OnInit {

  question: string = '';
  answer: string = '';

  constructor(private llmService: LlmService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  submitQuestion() {
    debugger;
    this.llmService.askQuestion(this.question).subscribe(
      (response) => this.answer = response,
      (error) => this.answer = 'Error: ' + error.message
    );
  }
}
