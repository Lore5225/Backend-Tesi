import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../Services/auth-service.service';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ValutazioneDialogComponent } from '../valutazione-dialog/valutazione-dialog.component';
import { RiepilogoEsitiDialogComponent } from '../riepilogo-esiti-dialog/riepilogo-esiti-dialog.component';

@Component({
  selector: 'app-valutazione',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  templateUrl: './valutazione.component.html',
  styleUrls: ['./valutazione.component.css'],
})
export class ValutazioneComponent implements OnInit {
  errorMessage: string = '';
  userType: string = '';
  Appelli: any[] = [];

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private authService: AuthServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkUserSession();
  }

  checkUserSession(): void {
    this.authService.checkSession().subscribe({
      next: (response: { user_type: string }) => {
        this.userType = response.user_type;
        if (this.userType === 'professor') {
          this.fetchAppelli();
        } else {
          this.errorMessage = 'Accesso non autorizzato per gli studenti.';
        }
      },
      error: (err: any) => {
        console.error('Errore nel controllo della sessione:', err);
      },
    });
  }

  fetchAppelli(): void {
    this.dataRetrievalService.fetchAllAppelli().subscribe({
      next: (response: any[]) => {
        console.log('Risposta degli appelli:', response);
        this.Appelli = response.filter((appello) => appello.terminato);
      },
      error: (err: any) => {
        console.error('Errore recupero appelli:', err);
        this.errorMessage = 'Errore nel recupero degli appelli.';
      },
    });
  }

  openGestisciValutazioniDialog(appello: any): void {
    const dialogRef = this.dialog.open(ValutazioneDialogComponent, {
      width: '1800px',
      height: '600px',
      data: appello,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog chiuso con il risultato:', result);
    });
  }

  openRiepilogoEsitiDialog(appello: any): void {
    const dialogRef = this.dialog.open(RiepilogoEsitiDialogComponent, {
      width: '1600px',
      height: '500px',
      data: appello,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog Riepilogo Esiti chiuso con il risultato:', result);
    });
  }
}
