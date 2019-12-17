
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
        //window.localstorage.clear();
        createChart();
        function onBatteryStatus(status) {
            saveInDatabase(status.level);
            document.getElementById('Battery').innerHTML = "Battery status: " + status.level + "%";
        }

        function saveInDatabase(battery_status) {
              document.getElementById('Log').text += "called"
                var key = new Date();
              var storage = window.localStorage;
              storage.setItem(key, battery_status) // Pass a key name and its value to add or update that key.
              //var value = storage.getItem(key); // Pass a key name to get its value.
              document.getElementById('Database').innerHTML += "<br>New value saved: " + storage.getItem(key);
        }

        function updateChart(){

        }

        function createChart(){
          let myChart = document.getElementById('myChart').getContext('2d');
          console.log('Create chart');
          // Global Options
          Chart.defaults.global.defaultFontFamily = 'Lato';
          Chart.defaults.global.defaultFontSize = 11;
          Chart.defaults.global.defaultFontColor = '#777';

          let massPopChart = new Chart(myChart, {
            type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:{
              labels: getKeys(), //['Yesterday', 'Today', 'Tomorrow'],
              datasets:[{
                label:'Battery Level',
                data: getValues(), //[80, 45, 93],
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


    function getKeys() {
      var values = [];
      keys = Object.keys(localStorage);
      i = keys.length;

      while ( i-- ) {
        date = new Date(keys[i]);
          values.push(date.toLocaleTimeString('en-US'));
      }
      return values;
        //return Object.keys(localStorage);
     }

     function getValues() {
         var values = [];
         keys = Object.keys(localStorage);
         i = keys.length;

        console.log(keys);

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
