fetch('data.json')
  .then(response => response.json())
  .then((data) => drawCharts(data.reverse()));

function getDeltaMarkup(delta) {
  if (delta === 0) {
    return '';
  }
  var deltaSign = delta < 0 ? '-' : '+';
  return `<sup>${deltaSign}${delta}</sup>`;
}

function getAbsoluteColor(allValues, value) {
  var colors = ['#FDC101', '#FFC200', '#FFA102', '#F77C00', '#7A5448', '#5E4036'];
  var max = R.max(...allValues);
  var colorStep = max / colors.length;

  return colors[Math.round(value / colorStep) - 1];
}

function drawCharts(data) {
  var reversedData = R.reverse(data);
  var sickData = R.pluck('sick')(data);
  var healedData = R.pluck('healed')(data);
  var diedData = R.pluck('died')(data);
  var inProgressData = data.map(({ sick, died, healed }) => sick - died - healed);

  var labels = R.pluck('date')(data).map(date => moment(date, "DD.MM.YYYY").format("D MMMM"));

  var currentDate = moment(R.last(R.pluck('date')(data)), "DD.MM.YYYY");
  document.getElementById('current-date').innerText = `${currentDate.format("D MMMM")}`;

  var dailySick = reversedData.reduce(
    (acc, day, index) => {
      if (index < data.length - 1) {
        return [...acc, Number(day.sick) - Number(reversedData[index + 1].sick)];
      } else {
        return acc;
      }
    }, []);

  drawSickChart(sickData, labels);
  drawInProgressChart(inProgressData, labels);
  drawHealedChart(healedData, labels);
  drawDiedChart(diedData, labels);

  drawRtChart(dailySick, labels);

  drawAbsoluteChart(dailySick, labels);

  drawCommonChart(sickData, healedData, diedData, inProgressData, labels);
};

function drawSickChart(data, labels) {
  var ctx = document.getElementById('sick-chart').getContext('2d');
  var [count, ...tail] = [...data].reverse();
  var delta = count - R.head(tail);

  document.getElementById('sick-count').innerHTML = `${count} ${getDeltaMarkup(delta)}`;

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data,
        backgroundColor: '#0D74D5',
        categoryPercentage: 1,
        barPercentage: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 1,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      }
    }
  });
}

function drawInProgressChart(data, labels) {
  var ctx = document.getElementById('in-progress-chart').getContext('2d');
  var [count, ...tail] = [...data].reverse();

  document.getElementById('active-count').innerHTML = `${count}`;

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data,
        backgroundColor: '#FF9A01',
        categoryPercentage: 1,
        barPercentage: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 1,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      }
    }
  });
}

function drawHealedChart(data, labels) {
  var ctx = document.getElementById('healed-chart').getContext('2d');
  var [count, ...tail] = [...data].reverse();
  var delta = count - R.head(tail);

  document.getElementById('healed-count').innerHTML = `${count} ${getDeltaMarkup(delta)}`;

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data,
        backgroundColor: '#47B04B',
        categoryPercentage: 1,
        barPercentage: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 1,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      }
    }
  });
}

function drawDiedChart(data, labels) {
  var ctx = document.getElementById('died-chart').getContext('2d');
  var [count, ...tail] = [...data].reverse();
  var delta = count - R.head(tail);

  document.getElementById('died-count').innerHTML = `${count} ${getDeltaMarkup(delta)}`;
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data,
        backgroundColor: '#F7402D',
        categoryPercentage: 1,
        barPercentage: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 1,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      }
    }
  });
}

function drawRtChart(dailySick, labels) {
  var sickByFourDays = dailySick.reduce(
    (acc, dailySickItem, index) => {
      if (index < dailySick.length - 4) {
        return [...acc, dailySickItem + dailySick[index + 1] + dailySick[index + 2] + dailySick[index + 3]];
      } else {
        return acc;
      }
    }, []);

  var rts = sickByFourDays.reduce(
    (acc, item, index) => {
      if (index < sickByFourDays.length - 4) {
        return [...acc, item / sickByFourDays[index + 4]];
      } else {
        return acc;
      }
    }, []);

  document.getElementById('rt').innerText = R.head(rts).toFixed(2);
  var ctx = document.getElementById('rt-chart').getContext('2d');

  var rtChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: R.takeLast(labels.length - 9, labels),
      datasets: [{
        data: R.reverse(rts).map(rt => rt.toFixed(2)),
        backgroundColor: 'transparent',
        borderColor: '#9D27B0',
        pointBorderColor: '#9D27B0',
        pointBorderWidth: 2,
        pointBackgroundColor: '#fff',
        pointRadius: 4,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: 'auto',
          align: 'start',
          offset: -30,
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 6,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      }
    }
  });
}

function drawAbsoluteChart(dailySick, labels) {
  var ctx = document.getElementById('absolute-chart').getContext('2d');

  var absoluteChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: R.takeLast(labels.length - 1, labels),
      datasets: [{
        data: R.reverse(dailySick),
        backgroundColor: R.reverse(dailySick).map(daily => getAbsoluteColor(dailySick, daily)),
        categoryPercentage: 0.4,
        barPercentage: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        enabled: true,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 4,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      },
    }
  });
}

function drawCommonChart(sickData, healedData, diedData, activeData, labels) {
  var ctx = document.getElementById('common-chart').getContext('2d');

  var commonChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Всего',
        data: sickData,
        backgroundColor: '#3E52B5',
        borderColor: '#3E52B5',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 0,
        pointRadius: 0,
        fill: false,
        order: 1,
      }, {
        label: 'Выздоровело',
        data: healedData,
        type: 'line',
        borderColor: '#47B04B',
        pointBorderColor: '#47B04B',
        pointBorderWidth: 0,
        pointBackgroundColor: '#fff',
        pointRadius: 0,
        backgroundColor: '#47B04B',
        fill: false,
        order: 2,
      }, {
        label: 'Умерло',
        data: diedData,
        type: 'line',
        borderColor: '#FF5708',
        pointBorderColor: '#FF5708',
        pointBorderWidth: 0,
        pointBackgroundColor: '#fff',
        pointRadius: 0,
        backgroundColor: '#FF5708',
        fill: false,
        order: 3,
      }, {
        label: 'Активные',
        data: activeData,
        type: 'line',
        borderColor: '#FF9A01',
        pointBorderColor: '#FF9A01',
        pointBorderWidth: 0,
        pointBackgroundColor: '#fff',
        pointRadius: 0,
        fill: false,
        backgroundColor: '#FF9A01',
        order: 4,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        enabled: true,
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 4,
            maxRotation: 0,
          }
        }],
        yAxes: [{
          ticks: {
            precision: 0,
          }
        }]
      },
    }
  });
}