import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, 
            MatFormFieldModule, 
            MatInputModule, 
            MatButtonModule, 
            MatSelectModule, 
            ReactiveFormsModule, 
            RouterLink, 
            MatCheckboxModule, 
            HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  accForm!: FormGroup;
  isChecked = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  toggleSingleSelectionIndicator() {
    this.isChecked = !this.isChecked;
    this.accForm.patchValue({ is_professor: this.isChecked });
  }

  ngOnInit(): void {
    this.accForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      is_professor: new FormControl(this.isChecked)
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
    if (this.accForm.valid) {
      const formData = this.accForm.value;
      this.authService.login(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Login effettuato con successo!', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          const errorMessage = err.error.message || 'Errore durante il login. Riprova.';
          this.snackBar.open(errorMessage, 'Chiudi', { duration: 3000 });
        }
      });
    }
  }
}
