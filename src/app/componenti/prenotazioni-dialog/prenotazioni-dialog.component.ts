import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selectedFiles: { [key: string]: File | null } = {
    SQL: null,
    ERM: null,
  };
  uploadedFiles: { [key: string]: boolean } = {
    SQL: false,
    ERM: false,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { appello: any; prenotazione_id: number },
    private dataRetrievalService: DataRetrievalServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  onFileSelected(type: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[type] = input.files[0];
    }
  }

  uploadFile(): void {
    const formData = new FormData();
    const prenotazioneId = this.data.prenotazione_id;
    console.log(prenotazioneId);

    if (this.selectedFiles['SQL']) {
      formData.append('file_sql', this.selectedFiles['SQL']);
    }

    if (this.selectedFiles['ERM']) {
      formData.append('file_erm', this.selectedFiles['ERM']);
    }

    formData.append('prenotazione_id', prenotazioneId.toString());

    this.dataRetrievalService.caricaEsame(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Esame caricato con successo!', 'Chiudi', {
          duration: 3000,
        });
        if (this.selectedFiles['SQL']) {
          this.uploadedFiles['SQL'] = true;
        }
        if (this.selectedFiles['ERM']) {
          this.uploadedFiles['ERM'] = true;
        }
        this.selectedFiles = { SQL: null, ERM: null };
      },
      error: (err) => {
        console.error('Errore nel caricamento del file:', err);
        this.snackBar.open('Errore nel caricamento del file.', 'Chiudi', {
          duration: 3000,
        });
      },
    });
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
}
