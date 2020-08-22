fetch('data.json')
  .then(response => response.json())
  .then((data) => drawCharts(data.reverse()));

function getDeltaMarkup(delta) {
  if (delta === 0) {
    return '<sup></sup>';
  }
  var deltaSign = delta < 0 ? '-' : '+';
  return `<sup>${deltaSign}${delta}</sup>`;
}

function getAbsoluteColor(allValues, value) {
  var colors = ['#FDC101', '#FFC200', '#FFA102', '#F77C00', '#7A5448', '#5E4036'];
  var max = Math.max(...allValues);
  var colorStep = max / colors.length;

  const index = Math.trunc(value / colorStep);

  return index === colors.length ? colors[index - 1] : colors[index];
}

function drawCharts(data) {
  const reversedData = [...data].reverse();
  var sickData = data.map(({ sick }) => sick);
  var healedData = data.map(({ healed }) => healed);
  var diedData = data.map(({ died }) => died);
  var inProgressData = data.map(({ sick, died, healed }) => sick - died - healed);

  var labels = data.map(({ date }) => date).map(date => dayjs(date, "DD.MM.YYYY").format("D MMMM"));

  var currentDate = dayjs([...data].map(({ date }) => date).reverse()[0], "DD.MM.YYYY");
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
  var delta = count - tail[0];

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

  document.getElementById('active-count').innerHTML = `${count} <sup>&nbsp;</sup>`;

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
  var delta = count - tail[0];

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
  var delta = count - tail[0];

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
      if (index < dailySick.length - 3) {
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

  document.getElementById('rt').innerText = (rts[0]).toFixed(2);
  var ctx = document.getElementById('rt-chart').getContext('2d');

  const printableLabels = labels.slice(8, labels.length);

  var rtChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: printableLabels,
      datasets: [{
        data: [...rts].reverse().map(rt => rt.toFixed(2)),
        backgroundColor: 'transparent',
        borderColor: '#9D27B0',
        pointBorderColor: '#9D27B0',
        pointBorderWidth: 0,
        pointBackgroundColor: '#fff',
        pointRadius: 0,
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

  const [head, ...lastLabels] = labels;

  var absoluteChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: lastLabels,
      datasets: [{
        data: [...dailySick].reverse(),
        backgroundColor: [...dailySick].reverse().map(daily => getAbsoluteColor(dailySick, daily)),
        categoryPercentage: 0.5,
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