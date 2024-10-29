import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';

@Component({
  selector: 'app-prenotazioni-dialog',
  templateUrl: './prenotazioni-dialog.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./prenotazioni-dialog.component.css'],
})
export class PrenotazioneDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appello: any },
    private dataRetrievalService: DataRetrievalServiceService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  downloadFile(type: string): void {
    console.log(`Download del file di tipo: ${type}`);
    this.dataRetrievalService
      .downloadFile(this.data.appello.id, type)
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.data.appello.id}_${type}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Errore nel download del file:', err);
        },
      });
  }

  uploadFile(): void {
    console.log('Caricamento del file ZIP');
  }
}
