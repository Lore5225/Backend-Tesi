import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';

@Component({
  selector: 'app-avvisi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avvisi.component.html',
  styleUrls: ['./avvisi.component.css'],
})
export class AvvisiComponent implements OnInit {
  avvisi: any[] = [];
  corsoIscritto: any = null;

  constructor(private dataRetrievalService: DataRetrievalServiceService) {}

  ngOnInit(): void {
    this.fetchCorsoIscritto();
  }

  fetchCorsoIscritto(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    if (studenteId) {
      this.dataRetrievalService.checkIscrizione(studenteId).subscribe({
        next: (response) => {
          if (response.is_iscritto) {
            this.corsoIscritto = response.corso;
            this.fetchAvvisi();
          } else {
            console.error('Nessun corso trovato per questo studente.');
          }
        },
        error: (err) => {
          console.error('Errore nel recupero del corso iscritto:', err);
        },
      });
    }
  }

  fetchAvvisi(): void {
    if (this.corsoIscritto) {
      this.dataRetrievalService.fetchAvvisi().subscribe({
        next: (response) => {
          this.avvisi = response.filter((avviso: any) =>
            avviso.corso_id === this.corsoIscritto.id &&
            avviso.corso.canale === this.corsoIscritto.canale &&
            avviso.corso.anno === this.corsoIscritto.anno
          );
        },
        error: (err) => {
          console.error('Errore recupero avvisi:', err);
        },
      });
    }
  }
}