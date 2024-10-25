import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';

interface Appello {
  id: number;
  data: string;
  corso_id: number;
}

@Component({
  selector: 'app-prenotazioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css'],
})
export class PrenotazioniComponent implements OnInit {
  prenotazioni: Appello[] = [];
  prenotazioniStudente: Set<number> = new Set();
  userType: string = '';
  errorMessage: string = '';
  corsoId: number | null = null;

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.checkUserSession();
  }

  checkUserSession(): void {
    this.authService.checkSession().subscribe({
      next: (response) => {
        this.userType = response.user_type;
        if (this.userType === 'student') {
          this.checkIscrizione();
        } else {
          this.errorMessage = 'Accesso non autorizzato per i professori.';
        }
      },
      error: (err) => {
        console.error('Errore nel controllo della sessione:', err);
      },
    });
  }

  checkIscrizione(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService.checkIscrizione(studenteId).subscribe({
      next: (response) => {
        if (response.is_iscritto) {
          this.corsoId = response.corso.id;
          this.fetchAppelli();
        } else {
          this.errorMessage = 'Non sei iscritto a nessun corso.';
        }
      },
      error: (err) => {
        console.error("Errore nel controllo dell'iscrizione:", err);
        this.errorMessage = "Errore nel controllo dell'iscrizione.";
      },
    });
  }

  fetchAppelli(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);

    if (this.corsoId === null) {
      this.errorMessage = 'Corso non trovato.';
      return;
    }

    this.dataRetrievalService.fetchAppelli(this.corsoId).subscribe({
      next: (response: Appello[]) => {
        console.log('Risposta delle prenotazioni:', response);
        this.prenotazioni = response;

        if (studenteId) {
          this.prenotazioniStudente = new Set(
            response.map((appello) => appello.id)
          );
        }
      },
      error: (err: any) => {
        console.error('Errore recupero prenotazioni:', err);
        this.errorMessage = 'Errore nel recupero delle prenotazioni.';
      },
    });
  }

  rimuoviPrenotazione(prenotazioneId: number): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService
      .cancellaIscrizione(studenteId, prenotazioneId)
      .subscribe({
        next: () => {
          this.prenotazioni = this.prenotazioni.filter(
            (p) => p.id !== prenotazioneId
          );
          this.prenotazioniStudente.delete(prenotazioneId);
        },
        error: (err) => {
          console.error('Errore nella cancellazione della prenotazione:', err);
        },
      });
  }
}
