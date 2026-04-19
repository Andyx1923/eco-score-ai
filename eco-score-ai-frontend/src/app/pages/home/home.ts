import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  formData = {
    transporte: '',
    plastico: '',
    energia: ''
  };

  resultado: any = null;
  loading = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef // 👈 CLAVE
  ) {}

  evaluar() {
    if (!this.formData.transporte || !this.formData.plastico || !this.formData.energia) {
      alert("Por favor, selecciona todas las opciones.");
      return;
    }

    if (this.loading) return;

    this.loading = true;
    this.resultado = null;

    this.api.evaluate(this.formData).subscribe({
      next: (res) => {
        console.log("RESPUESTA OK:", res);

        this.resultado = res;
        this.loading = false;

        this.cdr.detectChanges(); // 👈 FUERZA REFRESH
      },
      error: (err) => {
        console.error("Error en la conexión", err);

        this.loading = false;
        this.cdr.detectChanges();

        alert("Hubo un problema de conexión.");
      }
    });
  }
}