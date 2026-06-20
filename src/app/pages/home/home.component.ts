<<<<<<< HEAD
import {
  Component, OnInit, OnDestroy,
  ViewChild, ElementRef,
  AfterViewChecked, AfterViewInit,
} from '@angular/core';
import { LlmService } from 'src/app/components/llm.service';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
<<<<<<< HEAD
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  /* ── Chatbot ── */
  isChatbotOpen = false;
  chatQuestion = '';
  isLoading = false;
  messages: { role: 'user' | 'bot'; text: string }[] = [];

  /* ── Typewriter ── */
  typewriterText = 'Management';
  private twWords = ['Management', 'Excellence', 'Innovation', 'Growth'];
  private twIndex = 0;
  private twChar = 0;
  private twDeleting = false;
  private twTimer: any;

  /* ── Stats counters ── */
  s0 = 0; s1 = 0; s2 = 0; s3 = 0;
  private statsAnimated = false;
  private statsTimer: any;

  /* ── Observers ── */
  private observers: IntersectionObserver[] = [];

  constructor(private llmService: LlmService) {}

  ngOnInit(): void {
    this.runTypewriter();
  }

  ngAfterViewInit(): void {
    this.initScrollReveal();
    this.initStatsObserver();
  }

  ngOnDestroy(): void {
    clearTimeout(this.twTimer);
    clearInterval(this.statsTimer);
    this.observers.forEach(o => o.disconnect());
  }

  /* ── Typewriter ── */
  private runTypewriter(): void {
    const word = this.twWords[this.twIndex];
    if (!this.twDeleting) {
      this.typewriterText = word.substring(0, this.twChar + 1);
      this.twChar++;
    } else {
      this.typewriterText = word.substring(0, this.twChar - 1);
      this.twChar--;
    }
    if (!this.twDeleting && this.twChar === word.length) {
      this.twTimer = setTimeout(() => { this.twDeleting = true; this.runTypewriter(); }, 2200);
      return;
    }
    if (this.twDeleting && this.twChar === 0) {
      this.twDeleting = false;
      this.twIndex = (this.twIndex + 1) % this.twWords.length;
    }
    this.twTimer = setTimeout(() => this.runTypewriter(), this.twDeleting ? 55 : 110);
  }

  /* ── Stats animation ── */
  private initStatsObserver(): void {
    const el = document.querySelector('.stats-section');
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.statsAnimated) {
        this.statsAnimated = true;
        this.animateStats();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    this.observers.push(obs);
  }

  private animateStats(): void {
    const steps = 80;
    let step = 0;
    this.statsTimer = setInterval(() => {
      step++;
      const p = step / steps;
      const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      this.s0 = Math.round(500 * e);
      this.s1 = Math.round(50000 * e);
      this.s2 = Math.round(100000 * e);
      this.s3 = parseFloat((99.9 * e).toFixed(1));
      if (step >= steps) clearInterval(this.statsTimer);
    }, 2000 / steps);
  }

  formatK(n: number): string { return n >= 1000 ? Math.round(n / 1000) + 'K+' : n + '+'; }

  /* ── Scroll reveal ── */
  private initScrollReveal(): void {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 200);
    this.observers.push(obs);
  }

  /* ── Chatbot ── */
  toggleChatbot() { this.isChatbotOpen = !this.isChatbotOpen; }

  sendQuestion() {
    if (!this.chatQuestion.trim() || this.isLoading) return;
    const q = this.chatQuestion.trim();
    this.messages.push({ role: 'user', text: q });
    this.chatQuestion = '';
    this.isLoading = true;
    this.llmService.askQuestion(q).subscribe(
      r => { this.isLoading = false; this.messages.push({ role: 'bot', text: r || 'No answer found.' }); },
      _ => { this.isLoading = false; this.messages.push({ role: 'bot', text: 'Something went wrong.' }); }
    );
  }

  ngAfterViewChecked(): void {
    try {
      if (this.chatMessagesRef)
        this.chatMessagesRef.nativeElement.scrollTop = this.chatMessagesRef.nativeElement.scrollHeight;
    } catch {}
  }
=======
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
}
