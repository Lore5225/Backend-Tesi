import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';

@Component({
  selector: 'app-avvisi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avvisi.component.html',
  styleUrl: './avvisi.component.css'
})
export class AvvisiComponent implements OnInit{
  avvisi:any[]=[];

  constructor(private dataRetrievalService: DataRetrievalServiceService){}

  ngOnInit():void{
    this.fetchAvvisi();
  }

  fetchAvvisi(): void {
    this.dataRetrievalService.fetchAvvisi().subscribe({
      next: (response) => {
        this.avvisi = response;
      },
      error: (err) => {
        console.error('Errore recupero lezioni:', err);
      }
    });
  }

}
