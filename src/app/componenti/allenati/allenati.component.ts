import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeneratoreEsamiService } from '../../Services/generatore-esami.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allenati',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './allenati.component.html',
  styleUrls: ['./allenati.component.css'],
})
export class AllenatiComponent {
  pdfUrl: string | null = null; // URL for the PDF blob
  loading: boolean = false; // Indica se è in corso la generazione dell'esame

  constructor(private generatoriEsamiService: GeneratoreEsamiService) {}

  generateExam(examType: 'sql' | 'erm') {
    this.loading = true; // Inizia il caricamento

    this.generatoriEsamiService.generateExam(examType).subscribe({
      next: (blob: Blob) => {
        // Crea un URL per il blob e assegnalo a pdfUrl
        this.pdfUrl = URL.createObjectURL(blob);
        this.loading = false; // Ferma il caricamento
      },
      error: (error) => {
        console.error("Error generating exam", error);
        this.loading = false; // Ferma il caricamento anche in caso di errore
      }
    });
  }

  downloadPdfFile() {
    if (this.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = 'esame_generato.pdf'; // Puoi personalizzare il nome del file
      link.click();
      URL.revokeObjectURL(this.pdfUrl); // Rimuovi l'URL blob dopo il download
      this.pdfUrl = null; // Resetta l'URL
    } else {
      console.warn('Nessun file PDF generato da scaricare.');
    }
  }
}
