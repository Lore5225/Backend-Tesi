import { Component, OnInit } from '@angular/core';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lezioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lezioni.component.html',
  styleUrls: ['./lezioni.component.css'],
})
export class LezioniComponent implements OnInit {
  lezioni: any[] = [];

  constructor(
    private dataRetrievalService: DataRetrievalServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchLezioni();
  }

  fetchLezioni(): void {
    this.dataRetrievalService.fetchLessons().subscribe({
      next: (response) => {
        this.lezioni = response.map((lezione: any) => {
          return {
            ...lezione,
            link: JSON.parse(lezione.link),
          };
        });
      },
      error: (err) => {
        console.error('Errore recupero lezioni:', err);
      },
    });
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
