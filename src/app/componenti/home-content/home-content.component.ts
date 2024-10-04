import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service'; 
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent implements OnInit{
  todayDate!: string; 
  userType!: string;
  userId!: number;
  userName!: string;
  lezioni: any[] = []; 
  ultimeLezioni: any[] = [];
  avvisi: any[] = [];
  ultimiAvvisi: any[] = [];

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private dataRetrievalService: DataRetrievalServiceService
  ) {}


  ngOnInit(): void {
      const today = new Date();
      this.todayDate = today.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      this.authService.checkSession().subscribe({
        next: (response) => {
          if (!response.logged_in) {
            this.router.navigate(['/login']);
          } else {
            this.userType = response.user_type;
            this.userId = response.user_id;
            this.userName = response.name;
          }
        },
        error: (err) => {
          console.error('Errore verifica sessione:', err);
          this.router.navigate(['/login']);
        }
      });

      this.fetchLezioni();
      this.fetchAvvisi();
  }

  fetchLezioni(): void {
    this.dataRetrievalService.fetchLessons().subscribe({
      next: (response) => {
        this.lezioni = response;
        this.ultimeLezioni = this.lezioni.slice(-3);
      },
      error: (err) => {
        console.error('Errore recupero lezioni:', err);
      }
    });
  }

  fetchAvvisi(): void {
    this.dataRetrievalService.fetchAvvisi().subscribe({
      next: (response) => {
        this.avvisi = response;
        this.ultimiAvvisi = this.lezioni.slice(-3);
      },
      error: (err) => {
        console.error('Errore recupero lezioni:', err);
      }
    });
  }

  navigateToNuovoAvviso(): void {
    this.router.navigate(['/home/nuovoavviso']);
  }

  navigateToNuovoMateriale(): void {
    this.router.navigate(['/home/nuovomateriale']);
  }

  navigateToLezioni(): void {
    this.router.navigate(['/home/lezioni']);
  }

  navigateToAvvisi(): void{
    this.router.navigate(['/home/avvisi']);
  }
}
