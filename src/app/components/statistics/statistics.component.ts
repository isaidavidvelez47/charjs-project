import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './../../services/statistics.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  // Calendariooo
  showCalendar = false;
  avaliableYears = [];
  avaliableMonths = [];
  year: string;
  month: string;
  months = [];

  // Todas las listas del JSON
  longTerm = [];
  shortTerm = [];
  nominalLongTerm = [];
  nominalGerencyLongTerm = [];
  nominalGerencyShortTerm = [];
  acumulatedGerencyLongTerm = [];

  // Listas para el formulario
  options = [];
  activeDateList = [];

  //
  graphicDates: any;

  // Grafico
  BarChart: Chart;
  LineChart: Chart;

  // Campos del formulario
  price: number;
  titleActiveOption = [];
  initialDate: string;
  finalDate: string;


  constructor(private _statistics: StatisticsService) { }

  ngOnInit() {
    this.loadLongTerm();
    this.loadShortTerm();
    this.loadNominalLongTerm();
    this.loadNominalGerencyLongTerm();
    this.loadNominalGerencyShortTerm();
    this.loadAcumulatedGerencyLongTerm();
    this.resetMonths();
  }

  resetMonths() {
    this.months = [
      { number: '01', name: 'ene', active: false },
      { number: '02', name: 'feb', active: false },
      { number: '03', name: 'mar', active: false },
      { number: '04', name: 'abr', active: false },
      { number: '05', name: 'may', active: false },
      { number: '06', name: 'jun', active: false },
      { number: '07', name: 'jul', active: false },
      { number: '08', name: 'ago', active: false },
      { number: '09', name: 'sep', active: false },
      { number: '10', name: 'oct', active: false },
      { number: '11', name: 'nov', active: false },
      { number: '12', name: 'dic', active: false },
    ];
  }

  loadLongTerm() {
    this._statistics.rentabilidadesRAFPEA().subscribe(res => {
      this.longTerm = res['longTerm'];
      this.options.push(
        { page: '24 meses Largo Plazo (LP)', list: this.longTerm }
      );
    });
  }

  loadShortTerm() {
    this._statistics.rentabilidadesRAFPEA().subscribe(res => {
      this.shortTerm = res['shortTerm'];
      this.options.push(
        { page: '3 meses Corto Plazo (CP)', list: this.shortTerm }
      );
    });
  }

  loadNominalLongTerm() {
    this._statistics.rentabilidadesRAFP().subscribe(res => {
      this.nominalLongTerm = res['nominalLongTerm'];
      this.options.push(
        { page: 'Nomina largo plazo', list: this.nominalLongTerm }
      );
    });
  }

  loadNominalGerencyLongTerm() {
    this._statistics.rentabilidadesRAFP().subscribe(res => {
      this.nominalGerencyLongTerm = res['nominalGerencyLongTerm'];
      this.options.push(
        { page: 'Nomina largo plazo en Gerencia', list: this.nominalGerencyLongTerm }
      );
    });
  }

  loadNominalGerencyShortTerm() {
    this._statistics.rentabilidadesRAFP().subscribe(res => {
      this.nominalGerencyShortTerm = res['nominalGerencyShortTerm'];
      this.options.push(
        { page: 'Nomina corto plazo en Gerencia', list: this.nominalGerencyShortTerm }
      );
    });
  }

  loadAcumulatedGerencyLongTerm() {
    this._statistics.rentabilidadesRAFP().subscribe(res => {
      this.acumulatedGerencyLongTerm = res['acumulatedGerencyLongTerm'];
      this.options.push(
        { page: 'Acumulado largo plazo en Gerencia', list: this.acumulatedGerencyLongTerm }
      );
    });
  }

  setActiveOption(e) {
    this.initialDate = '';
    this.finalDate = '';
    this.titleActiveOption = e.page;
    this.activeDateList = e.list;
    this.graphicDates = null;
    this.getAvaliableYears();
  }

  setFinalDate(e) {
    this.initialDate = e.initialDate;
    this.finalDate = e.finalDate;
    this.graphicDates = e;
  }

  setBarGraphic(price, data, title) {
    if (this.BarChart) {
      this.BarChart.destroy();
    }
    this.BarChart = new Chart('barChart', {
      type: 'horizontalBar',
      data: {
        labels: this.getLabelsForBarGraphic(data),
        datasets: [{
          label: 'Rentabilidad',
          data: this.getDataForGraphic(price, data),
          backgroundColor: [
            'rgba(255, 212, 0, 0.6)',
            'rgba(255, 138, 54, 0.6)',
            'rgba(123, 191, 78, 0.6)',
            'rgba(75, 126, 216, 0.6)',
          ],
          borderColor: [
            'rgba(224, 169, 0, 1)',
            'rgba(209, 110, 43, 1)',
            'rgba(99, 152, 62, 1)',
            'rgba(60, 100, 172, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        title: {
          text: title,
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }

  setLineGraphic(data) {
    if (this.LineChart) {
      this.LineChart.destroy();
    }
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.getLabelsForLineGraphic(data),
        datasets: this.getDataForLineGraphic(data),
      },
      options: {
        title: {
          text: 'Cesantías corto plazo',
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }

  calcular() {
    this.setBarGraphic(this.price, this.graphicDates, this.titleActiveOption);
    this.setLineGraphic(this.activeDateList);
  }

  randomNum(): number {
    return Math.trunc((Math.random() * 5));
  }

  getLabelsForBarGraphic(dates) {
    return dates.labels;
  }

  getDataForGraphic(price, dates) {
    const d = dates.percent;
    const array = [
      price + (price * (d.proteccion / 100)),
      price + (price * (d.porvenir / 100)),
      price + (price * (d.oldmutual / 100)),
      price + (price * (d.colfondos / 100))
    ];
    return array;
  }

  getLabelsForLineGraphic(data) {
    const vec = [];
    data.forEach(i => {
      vec.push(i.finalDate);
    });
    return vec;
  }

  getDataForLineGraphic(data) {
    const vec = [
      {
        label: 'Protección',
        data: this.getProteccionPercents(data),
        backgroundColor: 'rgba(255, 212, 0, 0.6)',
        borderColor: 'rgba(224, 169, 0, 1)',
        borderWidth: 2,
        fill: false,
        lineTension: 0.2,
      },
      {
        label: 'Porvenir',
        data: this.getPorvenirPercents(data),
        backgroundColor: 'rgba(255, 138, 54, 0.6)',
        borderColor: 'rgba(209, 110, 43, 1)',
        borderWidth: 2,
        fill: false,
        lineTension: 0.2,
      },
      {
        label: 'Oldmutual',
        data: this.getOldMutualPercents(data),
        backgroundColor: 'rgba(123, 191, 78, 0.6)',
        borderColor: 'rgba(99, 152, 62, 1)',
        borderWidth: 2,
        fill: false,
        lineTension: 0.2,
      },
      {
        label: 'Colfondos',
        data: this.getColfondosPercents(data),
        backgroundColor: 'rgba(75, 126, 216, 0.6)',
        borderColor: 'rgba(60, 100, 172, 1)',
        borderWidth: 2,
        fill: false,
        lineTension: 0.2,
      }
    ];
    return vec;
  }

  getProteccionPercents(data) {
    const vec = [];
    data.forEach(element => {
      vec.push(element.percent.proteccion);
    });
    return vec;
  }

  getPorvenirPercents(data) {
    const vec = [];
    data.forEach(element => {
      vec.push(element.percent.porvenir);
    });
    return vec;
  }

  getOldMutualPercents(data) {
    const vec = [];
    data.forEach(element => {
      vec.push(element.percent.oldmutual);
    });
    return vec;
  }

  getColfondosPercents(data) {
    const vec = [];
    data.forEach(element => {
      vec.push(element.percent.colfondos);
    });
    return vec;
  }

  getAvaliableYears() {
    this.avaliableYears = [];
    this.activeDateList.forEach(date => {
      const fullDate = date.finalDate.split('/');
      // Se compara si el año ya existe en el arreglo que se muestra en el calendario,
      // para evitar repeticiones
      if (!this.yearExistOnArray(fullDate[2])) {
        // Si el año no existe, se agrega a la lista disponible
        this.avaliableYears.push({ year: fullDate[2] });
        this.year = fullDate[2];
        this.getMonthsByYear(this.year);
      }
    });
  }

  yearExistOnArray(year) {
    let exist = false;
    this.avaliableYears.forEach(date => {
      if (date.year === year) {
        exist = true;
      }
    });
    return exist;
  }

  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  changeYear(clickNext) {
    let done = false;
    if (clickNext) {
      for (let i = 0; i < this.avaliableYears.length; i++) {
        if (this.year === this.avaliableYears[i].year && i !== (this.avaliableYears.length - 1) && !done) {
          this.year = this.avaliableYears[i + 1].year;
          done = true;
        }
      }
    } else {
      for (let i = 0; i < this.avaliableYears.length; i++) {
        if (this.year === this.avaliableYears[i].year && i !== 0 && !done) {
          this.year = this.avaliableYears[i - 1].year;
          done = true;
        }
      }
    }
    this.getMonthsByYear(this.year);
  }

  getMonthsByYear(year) {
    this.resetMonths();
    this.activeDateList.forEach(date => {
      const fullDate = date.finalDate.split('/');
      if (fullDate[2] === year) {
        this.months.forEach(month => {
          if (month.number === fullDate[1]) {
            month.active = true;
          }
        });
      }
    });
  }

  selectMonth(month) {
    this.activeDateList.forEach(date => {
      if (date.finalDate.substring(3) === month.number + '/' + this.year) {
        this.setFinalDate(date);
        this.showCalendar = false;
      }
    });
  }
}
