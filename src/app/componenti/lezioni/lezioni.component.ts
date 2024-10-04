import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lezioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lezioni.component.html',
  styleUrl: './lezioni.component.css'
})
export class LezioniComponent implements OnInit{
  lezioni: any[] = []; 

  constructor(
    private dataRetrievalService: DataRetrievalServiceService
  ) {}


  ngOnInit(): void {
      this.fetchLezioni();
  }

  fetchLezioni(): void {
    this.dataRetrievalService.fetchLessons().subscribe({
      next: (response) => {
        this.lezioni = response;
      },
      error: (err) => {
        console.error('Errore recupero lezioni:', err);
      }
    });
  }

}
