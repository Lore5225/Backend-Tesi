import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PrenotazioneDialogComponent } from '../prenotazioni-dialog/prenotazioni-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prenotazioni',
  standalone: true,
  imports: [CommonModule, PrenotazioneDialogComponent],
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css'],
})
export class PrenotazioniComponent implements OnInit {
  Appelli: any[] = [];
  prenotazioni: any[] = [];
  prenotazioniMap: { [appelloId: number]: boolean } = {};
  userType: string = '';
  errorMessage: string = '';
  corsoId: number | null = null;
  loading: boolean = true;

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private authService: AuthServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
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
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Errore nel controllo della sessione:', err);
        this.loading = false;
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
          this.loading = false;
        }
      },
      error: (err) => {
        console.error("Errore nel controllo dell'iscrizione:", err);
        this.errorMessage = "Errore nel controllo dell'iscrizione.";
        this.loading = false;
      },
    });
  }

  fetchAppelli(): void {
    if (this.corsoId === null) {
      this.errorMessage = 'Corso non trovato.';
      this.loading = false;
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
        this.loading = false;
      },
    });
  }

  fetchPrenotazioni(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService.fetchPrenotazioni(studenteId).subscribe({
      next: (response: any[]) => {
        console.log('Risposta delle prenotazioni:', response);
        this.prenotazioni = response;
        this.Appelli.forEach((appello) => {
          this.prenotazioniMap[appello.id] = response.some(
            (prenotazione) => prenotazione.appello_id === appello.id
          );
        });
        this.Appelli = this.Appelli.filter(
          (appello) =>
            !appello.iniziato ||
            (appello.iniziato &&
              !appello.terminato &&
              this.prenotazioniMap[appello.id])
        );
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Errore recupero prenotazioni:', err);
        this.errorMessage = 'Errore nel recupero delle prenotazioni.';
        this.loading = false;
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

  openDatiDialog(appello: any): void {
    const prenotazione = this.prenotazioni.find(
      (p) => p.appello_id === appello.id
    );
    this.dialog.open(PrenotazioneDialogComponent, {
      width: '750px',
      data: {
        appello: appello,
        prenotazione_id: prenotazione ? prenotazione.id : null,
      },
    });
  }
}
