import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Lezione {
  id: number;
  ordine: number;
  data: string;
  link: { nome: string; url: string }[];
  argomento: string;
  canale: string;
  corso_id: number;
}

@Component({
  selector: 'app-lezioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lezioni.component.html',
  styleUrls: ['./lezioni.component.css'],
})
export class LezioniComponent implements OnInit {
  lezioni: Lezione[] = [];
  lezioniCanaleA_L: Lezione[] = [];
  lezioniCanaleM_Z: Lezione[] = [];
  corsoIscritto: any = null;
  userType: string = '';
  isLoading: boolean = true;

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private authService: AuthServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.checkUserSession();
  }

  checkUserSession(): void {
    this.authService.checkSession().subscribe({
      next: (response) => {
        this.userType = response.user_type;
        this.userType === 'professor'
          ? this.fetchLezioni()
          : this.fetchCorsoIscritto();
      },
      error: (err) => {
        console.error('Errore nel controllo della sessione:', err);
        this.isLoading = false;
      },
    });
  }

  fetchCorsoIscritto(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);

    if (studenteId) {
      this.dataRetrievalService.checkIscrizione(studenteId).subscribe({
        next: (response) => {
          if (response.is_iscritto) {
            this.corsoIscritto = response.corso;
            this.fetchLezioni();
          } else {
            console.warn('Nessun corso trovato per questo studente.');
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Errore nel recupero del corso iscritto:', err);
          this.isLoading = false;
        },
      });
    }
  }

  fetchLezioni(): void {
    this.dataRetrievalService.fetchLessons().subscribe({
      next: (response) => {
        console.log(response);
        this.lezioni = response.map((lezione: any) => ({
          id: lezione.id,
          ordine: lezione.ordine,
          data: lezione.data,
          link: JSON.parse(lezione.link),
          argomento: lezione.argomento,
          canale: lezione.canale,
          corso_id: lezione.corso_id,
        }));
        console.log(this.lezioni);

        if (this.userType === 'student' && this.corsoIscritto) {
          this.lezioni = this.lezioni.filter(
            (lezione) => lezione.corso_id === this.corsoIscritto.id
          );
        } else if (this.userType === 'professor') {
          this.divideLezioniPerCanale();
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore recupero lezioni:', err);
        this.isLoading = false;
      },
    });
  }
  divideLezioniPerCanale(): void {
    this.lezioniCanaleA_L = this.lezioni.filter(
      (lezione) => lezione.canale === 'A-L'
    );
    this.lezioniCanaleM_Z = this.lezioni.filter(
      (lezione) => lezione.canale === 'M-Z'
    );
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
