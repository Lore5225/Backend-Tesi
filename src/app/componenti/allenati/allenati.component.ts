import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-allenati',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './allenati.component.html',
  styleUrl: './allenati.component.css',
})
export class AllenatiComponent {}
