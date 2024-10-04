import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeneratoreEsamiService } from '../../Services/generatore-esami.service';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf'; // Importa jsPDF per generare PDF
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // Da usare per la gestione degli errori

@Component({
  selector: 'app-allenati',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './allenati.component.html',
  styleUrls: ['./allenati.component.css'],
})
export class AllenatiComponent {
  generatedExam: string = '';
  topic: string = 'databases';

  constructor(private generatoriEsamiService: GeneratoreEsamiService) {}

  // Metodo per gestire il click su "Genera Nuovo Esame"
  generateExam() {
    this.generatoriEsamiService
      .generateExam(this.topic)
      .pipe(
        tap((response: { output: string }) => {
          this.generatedExam = response.output; // Assegna l'output generato
        }),
        catchError((error: any) => {
          console.error("Errore durante la generazione dell'esame", error);
          return of(null); // Puoi restituire un valore di fallback
        })
      )
      .subscribe(); // Puoi ancora chiamare subscribe, ma la logica è gestita nel pipe
  }

  // Metodo per scaricare il testo generato come file .pdf
  downloadPdfFile() {
    const doc = new jsPDF(); // Crea un nuovo documento PDF
    doc.text(this.generatedExam, 10, 10); // Aggiungi il testo al PDF (posizionato a 10, 10)
    doc.save('esame-generato.pdf'); // Salva il PDF con il nome "esame-generato.pdf"
  }
}
