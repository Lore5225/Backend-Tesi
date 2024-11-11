import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuovo-appello',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './nuovo-appello.component.html',
  styleUrls: ['./nuovo-appello.component.css'],
})
export class NuovoAppelloComponent {
  regForm!: FormGroup;
  courses: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private dataRetrievalService: DataRetrievalServiceService,
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.regForm = this.fb.group({
      data: ['', Validators.required],
      orario: ['', Validators.required],
      corso: ['', Validators.required],
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
      },
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
      },
    });
  }

  onSubmit(): void {
    if (this.regForm.invalid) return;

    const data = this.regForm.get('data')?.value;
    const orario = this.regForm.get('orario')?.value;

    const datetime = new Date(data);
    const [hours, minutes] = orario.split(':');
    datetime.setHours(parseInt(hours, 10));
    datetime.setMinutes(parseInt(minutes, 10));

    const newAppello = {
      data: datetime.toISOString(),
      corso_id: this.regForm.get('corso')?.value,
    };

    this.dataRetrievalService.addAppello(newAppello).subscribe({
      next: (response: { success: any; message: string }) => {
        if (response.success) {
          this.successMessage = 'Appello aggiunto con successo!';
          this.regForm.reset();
          this.openSnackBar('Appello aggiunto correttamente!', 'Chiudi');
          this.router.navigate(['/home']);
        } else {
          this.errorMessage =
            response.message || "Errore durante l'aggiunta dell'appello.";
        }
      },
      error: (err: any) => {
        console.error('Errore aggiunta appello:', err);
        this.errorMessage = "Errore nel salvataggio dell'appello.";
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
