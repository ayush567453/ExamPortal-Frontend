import { LocationStrategy } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QuestionService } from 'src/app/services/question.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import baseUrl from 'src/app/services/helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit, OnDestroy {
  qid: any;
  questions: any;

  marksGot = 0;
  correctAnswers = 0;
  attempted = 0;

  isSubmit = false;
  timer: any;

  // Webcam
  webcamStream: MediaStream | null = null;
  snapshotInterval: any;
  webcamError = '';

  // Screen recording
  screenStream: MediaStream | null = null;
  mediaRecorder: any = null;
  recordedChunks: Blob[] = [];
  isRecording = false;
  screenError = '';

  // AI proctoring
  proctoringAlert = false;
  proctoringMessage = '';
  proctoringCaption = '';
  isAnalyzing = false;

  constructor(
    private locationSt: LocationStrategy,
    private _route: ActivatedRoute,
    private _question: QuestionService,
    private _login: LoginService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.preventBackButton();
    this.qid = this._route.snapshot.params['qid'];
    this.loadQuestions();
    this.startWebcam();
    this.startScreenRecording();
  }

  ngOnDestroy(): void {
    this.stopAll();
  }

  loadQuestions() {
    this._question.getQuestionsOfQuizForTest(this.qid).subscribe(
      (data: any) => {
        this.questions = data;
        this.timer = this.questions.length * 2 * 60;
        this.startTimer();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error in loading questions of quiz', 'error');
      }
    );
  }

  async startWebcam() {
    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      // Wait for the DOM element to be available
      setTimeout(() => {
        const video = document.getElementById('webcamVideo') as HTMLVideoElement;
        if (video) {
          video.srcObject = this.webcamStream;
        }
      }, 500);
      // First check after 5 seconds, then every 20 seconds
      setTimeout(() => this.captureAndSendSnapshot(), 5000);
      this.snapshotInterval = setInterval(() => this.captureAndSendSnapshot(), 20000);
    } catch (err) {
      this.webcamError = 'Camera access denied. Please allow camera for proctoring.';
      console.error('Webcam error:', err);
    }
  }

  async startScreenRecording() {
    try {
      this.screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: true });
      this.recordedChunks = [];

      const MR = (window as any).MediaRecorder;
      const mimeType = MR.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      this.mediaRecorder = new MR(this.screenStream!, { mimeType });

      this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      });

      this.mediaRecorder.start(1000);
      this.isRecording = true;

      // If user stops screen share manually
      const videoTrack = this.screenStream!.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          this.isRecording = false;
        };
      }
    } catch (err) {
      this.screenError = 'Screen recording denied. Please allow screen sharing for proctoring.';
      console.error('Screen recording error:', err);
    }
  }

  captureAndSendSnapshot() {
    if (!this.webcamStream) return;
    const video = document.getElementById('webcamVideo') as HTMLVideoElement;
    if (!video || !video.videoWidth) {
      setTimeout(() => this.captureAndSendSnapshot(), 2000);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.7);
    const user = this._login.getUser();

    // 1. Save snapshot to backend (no internet needed on server)
    this.http.post(`${baseUrl}/proctoring/snapshot`, {
      username: user?.username || 'unknown',
      quizId: this.qid,
      imageData: imageData
    }).subscribe({ error: (e) => console.error('[Proctoring] save error:', e) });

    // 2. AI analysis: call HuggingFace directly from browser (has internet)
    this.analyzeWithHuggingFace(imageData);
  }

  private async analyzeWithHuggingFace(imageData: string): Promise<void> {
    this.isAnalyzing = true;
    try {
      // Convert base64 → binary bytes
      const base64 = imageData.split(',')[1];
      const byteArr = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      // Use native fetch to bypass Angular JWT interceptor
      const response = await fetch(
        'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${environment.huggingFaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          body: byteArr
        }
      );

      const result = await response.json();
      console.log('[Proctoring] HF response:', result);

      const caption: string = Array.isArray(result) && result[0]?.generated_text
        ? result[0].generated_text
        : '';

      this.proctoringCaption = caption;
      const alertMsg = this.checkCaption(caption);
      this.proctoringAlert   = !!alertMsg;
      this.proctoringMessage = alertMsg;
      this.isAnalyzing = false;

      console.log('[Proctoring] caption:', caption, '| alert:', this.proctoringAlert);

      if (this.proctoringAlert) {
        Swal.fire({
          title: 'Proctoring Alert',
          text: alertMsg,
          icon: 'warning',
          timer: 6000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (e) {
      this.isAnalyzing = false;
      console.error('[Proctoring] HF fetch error:', e);
    }
  }

  private checkCaption(caption: string): string {
    if (!caption) return '';
    const c = caption.toLowerCase();
    const hasPerson = ['person','man','woman','student','face','people','boy','girl']
      .some(w => c.includes(w));

    if (!hasPerson)
      return 'No face detected — please sit in front of the camera';
    if (['two people','two men','two women','group','crowd','multiple'].some(w => c.includes(w)))
      return 'Multiple people detected — only you should be present';
    if (['phone','mobile','book','paper','notes','notebook'].some(w => c.includes(w)))
      return 'Suspicious material detected — remove reference materials';
    if (['looking away','looking down','looking sideways'].some(w => c.includes(w)))
      return 'Please keep your eyes on the screen';
    return '';
  }

  stopAll() {
    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
      this.snapshotInterval = null;
    }
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
      this.webcamStream = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
      this.screenStream = null;
    }
  }

  async uploadScreenRecording(): Promise<void> {
    if (this.recordedChunks.length === 0) return;
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const user = this._login.getUser();
    const formData = new FormData();
    formData.append('file', blob, `recording_quiz${this.qid}.webm`);
    formData.append('username', user?.username || 'unknown');
    formData.append('quizId', String(this.qid));

    try {
      await this.http.post(`${baseUrl}/proctoring/screen-recording`, formData).toPromise();
    } catch (e) {
      console.error('Screen recording upload error:', e);
    }
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  submitQuiz() {
    Swal.fire({
      title: 'Do you want to submit the quiz?',
      showCancelButton: true,
      confirmButtonText: `Submit`,
      icon: 'info',
    }).then((e) => {
      if (e.isConfirmed) {
        this.evalQuiz();
      }
    });
  }

  startTimer() {
    let t = window.setInterval(() => {
      if (this.timer <= 0) {
        this.evalQuiz();
        clearInterval(t);
      } else {
        this.timer--;
      }
    }, 1000);
  }

  getFormattedTime() {
    let mm = Math.floor(this.timer / 60);
    let ss = this.timer - mm * 60;
    return `${mm} min : ${ss} sec`;
  }

  evalQuiz() {
    // Stop recording, wait for final chunk, then upload
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      setTimeout(async () => {
        await this.uploadScreenRecording();
        this.stopAll();
      }, 600);
    } else {
      this.stopAll();
    }

    this._question.evalQuiz(this.questions).subscribe(
      (data: any) => {
        this.marksGot = data.marksGot;
        this.correctAnswers = data.correctAnswers;
        this.attempted = data.attempted;
        this.isSubmit = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
