import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRetrievalServiceService } from '../../Services/data-retrieval-service.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
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
  selector: 'app-nuovo-materiale',
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
  templateUrl: './nuovo-materiale.component.html',
  styleUrls: ['./nuovo-materiale.component.css'],
})
export class NuovoMaterialeComponent {
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
      numeroLezione: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      data: ['', Validators.required],
      linkMateriale: this.fb.array([], Validators.required),
      argomento: ['', Validators.required],
      corso: ['', Validators.required],
    });

    this.fetchCourses();
    this.checkSession();
  }

  get linkMateriale(): FormArray {
    return this.regForm.get('linkMateriale') as FormArray;
  }

  addLink(): void {
    this.linkMateriale.push(
      this.fb.control('', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ])
    );
  }

  removeLink(index: number): void {
    this.linkMateriale.removeAt(index);
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

  onSubmit() {
    if (this.regForm.valid) {
      const selectedCourse = this.courses.find(
        (course) => course.id === this.regForm.value.corso
      );
      if (!selectedCourse || !selectedCourse.canale) {
        this.snackBar.open(
          'Seleziona un corso valido con un canale.',
          'Chiudi',
          { duration: 3000 }
        );
        return;
      }
      console.log(selectedCourse.canale);
      const formData = {
        ordine: this.regForm.value.numeroLezione,
        data: this.regForm.value.data,
        link: this.regForm.value.linkMateriale,
        argomento: this.regForm.value.argomento,
        canale: selectedCourse.canale,
        corso_id: this.regForm.value.corso,
      };

      this.dataRetrievalService.nuovaLezione(formData).subscribe({
        next: (response) => {
          this.snackBar.open(
            'Nuovo materiale inserito con successo!',
            'Chiudi',
            { duration: 3000 }
          );
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.snackBar.open(
            'Errore durante il caricamento. Riprova.',
            'Chiudi',
            { duration: 3000 }
          );
          console.error('Errore registrazione:', err);
        },
      });
    }
  }
}
