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
        datasets: [{}]
    },
    options: {
        title: {
            display: true,
            text: 'wemos 8266'
        },
        scales: {
            xAxes: [{

                type: 'time',
                distribution: 'series',
                time: {
                    unit: 'minute',
                    displayFormats: {
                        day: 'DD.MM.YYYY h:mm:ss'
                    },

                },
                ticks: {
                    source: 'auto'
                }
            }],

            yAxes: [{
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

    /* ----- chart select ----- */
    var s_menu = document.getElementById('sensors');
    var s_menu_ch = s_menu.children;
    for (var i = s_menu_ch.length - 1; i >= 0; i--) {
    	s_menu_ch[i].addEventListener('click', (e)=> {
    		e.preventDefault();
    		setChart(sensors[e.target.dataset.sensor], chart, chartParams);
    	})
    }

    /* ----- toggle RealTime ----- */
    var realTime = document.getElementById('realtime');
    var realTime_box = realTime.querySelector('input');

    var interval;
    if (realTime_box.checked)
    	interval = RealTimeInterval();

    realTime_box.addEventListener('change', ()=>{
	    if (!realTime.classList.contains('is-checked'))
	    	interval = RealTimeInterval()
	    else clearInterval(interval);
    });


});

function RealTimeInterval() {
    return setInterval(()=>{updateChart(chart, chartParams)},2000);
}


function setChart(sensor, chart, chartParams) {
    var dataset = chartParams.data.datasets[0];

    var filter = {
        sensor_id: sensor.id
    }

    for(let key in sensor) {
        dataset[key] = sensor[key];
    }

    GetData(filter, (responseData)=>{
        dataset.data = responseData;
        chart.update();
    });

}

function updateChart(chart, chartParams) {
    var dataset = chartParams.data.datasets[0];

    var filter = { sensor_id: dataset.id };

    var last_data = dataset.data.length;
    if (last_data) filter.from_datetime = dataset.data[0].x.DateTime();

    GetData(filter, (responseData)=>{
        dataset.data = responseData.concat(dataset.data);
        chart.update();
    });

}



function GetData (filter, cb) {

    xhrGET('/get.php', filter, function(response) {
        if (!response) return;
        var responseData = [];
        for (var i = response.length - 1; i >= 0; i--) {
            responseData.push({
                x: new Date(response[i][0]),
                y: response[i][1]
            });
        }

        if (typeof cb === 'function')
            cb(responseData);

    });

}
