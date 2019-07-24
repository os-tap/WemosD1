var sensors = {
	1: {
		id: 1,
		label: 'Температура',
		borderColor: 'red',
		steppedLine: false
	},
	2: {
		id: 2,
		label:'Влажность',
		borderColor: 'blue',
		steppedLine: false
	},
	3: {
		id: 3,
		label:'Расстояние',
		borderColor: 'green',
		steppedLine: false
	},
	4: {
		id: 4,
		label:'Движение',
		borderColor: 'yellow',
		steppedLine: true
	}
};


var chartParams = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Температура',
            data: [],
            // backgroundColor: 'transparent',
            borderColor: 'red',

        }, ]
    },
    options: {
        title: {
            display: true,
            text: 'wemos 8266'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    // display: true,
                    labelString: 'Время'
                },

                type: 'time',
                // distribution: 'series',
                time: {
                    // parser: 'YYYY-MM-DD HH:mm:ss',
                    unit: 'hour',
                    displayFormats: {
                        day: 'DD.MM.YYYY h:mm:ss'
                    },

                },
                ticks: {
                    source: 'auto'
                }
            }],

            yAxes: [{
                scaleLabel: {
                    // display: true,
                    labelString: 'Температура, С'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {

    chart = new Chart(document.getElementById("line-chart"), chartParams);
    setChart(sensors['1'], chart, chartParams);

    var s_menu = document.getElementById('sensors');
    var s_menu_ch = s_menu.children;
    for (var i = s_menu_ch.length - 1; i >= 0; i--) {
    	s_menu_ch[i].addEventListener('click', (e)=> {
    		e.preventDefault();
    		console.log(e.target.dataset.sensor);
    		setChart(sensors[e.target.dataset.sensor], chart, chartParams);
    	})
    }

    console.log(JSON.parse('null'));

    var realTime = document.getElementById('realtime');
    var realTime_box = realTime.querySelector('input');

    var interval;
    if (realTime_box.checked)
    	interval = setInterval(()=>{updateChart(chart, chartParams)},2000);

    realTime_box.addEventListener('change', ()=>{
	    if (!realTime.classList.contains('is-checked'))
	    	interval = setInterval(()=>{updateChart(chart, chartParams)},2000);
	    else clearInterval(interval);
    });





});


function setChart(sensor, chart, chartParams) {
    var filter = {
        sensor_id: sensor.id
    }
    chartParams.data.datasets[0].id = sensor.id;
    chartParams.data.datasets[0].label = sensor.label;
    chartParams.data.datasets[0].borderColor = sensor.borderColor;
    chartParams.data.datasets[0].steppedLine = sensor.steppedLine;


    xhrGET('/get.php', filter, function(response) {
        let responseData = [];
        for (var i = response.length - 1; i >= 0; i--) {
            responseData.push({
                x: new Date(response[i][0]),
                y: response[i][1]
            });
        }

        chartParams.data.datasets[0].data = responseData;
        chart.update();
        console.log(response);
    });
}

function updateChart(chart, chartParams) {


    var filter = {
        sensor_id: chartParams.data.datasets[0].id,
    }

    let last_data = chartParams.data.datasets[0].data.length;

    if (last_data)
    	filter.from_datetime = chartParams.data.datasets[0].data[0].x.DateTime();

    xhrGET('/get.php', filter, function(response) {
    	if (!response) return;
        let responseData = [];
        for (var i = response.length - 1; i >= 0; i--) {
            responseData.push({
                x: new Date(response[i][0]),
                y: response[i][1]
            });
        }

        chartParams.data.datasets[0].data = responseData.concat(chartParams.data.datasets[0].data);
        chart.update();
        console.log(response);
    });
}
