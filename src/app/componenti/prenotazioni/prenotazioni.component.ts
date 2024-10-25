import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prenotazioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css'],
})
export class PrenotazioniComponent implements OnInit {
  Appelli: any[] = [];
  prenotazioniMap: { [appelloId: number]: boolean } = {};
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
          this.fetchAppelli(); // Chiamata per recuperare gli appelli
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
    if (this.corsoId === null) {
      this.errorMessage = 'Corso non trovato.';
      return;
    }
    this.dataRetrievalService.fetchAppelli(this.corsoId).subscribe({
      next: (response: any[]) => {
        console.log('Risposta degli appelli:', response);
        this.Appelli = response;
        this.fetchPrenotazioni();
      },
      error: (err: any) => {
        console.error('Errore recupero appelli:', err);
        this.errorMessage = 'Errore nel recupero degli appelli.';
      },
    });
  }

  fetchPrenotazioni(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService.fetchPrenotazioni(studenteId).subscribe({
      next: (response: any[]) => {
        console.log('Risposta delle prenotazioni:', response);
        this.Appelli.forEach((appello) => {
          this.prenotazioniMap[appello.id] = response.some(
            (prenotazione) => prenotazione.appello_id === appello.id
          );
        });
      },
      error: (err: any) => {
        console.error('Errore recupero prenotazioni:', err);
        this.errorMessage = 'Errore nel recupero delle prenotazioni.';
      },
    });
  }

  prenotaAppello(appelloId: number): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService.prenotaAppello(studenteId, appelloId).subscribe({
      next: () => {
        this.prenotazioniMap[appelloId] = true;
      },
      error: (err: any) => {
        console.error('Errore nella prenotazione:', err);
      },
    });
  }

  rimuoviPrenotazione(appelloId: number): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService
      .rimuoviPrenotazione(studenteId, appelloId)
      .subscribe({
        next: () => {
          delete this.prenotazioniMap[appelloId];
        },
        error: (err) => {
          console.error('Errore nella cancellazione della prenotazione:', err);
        },
      });
  }
}
