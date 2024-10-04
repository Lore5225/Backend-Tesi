import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuovo-avviso',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatInputModule,
            MatFormFieldModule,
            MatSelectModule,
            MatButtonModule,
            MatDatepickerModule,
            MatNativeDateModule
          ],
  templateUrl: './nuovo-avviso.component.html',
  styleUrl: './nuovo-avviso.component.css'
})
export class NuovoAvvisoComponent {
  regForm!: FormGroup;
  courses: any[] = []; 
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private dataRetrievalService: DataRetrievalServiceService,
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.regForm = this.fb.group({
      testoAvviso: ['', Validators.required],
      corso: ['', Validators.required]
    });

    this.fetchCourses();
    this.checkSession();
  }

  fetchCourses(): void {
    this.dataRetrievalService.fetchCourses().subscribe({
      next: (response) => {
        if (response.message) {
          this.errorMessage = response.message;
        } else {
          this.courses = response;
        }
      },
      error: (err) => {
        console.error('Errore recupero corsi:', err);
        this.errorMessage = 'Errore nel recupero dei corsi.';
      }
    });
  }

  checkSession(): void {
    this.authService.checkSession().subscribe({
      next: (response) => {
        if (!response.logged_in) {
          this.router.navigate(['/login']);
        } else if (response.user_type === 'student') {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Errore verifica sessione:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    if (this.regForm.valid) {
      const formData = this.regForm.value;
      this.dataRetrievalService.nuovoAvviso(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Nuovo avviso inserito con successo!', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          this.snackBar.open('Errore durante il caricamento. Riprova.', 'Chiudi', { duration: 3000 });
          console.error('Errore registrazione:', err);
        }
      });
    }
  }
}
