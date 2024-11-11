import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { DataRetrievalServiceService } from '../Services/data-retrieval-service.service';

@Component({
  selector: 'app-riepilogo-esiti-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './riepilogo-esiti-dialog.component.html',
  styleUrls: ['./riepilogo-esiti-dialog.component.css'],
})
export class RiepilogoEsitiDialogComponent {
  appello: any;
  esiti: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RiepilogoEsitiDialogComponent>,
    private dataRetrievalService: DataRetrievalServiceService
  ) {
    this.appello = data;
    this.fetchEsiti();
  }

  fetchEsiti(): void {
    this.dataRetrievalService
      .getPrenotazioniByAppelloId(this.appello.id)
      .subscribe({
        next: (esiti: any) => {
          this.esiti = esiti;
        },
        error: (err: any) => {
          console.error('Errore nel recupero degli esiti:', err);
        },
      });
  }

  onClose(): void {
    this.dialogRef.close(); // Chiude la dialog
  }
}
