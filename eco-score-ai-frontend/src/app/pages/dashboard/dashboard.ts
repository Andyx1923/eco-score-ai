import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  stats: any = null;
  loading = true;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.api.getStats().subscribe({
      next: (res) => {
        console.log("STATS:", res);

        this.stats = res;
        this.loading = false;

        this.cdr.detectChanges();

        // 👇 CLAVE: esperar a que Angular pinte el DOM
        setTimeout(() => {
          this.renderCharts();
        }, 0);
      },
      error: (err) => {
        console.error("Error stats:", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  renderCharts() {
    const canvas1 = document.getElementById('transporteChart') as HTMLCanvasElement;
    const canvas2 = document.getElementById('plasticoChart') as HTMLCanvasElement;

    if (!canvas1 || !canvas2) {
      console.error("Canvas no encontrado");
      return;
    }

    // 🚗 TRANSPORTE
    new Chart(canvas1, {
      type: 'bar',
      data: {
        labels: ['Auto', 'Bus', 'Bicicleta'],
        datasets: [{
          label: 'Uso',
          data: [
  this.stats.transporte.auto,
  this.stats.transporte.bus,
  this.stats.transporte.bicicleta
]
        }]
      }
    });

    // 🧴 PLÁSTICO
    new Chart(canvas2, {
      type: 'pie',
      data: {
        labels: ['Alto', 'Medio', 'Bajo'],
        datasets: [{
          data: [
  this.stats.plastico.alto,
  this.stats.plastico.medio,
  this.stats.plastico.bajo
]
        }]
      }
    });
  }
}