// home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userType!: string;
  userID!: number;
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.checkSession().subscribe({
      next: (response) => {
        if (!response.logged_in) {
          this.router.navigate(['/login']);
        } else {
          this.userType = response.user_type;
          this.userID = response.user_id;
          localStorage.setItem('userID', this.userID.toString());
        }
      },
      error: (err) => {
        console.error('Errore verifica sessione:', err);
        this.router.navigate(['/login']);
      },
    });
  }
  onLogout() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.snackBar.open('Logout effettuato con successo!', 'Chiudi', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open('Errore durante il logout. Riprova.', 'Chiudi', {
          duration: 3000,
        });
        console.error('Errore logout:', err);
      },
    });
  }

  navigateToNuovoAvviso(): void {
    this.router.navigate(['/home/nuovoavviso']);
  }

  navigateToNuovoAppello(): void {
    this.router.navigate(['/home/nuovoappello']);
  }

  navigateToNuovoCorso(): void {
    this.router.navigate(['/home/nuovocorso']);
  }

  navigateToNuovoMateriale(): void {
    this.router.navigate(['/home/nuovomateriale']);
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  navigateToCorsi(): void {
    this.router.navigate(['/home/corsi']);
  }

  navigateToLezioni(): void {
    this.router.navigate(['/home/lezioni']);
  }

  navigateToRisultati(): void {
    this.router.navigate(['/home/risultati']);
  }

  navigateToAvvisi(): void {
    this.router.navigate(['/home/avvisi']);
  }
  navigateToAllenati(): void {
    this.router.navigate(['/home/allenati']);
  }
  navigateToEsami(): void {
    this.router.navigate(['/home/esami']);
  }
  navigateToPrenotazione(): void {
    this.router.navigate(['home/prenotazione']);
  }
}
