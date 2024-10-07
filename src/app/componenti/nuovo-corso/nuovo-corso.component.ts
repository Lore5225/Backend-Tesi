import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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


@Component({
  selector: 'app-nuovo-corso',
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
  templateUrl: './nuovo-corso.component.html',
  styleUrl: './nuovo-corso.component.css'
})
export class NuovoCorsoComponent {
  regForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.regForm = this.fb.group({
      canale: ['', Validators.required],
      anno: ['', Validators.required]
    });

    this.checkSession();
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
  }
}
