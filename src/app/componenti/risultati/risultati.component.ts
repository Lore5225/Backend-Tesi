import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risultati',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risultati.component.html',
  styleUrls: ['./risultati.component.css'],
})
export class RisultatiComponent implements OnInit {
  risultati: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private dataRetrievalService: DataRetrievalServiceService) {}

  ngOnInit(): void {
    this.loadRisultati();
  }

  loadRisultati(): void {
    const studenteId = parseInt(localStorage.getItem('userID') || '0', 10);
    this.dataRetrievalService.getPrenotazioniTerminate(studenteId).subscribe({
      next: (data: any[]) => {
        this.risultati = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Errore nel caricamento dei risultati:', err);
        this.errorMessage = 'Errore nel caricamento dei risultati.';
        this.loading = false;
      },
    });
  }
}
