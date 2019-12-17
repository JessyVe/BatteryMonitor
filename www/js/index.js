// TODO: Check if array has even expected amout of entries!

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        window.addEventListener("batterystatus", onBatteryStatus, false);

        //var storage = window.localStorage;
        //storage.clear();

        let table = document.getElementById("last-entries");
        createTable();
        let chart;
        createChart();

        function onBatteryStatus(status) {
            saveInDatabase(status.level);
            document.getElementById('Battery').innerHTML = status.level + "%";
        }

        function saveInDatabase(battery_status) {
            var key = new Date();
            var storage = window.localStorage;
            storage.setItem(key, battery_status);

            updateTable(key, battery_status);
            updateChart(key, battery_status)
        }

        function updateTable(key, value){
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            cell1.innerHTML = formatToTime(new Date(key));
            cell2.innerHTML = value;

            var rowCount = table.rows.length;
            if(rowCount > 10) {
                table.deleteRow(rowCount -1);
            }
        }

        function createTable(){
          for (var key in getSortedKeys().slice(Math.max(getSortedKeys().length - 10, 0))) {
              updateTable(key, getSortedValues(key));
              console.log("Add into table")
          }
        }

        function updateChart(key, value){
           createChart();
           //chart.data.labels[chart.data.labels.length] = formatToTime(key);
           //chart.data.datasets[0].data[chart.data.labels.length] = value;
           //chart.update();
        }

        function createChart(){
          Chart.defaults.global.defaultFontFamily = 'Lato';
          Chart.defaults.global.defaultFontSize = 11;
          Chart.defaults.global.defaultFontColor = '#777';

          chart = new Chart(myChart, {
            type:'line',
            data:{
              labels: getTimeStamps().slice(Math.max(getTimeStamps().length - 5, 0)),
              datasets:[{
                label:'Battery Level',
                data: getSortedValues().slice(Math.max(getTimeStamps().length - 5, 0)),
                borderWidth:1,
                borderColor:'#777',
                hoverBorderWidth:3,
                hoverBorderColor:'#000'
              }]
            },
            options:{
              title:{
                display:false,
                text:'Battery level History',
                fontSize:25
              },
              legend:{
                display:false,
                position:'right',
                labels:{
                  fontColor:'#000'
                }
              },
              layout:{
                padding:{
                  left:0,
                  top:0
                }
              },
              tooltips:{
                enabled:true
              }
            }
          });
        }

    function formatToTime(date){
       return date.getHours() + ":" + date.getMinutes();
    }

    function getTimeStamps(){
        var sortedTimeStamps = [];
        keys = getSortedKeys();
        i = 0;

        while ( i++ < keys.length ) {
          sortedTimeStamps.push(formatToTime(new Date(keys[i])));
        }
        console.log(sortedTimeStamps);
        return sortedTimeStamps;
    }

    function getSortedKeys() {
        var dateValues = [];
        keys = Object.keys(localStorage);
        i = keys.length;

        while ( i-- ) {
          dateValues.push(new Date(keys[i]));
        }

        dateValues.sort(function(o1,o2){
            if (o1 < o2)    return -1;
            else if(o1 > o2) return  1;
            else                      return  0;
        });
        return dateValues;
     }

     function getSortedValues() {
         var values = [];
         keys = getSortedKeys();
         i = keys.length;

         while ( i-- ) {
             values.push(localStorage.getItem(keys[i]) );
         }
         return values;
       }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
