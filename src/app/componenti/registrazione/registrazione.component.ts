import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [CommonModule, 
            MatFormFieldModule, 
            MatInputModule, 
            MatButtonModule,
            MatSelectModule, 
            ReactiveFormsModule, 
            RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {
  regForm!: FormGroup;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.regForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]), 
      cognome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]), 
      matricola: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]), 
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    this.authService.checkSession().subscribe({
      next: (response) => {
        if (response.logged_in) {
          this.router.navigate(['/home']); 
        }
      },
      error: (err) => {
        console.error('Errore verifica sessione:', err);
      }
    });
  }

  onSubmit() {
    if (this.regForm.valid) {
      const formData = this.regForm.value;
      this.authService.signup(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Registrazione effettuata con successo!', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          this.snackBar.open('Errore durante la registrazione. Riprova.', 'Chiudi', { duration: 3000 });
          console.error('Errore registrazione:', err);
        }
      });
    }
  }
}
