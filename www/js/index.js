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

        let storage = window.localStorage;
       // storage.clear();

        let table = document.getElementById("last-entries");
        createTable();
        let chart;
        createChart();

        window.addEventListener("batterystatus", onBatteryStatus, false);


        function onBatteryStatus(status) {
            saveInDatabase(status.level);
            document.getElementById('Battery').innerHTML = status.level + "%";
        }

        function saveInDatabase(battery_status) {
            var key = new Date();
            storage.setItem(key, battery_status);
            updateTable(key, battery_status);
            updateChart(key, battery_status)
        }

        function updateTable(key, value){
            let row = table.insertRow(1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);

            cell1.innerHTML = formatToTime(new Date(key));
            cell2.innerHTML = value;

            console.log("Inserted into table");
            console.log(cell1.innerHTML + " " + cell2.innerHTML);

            let rowCount = table.rows.length;
            if(rowCount > 10) {
                table.deleteRow(rowCount -1);
            }
        }

        function createTable(){
          let keys = getSortedKeys();
          console.log("createTable");
          console.log(keys);
          i = 0
          while( i++ < keys.length) {
              updateTable(keys[i], storage.getItem(keys[i]));
          }
        }

        function updateChart(key, value){
           createChart();
           //chart.data.labels[chart.data.labels.length] = formatToTime(key);
           //chart.data.datasets[0].data[chart.data.labels.length] = value;
           //chart.update();
        }

        function createChart(){
          console.log("Creating chart.")
          Chart.defaults.global.defaultFontFamily = 'Lato';
          Chart.defaults.global.defaultFontSize = 11;
          Chart.defaults.global.defaultFontColor = '#777';

          chart = new Chart(myChart, {
            type:'line',
            data:{
              labels: getTimeStamps(),
              datasets:[{
                label:'Battery Level',
                data: getSortedValues(),
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

   function getSortedKeys() {
      var dateValues = [];
      keys = Object.keys(storage);
      i = keys.length;

      while ( i-- ) {
        dateValues.push(new Date(keys[i]));
      }

     dateValues.sort(function(o1,o2){
          if (o1 < o2)    return -1;
          else if(o1 > o2) return  1;
          else                      return  0;
      });

      if(dateValues.length > 10){
        dateValues = dateValues.slice(Math.max(dateValues.length - 10, 0));
      }
      return dateValues;
    }

    function formatToTime(dateString){
      let d = new Date(dateString);
      return d.getHours() + ":" + d.getMinutes();
    }

    function getTimeStamps(){
        let sortedTimeStamps = [];
        keys = getSortedKeys();

        i = 0;
        while ( i++ < keys.length ) {
           formatedTimestamp = formatToTime(new Date(keys[i]));

           if(!formatedTimestamp.toUpperCase().includes("NAN")) {
             sortedTimeStamps.push(formatedTimestamp);
          }
        }
        return sortedTimeStamps;//.slice(Math.max(sortedTimeStamps.length - 10, 0));
    }

     function getSortedValues() {
         let values = [];
         let keys = getSortedKeys();

         i = 0;
         while ( i++ < keys.length ) {
           values.push(storage.getItem(keys[i]));
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
