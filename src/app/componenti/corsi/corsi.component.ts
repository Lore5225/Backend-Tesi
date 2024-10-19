import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-corsi',
  templateUrl: './corsi.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./corsi.component.css'],
})
export class CorsiComponent implements OnInit {
  corsi: any[] = [];
  anniUnici: number[] = [];
  corsoSelezionato = { anno: '', canale: '' };
  studenteId!: number;
  isIscritto = false;
  corsoIscritto: any;

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCorsi();
    this.studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.controllaIscrizione(this.studenteId);
  }

  getCorsi() {
    this.dataRetrievalService.fetchCourses().subscribe({
      next: (response) => {
        this.corsi = response;
        this.extractUniqueYears();
      },
      error: (error: any) => {
        console.error('Errore nel recupero dei corsi:', error);
      },
    });
  }

  extractUniqueYears() {
    const uniqueYears = new Set(this.corsi.map((corso) => corso.anno));
    this.anniUnici = Array.from(uniqueYears);
  }
  controllaIscrizione(studenteId: number) {
    this.dataRetrievalService.checkIscrizione(studenteId).subscribe({
      next: (response) => {
        if (response.is_iscritto) {
          this.isIscritto = true;
          this.corsoIscritto = response.corso;
        }
      },
      error: (error) => {
        console.error('Errore durante il controllo', error);
      },
    });
  }

  iscriviti() {
    const corsoId = this.corsi.find(
      (corso) =>
        corso.anno === this.corsoSelezionato.anno &&
        corso.canale === this.corsoSelezionato.canale
    )?.id;

    if (corsoId) {
      this.dataRetrievalService
        .iscrizioneCorso(this.studenteId, corsoId)
        .subscribe({
          next: () => {
            this.isIscritto = true;
            this.corsoIscritto = this.corsi.find(corso => corso.id === corsoId);
            this.snackBar.open('Iscritto con successo!', 'Chiudi', {
              duration: 3000,
            });
          },
          error: (error: any) => {
            console.error("Errore durante l'iscrizione:", error);
            this.snackBar.open(
              "Errore durante l'iscrizione. Riprova.",
              'Chiudi',
              {
                duration: 3000,
              }
            );
          },
        });
    }
  }

  cancellaIscrizione() {
    const corsoId = this.corsoIscritto.id;

    if (corsoId) {
      this.dataRetrievalService
        .cancellaIscrizione(this.studenteId, corsoId)
        .subscribe({
          next: () => {
            this.isIscritto = false;
            this.snackBar.open(
              'Iscrizione cancellata con successo!',
              'Chiudi',
              {
                duration: 3000,
              }
            );
          },
          error: (error: any) => {
            console.error(
              "Errore durante la cancellazione dell'iscrizione:",
              error
            );
            this.snackBar.open(
              "Errore durante la cancellazione dell'iscrizione. Riprova.",
              'Chiudi',
              {
                duration: 3000,
              }
            );
          },
        });
    }
  }
}
