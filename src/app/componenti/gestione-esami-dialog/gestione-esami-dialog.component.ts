import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestione-esame-dialog',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './gestione-esami-dialog.component.html',
  styleUrls: ['./gestione-esami-dialog.component.css'],
})
export class GestioneEsameDialogComponent implements OnInit {
  isEsameCaricatoSQL: boolean = false;
  isEsameCaricatoERM: boolean = false;
  prenotazioni: any[] = [];
  selectedFileSQL: File | null = null;
  selectedFileERM: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<GestioneEsameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataRetrievalService: DataRetrievalServiceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPrenotazioni(this.data.appello.id);
  }

  fetchPrenotazioni(appelloId: number): void {
    this.dataRetrievalService.getPrenotazioniByAppelloId(appelloId).subscribe({
      next: (response: any[]) => {
        this.prenotazioni = response;
        console.log('Prenotazioni:', this.prenotazioni);
      },
      error: (err: any) => {
        console.error('Errore nel recupero delle prenotazioni:', err);
      },
    });
  }

  onFileSelected(type: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'SQL') {
        this.selectedFileSQL = file;
      } else if (type === 'ERM') {
        this.selectedFileERM = file;
      }
    }
  }

  caricaEsameSQL(): void {
    console.log('Carica Esame SQL');
    if (this.selectedFileSQL) {
      this.isEsameCaricatoSQL = true;
    }
  }

  caricaEsameERM(): void {
    console.log('Carica Esame ERM');
    if (this.selectedFileERM) {
      this.isEsameCaricatoERM = true;
    }
  }

  iniziaEsame(): void {
    console.log('Inizia Esame');
    const formData = new FormData();
    const compitoId = this.data.appello.compito_id;
    const appelloId = this.data.appello.id;

    if (this.selectedFileSQL) {
      formData.append('fileSQL', this.selectedFileSQL);
    }

    if (this.selectedFileERM) {
      formData.append('fileERM', this.selectedFileERM);
    }

    formData.append('compitoId', compitoId.toString());
    formData.append('appelloId', appelloId.toString());

    this.dataRetrievalService.inviaEsame(formData).subscribe({
      next: (response) => {
        console.log('Esame inviato con successo:', response);

        this.snackBar.open('Esame inviato con successo!', 'Chiudi', {
          duration: 3000,
        });
        this.dialogRef.close();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Errore nell'invio dell'esame:", err);
      },
    });
  }

  chiudiDialog(): void {
    this.dialogRef.close();
  }

  fermaEsame(): void {
    console.log('Ferma Esame');
    const appelloId = this.data.appello.id;
    console.log(this.data.appello.id);
    this.dataRetrievalService.fermaEsame(appelloId).subscribe({
      next: () => {
        console.log('Esame fermato con successo');
        this.snackBar.open('Esame fermato con successo!', 'Chiudi', {
          duration: 3000,
        });
        this.dialogRef.close();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Errore nel fermare l'esame:", err);
      },
    });
  }
}
