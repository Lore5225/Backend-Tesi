import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.css'],
})
export class HomeContentComponent implements OnInit {
  todayDate!: string;
  userType!: string;
  userId!: number;
  userName!: string;
  lezioni: any[] = [];
  ultimeLezioni: any[] = [];
  avvisi: any[] = [];
  ultimiAvvisi: any[] = [];
  corsoIscritto: any = null;
  isLoading: boolean = true;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private dataRetrievalService: DataRetrievalServiceService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    this.authService.checkSession().subscribe({
      next: (response) => {
        if (!response.logged_in) {
          this.router.navigate(['/login']);
        } else {
          this.userType = response.user_type;
          this.userId = response.user_id;
          this.userName = response.name;
          this.isLoading = false;

          if (this.userType === 'professor') {
            this.fetchLezioniProfessore();
          } else {
            this.fetchCorsoIscritto();
          }
        }
      },
      error: (err) => {
        console.error('Errore verifica sessione:', err);
        this.router.navigate(['/login']);
      },
    });
  }

  fetchCorsoIscritto(): void {
    this.isLoading = true;
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    if (studenteId) {
      this.dataRetrievalService.checkIscrizione(studenteId).subscribe({
        next: (response) => {
          if (response.is_iscritto) {
            this.corsoIscritto = response.corso;
            this.fetchLezioni();
            this.fetchAvvisi();
          } else {
            console.error('Nessun corso trovato per questo studente.');
            this.avvisi = [];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Errore nel recupero del corso iscritto:', err);
          this.isLoading = false;
        },
      });
    }
  }

  fetchAvvisi(): void {
    if (this.corsoIscritto) {
      this.dataRetrievalService.fetchAvvisi().subscribe({
        next: (response) => {
          this.avvisi = response.filter(
            (avviso: any) =>
              avviso.corso_id === this.corsoIscritto.id &&
              avviso.corso.canale === this.corsoIscritto.canale &&
              avviso.corso.anno === this.corsoIscritto.anno
          );
        },
        error: (err) => {
          console.error('Errore recupero avvisi:', err);
        },
      });
    } else {
      this.avvisi = [];
    }
  }

  fetchLezioni(): void {
    if (this.corsoIscritto) {
      this.dataRetrievalService.fetchLessons().subscribe({
        next: (response) => {
          this.lezioni = response
            .filter(
              (lezione: any) =>
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
          this.ultimeLezioni = this.lezioni.slice(-3);
        },
        error: (err) => {
          console.error('Errore recupero lezioni:', err);
        },
      });
    }
  }

  fetchLezioniProfessore(): void {
    this.isLoading = true;
    this.dataRetrievalService.fetchLessons().subscribe({
      next: (response) => {
        this.lezioni = response.map((lezione: any) => ({
          ...lezione,
          link: JSON.parse(lezione.link),
        }));
        this.ultimeLezioni = this.lezioni.slice(-3);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore recupero lezioni per professore:', err);
        this.isLoading = false;
      },
    });
  }

  navigateToNuovoAvviso(): void {
    this.router.navigate(['/home/nuovoavviso']);
  }

  navigateToNuovoMateriale(): void {
    this.router.navigate(['/home/nuovomateriale']);
  }

  navigateToLezioni(): void {
    this.router.navigate(['/home/lezioni']);
  }

  navigateToAvvisi(): void {
    this.router.navigate(['/home/avvisi']);
  }

  navigateToAllenati(): void {
    this.router.navigate(['/home/allenati']);
  }

  navigateToEsami(): void {
    this.router.navigate(['/home/esami']);
  }
}
