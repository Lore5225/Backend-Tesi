import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../Services/auth-service.service';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { EditAppelloDialogComponent } from '../modifica-appello/modifica-appello.component';
import { MatNativeDateModule } from '@angular/material/core';
import { GestioneEsameDialogComponent } from '../gestione-esami-dialog/gestione-esami-dialog.component';

@Component({
  selector: 'app-gestioneappelli',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    EditAppelloDialogComponent,
    MatNativeDateModule,
    GestioneEsameDialogComponent,
  ],
  templateUrl: './gestioneappelli.component.html',
  styleUrls: ['./gestioneappelli.component.css'],
})
export class GestioneappelliComponent implements OnInit {
  userType: string = '';
  errorMessage: string = '';
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
      next: (response) => {
        this.userType = response.user_type;
        if (this.userType === 'professor') {
          this.fetchAppelli();
        } else {
          this.errorMessage = 'Accesso non autorizzato per gli studenti.';
        }
      },
      error: (err) => {
        console.error('Errore nel controllo della sessione:', err);
      },
    });
  }

  fetchAppelli(): void {
    this.dataRetrievalService.fetchAllAppelli().subscribe({
      next: (response: any[]) => {
        console.log('Risposta degli appelli (originale):', response);
      
        this.Appelli = response.filter(appello => appello.terminato !== 1);
        
        console.log('Appelli filtrati:', this.Appelli);
      },
      error: (err: any) => {
        console.error('Errore recupero appelli:', err);
        this.errorMessage = 'Errore nel recupero degli appelli.';
      },
    });
  }

  editAppello(appello: any): void {
    const dialogRef = this.dialog.open(EditAppelloDialogComponent, {
      width: '400px',
      data: { data: new Date(appello.data) },
    });

    dialogRef.afterClosed().subscribe((result: { data: Date }) => {
      if (result) {
        const data = result.data.toISOString().split('T')[0];

        this.dataRetrievalService
          .modificaAppello({ id: appello.id, data })
          .subscribe({
            next: () => {
              appello.data = data;
              console.log('Appello modificato:', appello);
            },
            error: (err) => {
              console.error("Errore nella modifica dell'appello:", err);
            },
          });
      }
    });
  }

  deleteAppello(appello: any): void {
    const confirmDelete = confirm(
      `Sei sicuro di voler rimuovere l'appello del ${appello.data}?`
    );
    if (confirmDelete) {
      this.dataRetrievalService.eliminaAppello({ id: appello.id }).subscribe({
        next: () => {
          this.Appelli = this.Appelli.filter((a) => a !== appello);
          console.log('Appello rimosso:', appello);
        },
        error: (err) => {
          console.error("Errore nella cancellazione dell'appello:", err);
        },
      });
    }
  }

  openGestisciEsameDialog(appello: any): void {
    const dialogRef = this.dialog.open(GestioneEsameDialogComponent, {
      width: '1200px',
      height: '500px',
      data: { appello },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialogo chiuso con risultato:', result);
      }
    });
  }
}
