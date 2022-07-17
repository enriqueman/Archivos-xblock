/* Javascript for StudioAnalyticsXBlock. */
function StudioAnalyticsXBlock(runtime, element) {
    document.querySelector(".showResults").addEventListener("click", showResults);
    // See load and submit funcions at python script
    var handlerUrlAnalytics = runtime.handlerUrl(element, "load_analytics");
  
    // On document load
    $(function ($) {
      $.ajax({
        type: "POST",
        url: handlerUrlAnalytics,
        data: "null", // No return needed.
        dataType: "json",
        success: function (data) {
          //add a header to the web page
          var header = "";
          header =
            '<div class="bg-primary  d-flex justify-content-center"> <h2 class="h1 text-white">Resultados Tests Herrmann V2</h2> </div>';
          $("#analytics-header").append(header);
          //show database results (student id, date, test name and test result) in an HTML table
          data.map((student) => {
            var html = "";
            /*if (student.test == 1) test_name = "Kolb"
                      if (student.test == 2) test_name = "Hermann"
                      if (student.test == 3) test_name = "Inteligencias Multiples"
                      if (student.test == 4) test_name = "Honey-Alonso"
                      if (student.test == 5) test_name = "Felder Silverman"
                      if (student.test == 6) test_name = "Bandler & Grinder"*/
            if (student.test == 7) test_name = "Herrmann_v2";
  
            html += "<tr>";
            html += "<td>" + student.user_id + "</td>";
            //html += '<td>' + student.fecha + '</td>'
            html += "<td>" + test_name + "</td>";
            html += "<td>" + student.result.result + "</td>";
            html += "</tr>";
            $("#analytics-table").append(html);
          });
        },
      });
    });
  
  
    function showResults() {
      $.ajax({
        type: "POST",
        url: handlerUrlAnalytics,
        data: "null", // No return needed.
        dataType: "json",
        success: function (data) {
          //show database results (student id, date, test name and test result) in an HTML table
          let a = 0, k = 0, v = 0, av = 0, ka = 0, vk = 0;
          let res = [];
          data.map((student) => {
            let x = student.result.result;
            res.push(x);
  
            a = 0, k = 0, v = 0, av = 0, ka = 0, vk = 0;
            for (var i = 0; i < res.length; i++) {
              
              if (res[i].substr(1, 29) == "Cuadrante predominante A (lógico-matemático)") {
                vk++;
              } else if (res[i].substr(30, 58) == "Cuadrante predominante B (organizado- analista)") {
                ka++;
              } else if (res[i].substr(59, 87) == "Cuadrante predominante C (emocional-sensitivo)") {
                av++;
              } else if (res[i].substr(88, 116) == "Cuadrante predominante D (intuitivo-imaginativo)") {
                a++;
              }
            }
          });
  
          var Chartgrafico = {
            type: "pie",
            data: {
              datasets: [{
                  data: [a, av, ka, vk],
                  backgroundColor: [
                      "#0870bc", "#0e2f57", "#19ebff", "#60111a",
                      ],
                }],
              labels: [a + "Intuitivo-Imaginativo", av + " Emocional-Sensitivo", ka + " Organizado-Analista", vk + " Lógico-Matemático"
              ]
              
               },
            options: {
              responsive: true,
            }
          }
  
          var grafica = document.getElementById("grafico").getContext("2d");
          window.pie = new Chart(grafica, Chartgrafico);
          
  
          var Chartgrafico2 = {
            type: "bar",
            data: {
              datasets: [{
                  data: [a, av, ka, vk],
                  backgroundColor: [
                      "#0870bc", "#0e2f57", "#19ebff", "#60111a",
                  ],
                }],
  
              labels: [
               a + "Intuitivo-Imaginativo", av + " Emocional-Sensitivo", ka + " Organizado-Analista", vk + " Lógico-Matemático"
              ]
              
            },
            options: {
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Total Estudiantes",
                    }
                  } ]
              },
              legend: {
                display: false, //ELiminar el label "undefined"
              }
            }
          }
  
          var grafica2 = document.getElementById("grafico2").getContext("2d");
          window.bar = new Chart(grafica2, Chartgrafico2);
  
  
  
          var texto = "Total de Estudiantes = ";
          var objetivo = document.getElementById("resultado");
          objetivo.innerHTML = texto + res.length;
        },
      });
    }
  }
  
