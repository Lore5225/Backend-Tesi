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
  pdfUrl: string | null = null; 
  loading: boolean = false; 
  selectedFile: any;
  filename: string = '';

  constructor(private generatoriEsamiService: GeneratoreEsamiService) {}

  generateExam(examType: 'sql' | 'erm') {
    this.loading = true; 

    this.generatoriEsamiService.generateExam(examType).subscribe({
      next: (response: Blob) => { 
        const blob: Blob = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl = URL.createObjectURL(blob);
        this.filename = `Esame_${examType}_${new Date().toISOString().slice(0, 10)}.pdf`; 
        
       
        const audio = new Audio('assets/suono.mp3'); 
        audio.play().catch((error) => console.error('Error playing audio', error));

        this.loading = false; 
      },
      error: (error) => {
        console.error('Error generating exam', error);
        this.loading = false; 
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

    
    this.generatoriEsamiService
      .generateSolutionSQL(this.selectedFile)
      .subscribe({
        next: (response: Blob) => {
          const blob: Blob = new Blob([response], { type: 'application/pdf' });
          this.pdfUrl = URL.createObjectURL(blob);
          this.filename = `SoluzioneGenerata_${new Date().toISOString().slice(0, 10)}.pdf`; 

          // Inizializza il suono ogni volta che viene chiamato
          const audio = new Audio('assets/suono.mp3'); 
          audio.play().catch((error) => console.error('Error playing audio', error));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error generating SQL solution', error);
          this.loading = false;
        },
      });
  }

  downloadPdfFile() {
    if (this.pdfUrl) {
      const link = document.createElement('a');      
      link.href = this.pdfUrl;
      link.download = this.filename;
  
      link.click();
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null; 
    } else {
      console.warn('Nessun file PDF generato da scaricare.');
    }
  }
}
