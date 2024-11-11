import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-valutazione-dialog',
  templateUrl: './valutazione-dialog.component.html',
  standalone: true,
  styleUrls: ['./valutazione-dialog.component.css'],
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule],
})
export class ValutazioneDialogComponent implements OnInit {
  studenti: any[] = [];
  errorMessage: string = '';
  appelloID!: number;
  voti: { [studenteId: number]: { sql: number[]; erm: number[] } } = {};
  note: { [studenteId: number]: string } = {};

  constructor(
    public dialogRef: MatDialogRef<ValutazioneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataRetrievalService: DataRetrievalServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.appelloID = this.data.id;
    this.fetchStudenti(this.appelloID);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  fetchStudenti(appelloId: number): void {
    this.dataRetrievalService.fetchStudentiPrenotati(appelloId).subscribe({
      next: (response: any[]) => {
        this.studenti = response;
        if (this.studenti.length === 0) {
          this.errorMessage = 'Nessun file trovato.';
        }

        this.studenti.forEach((studente) => {
          this.voti[studente.studente.id] = { sql: [], erm: [] };
          this.note[studente.studente.id] = '';
        });
      },
      error: (err: any) => {
        console.error('Errore recupero studenti:', err);
        this.errorMessage = 'Errore nel recupero dei dati degli studenti.';
      },
    });
  }

  addVotoSql(studenteId: number): void {
    this.voti[studenteId].sql.push(0);
  }

  removeVotoSql(studenteId: number, index: number): void {
    this.voti[studenteId].sql.splice(index, 1);
  }

  addVotoErm(studenteId: number): void {
    this.voti[studenteId].erm.push(0);
  }

  removeVotoErm(studenteId: number, index: number): void {
    this.voti[studenteId].erm.splice(index, 1);
  }

  calculateTotaleVoti(voti: number[]): number {
    return voti.reduce((total, voto) => total + (voto || 0), 0);
  }

  downloadFile(
    fileType: 'sql' | 'erm',
    studenteId: number,
    prenotazioneId: number
  ): void {
    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('prenotazioneId', prenotazioneId.toString());
    formData.append('studenteId', studenteId.toString());

    this.dataRetrievalService.getFilesByStudente(formData).subscribe({
      next: (response: any) => {
        const byteCharacters = atob(response.fileContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: fileType === 'sql' ? 'text/plain' : 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Errore nel download del file:', err);
        this.errorMessage = 'Errore nel download del file.';
      },
    });
  }

  uploadEsiti(): void {
    this.studenti.forEach((studente) => {
      const studenteId = studente.studente.id;
      const appelloId = this.appelloID;
      const esitoSql = this.calculateTotaleVoti(this.voti[studenteId].sql);
      const esitoErm = this.calculateTotaleVoti(this.voti[studenteId].erm);
      const nota = this.note[studenteId];

      if (
        this.voti[studenteId].sql.length === 0 ||
        this.voti[studenteId].erm.length === 0
      ) {
        this.errorMessage =
          'Devi inserire almeno un voto (SQL e ERM) per ogni studente.';
        return;
      }

      this.dataRetrievalService
        .uploadEsito(studenteId, appelloId, esitoSql, esitoErm, nota)
        .subscribe({
          next: (response) => {
            console.log(
              `Esito caricato per studente ${studente.studente.nome}:`,
              response
            );
            this.errorMessage = 'Esiti caricati con successo!';

            this.snackBar.open('Esito inviato con successo.', 'Chiudi', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
          },
          error: (err) => {
            console.error(
              `Errore nel caricamento dell'esito per ${studente.studente.nome}:`,
              err
            );
            this.errorMessage = 'Errore nel caricamento degli esiti.';

            this.snackBar.open(
              'Errore nel caricamento degli esiti.',
              'Chiudi',
              {
                duration: 3000,
                panelClass: ['error-snackbar'],
              }
            );
          },
        });
    });
  }
}
