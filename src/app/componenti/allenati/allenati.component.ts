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
  selectedFile: any;

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
        console.error('Error generating exam', error);
        this.loading = false; // Ferma il caricamento anche in caso di errore
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  generateSolutionSQL() {
    if (!this.selectedFile) {
      console.warn('Nessun file selezionato');
      return;
    }

    this.loading = true;

    // Invia il file selezionato al backend per generare la soluzione SQL
    this.generatoriEsamiService
      .generateSolutionSQL(this.selectedFile)
      .subscribe({
        next: (blob: Blob) => {
          // Crea un URL per il blob della soluzione SQL e assegnalo a pdfUrl
          this.pdfUrl = URL.createObjectURL(blob);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error generating SQL solution', error);
          this.loading = false;
        },
      });
  }

  downloadPdfFile(filename: string) {
    if (this.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = filename;

      link.click();
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null; // Resetta l'URL
    } else {
      console.warn('Nessun file PDF generato da scaricare.');
    }
  }
}
