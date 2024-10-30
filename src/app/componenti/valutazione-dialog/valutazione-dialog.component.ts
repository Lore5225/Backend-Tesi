import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  matDialogAnimations,
} from '@angular/material/dialog';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-valutazione-dialog',
  templateUrl: './valutazione-dialog.component.html',
  standalone: true,
  styleUrls: ['./valutazione-dialog.component.css'],
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class ValutazioneDialogComponent implements OnInit {
  studenti: any[] = [];
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ValutazioneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataRetrievalService: DataRetrievalServiceService
  ) {}
  ngOnInit(): void {
    this.fetchStudenti(this.data.id);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  fetchStudenti(appelloId: number): void {
    console.log(appelloId);
    this.dataRetrievalService.fetchStudentiPrenotati(appelloId).subscribe({
      next: (response: any[]) => {
        this.studenti = response;
        if (this.studenti.length === 0) {
          this.errorMessage = 'Nessun file trovato.';
        }
      },
      error: (err: any) => {
        console.error('Errore recupero studenti:', err);
        this.errorMessage = 'Errore nel recupero dei dati degli studenti.';
      },
    });
  }

  downloadFile(filePath: string): void {
    window.open(filePath, '_blank');
  }
}
