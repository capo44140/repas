<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const mealData = [150, 320, 180, 250, 180, 190, 280, 120, 180, 320, 220, 150];

const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'Repas',
      data: mealData,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#6B7280'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280'
      }
    }
  }
};
</script> 