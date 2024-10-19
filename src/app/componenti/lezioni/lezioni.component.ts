import { Component, OnInit } from '@angular/core'; 
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lezioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lezioni.component.html',
  styleUrls: ['./lezioni.component.css'],
})
export class LezioniComponent implements OnInit {
  lezioni: any[] = [];
  corsoIscritto: any = null;

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchCorsoIscritto();
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
            console.error('Nessun corso trovato per questo studente.');
          }
        },
        error: (err) => {
          console.error('Errore nel recupero del corso iscritto:', err);
        },
      });
    }
  }

  fetchLezioni(): void {
    if (this.corsoIscritto) {
      this.dataRetrievalService.fetchLessons().subscribe({
        next: (response) => {
          this.lezioni = response
            .filter((lezione: any) => 
              lezione.corso_id === this.corsoIscritto.id &&
              lezione.corso.anno === this.corsoIscritto.anno &&
              lezione.corso.canale === this.corsoIscritto.canale
            )
            .map((lezione: any) => {
              return {
                ...lezione,
                link: JSON.parse(lezione.link),
              };
            });
        },
        error: (err) => {
          console.error('Errore recupero lezioni:', err);
        },
      });
    }
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}