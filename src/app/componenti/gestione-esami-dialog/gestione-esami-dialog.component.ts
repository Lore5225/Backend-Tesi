import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
    private dataRetrievalService: DataRetrievalServiceService
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

    if (this.selectedFileSQL) {
      formData.append('fileSQL', this.selectedFileSQL);
    }
    if (this.selectedFileERM) {
      formData.append('fileERM', this.selectedFileERM);
    }

    if (this.selectedFileSQL) {
      this.isEsameCaricatoSQL = true;
      this.dataRetrievalService.caricaEsameSQL(this.selectedFileSQL);
      console.log('File SQL caricato:', this.selectedFileSQL.name);
    }

    if (this.selectedFileERM) {
      this.isEsameCaricatoERM = true;
      this.dataRetrievalService.caricaEsameERM(this.selectedFileERM);
      console.log('File ERM caricato:', this.selectedFileERM.name);
    }
  }

  chiudiDialog(): void {
    this.dialogRef.close();
  }
}
