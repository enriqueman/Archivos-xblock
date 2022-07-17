/* Javascript for StudentAdaptiveTestXBlock. */
function StudentAdaptiveTestXBlock(runtime, element) {
    // See load and submit funcions at python script
    var handlerUrlLoad = runtime.handlerUrl(element, 'load_test');
    var handlerUrlSubmit = runtime.handlerUrl(element, 'submit_test');
    //*********** DATABASE HANDLER BIN*********
    var handlerUrlUpdate = runtime.handlerUrl(element, 'update');

    // On document load
    $(function ($) {
        window.test = 0;

        $.ajax({
            type: "POST",
            url: handlerUrlLoad,
            data: "null",
            success: function (data) {
                window.test = data.test;

                if (data.test_result) {

                    $("#test").empty();
                    // Avoid fake submitments
                    $("#submit-test").attr("disabled", true);
                    // Displays result
                    $("#test").append('<p> Tu test ha revelado que eres: <br>' + data.test_result.result + '</p>')

                    // --------------------------------------------------------
                    //if (data.test == 6){
                    arraydatos = data.test_result.result.split(" ");
                    console.log(arraydatos);
                    p_visual = 0;
                    p_auditivo = 0;
                    p_kines = 0;
                    

                    for (var i = 0; i < arraydatos.length; i++) {
                        if (arraydatos[i].substr(0, 11) == "<br>Visual:") {
                            p_visual = arraydatos[i+1].substring(0, arraydatos[i+1].length - 1);
                        } else if (arraydatos[i].substr(0, 13) == "<br>Auditivo:") {
                            p_auditivo = arraydatos[i+1].substring(0, arraydatos[i+1].length - 1);
                        }else if (arraydatos[i].substr(0, 16) == "<br>Kinestésico:") {
                            p_kines = arraydatos[i+1].substring(0, arraydatos[i+1].length - 1);
                        }
                    }

                var Chartgrafico = {
                        type: "bar",
                        data: {
                            datasets: [{
                                data: [p_visual, p_auditivo, p_kines],
                                backgroundColor: [
                                    '#0e2f57', '#0870bc', '#08bcff',
                                ],
                            }],
                            labels: [
                                " Visual", " Auditivo", " Kinestésico",
                            ]
                        },
			 options: {
			    responsive: true,
			    plugins: {
				legend: {
				    display: false
				}
			    }
			}
                    }

                    var grafica = document.getElementById('chart');
                    window.pie = new Chart(grafica, Chartgrafico);


                    // }
                    //---------------------------------------------------------

                    if (data.test == 5) {

                        var valores = [0, 0, 0, 0, 0, 0, 0, 0]

                        resultados = data.test_result.result
                        resultados = resultados.replaceAll("Mucho mas", "3 1")
                        resultados = resultados.replaceAll("Es mas", "2 1")
                        resultados = resultados.replaceAll("Equilibrio entre", "2 2")
                        resultados = resultados.replaceAll(" que ", " ")
                        resultados = resultados.replaceAll(" y ", " ")
                        resultados = resultados.split("<br>")

                        resultados.forEach(element => {

                            variable = element.split(" ")

                            if (variable[2] == "Verbal") {
                                valores[0] = variable[0]
                                valores[4] = variable[1]
                            } else if (variable[3] == "Verbal") {
                                valores[0] = variable[1]
                                valores[4] = variable[0]
                            }
                            if (variable[2] == "Sensorial") {
                                valores[7] = variable[0]
                                valores[3] = variable[1]
                            } else if (variable[3] == "Sensorial") {
                                valores[7] = variable[1]
                                valores[3] = variable[0]
                            }
                            if (variable[2] == "Activo") {
                                valores[2] = variable[0]
                                valores[6] = variable[1]
                            } else if (variable[3] == "Activo") {
                                valores[2] = variable[1]
                                valores[6] = variable[0]
                            }
                            if (variable[2] == "Global") {
                                valores[5] = variable[0]
                                valores[1] = variable[1]
                            } else if (variable[3] == "Global") {
                                valores[5] = variable[1]
                                valores[1] = variable[0]
                            }
                        });

                        var valores_int = valores.map(function (x) {
                            return parseInt(x, 10);
                        });

                        var options = {
                            responsive: false,
                            maintainAspectRatio: true,
                            scale: {
                                max: 3,
                                min: 0,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        };

                        var dataLiteracy = {
                            labels: ['Verbal', 'Secuencial', 'Activo', 'Intuitivo', 'Visual', 'Global', 'Reflexivo', 'Sensorial'],
                            datasets: [{
                                label: "Resultados",
                                backgroundColor: "rgba(100,123,255,0.5)",
                                borderColor: "rgba(100,123,255,1)",
                                pointBackgroundColor: "rgba(179,181,198,1)",
                                pointBorderColor: "#0064ff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "rgba(179,181,198,1)",
                                data: valores_int
                            }]
                        };

                        var ctx = document.getElementById("chart");
                        var myRadarChart = new Chart(ctx, {
                            type: 'radar',
                            data: dataLiteracy,
                            options: options
                        });

                        console.log(myRadarChart);
                    }

                } else {
                    if (data.test == 0) loadAlreadyPresented();
                    if (data.test == 1) loadKolb();
                    if (data.test == 2) loadDominancia();
                    if (data.test == 3) loadInteligencias();
                    if (data.test == 4) loadHoneyAlonso();
                    if (data.test == 5) loadFelderSilverman();
                    if (data.test == 6) loadBandlerGrinder();

                    $("#sortable, #sortable1, #sortable2, #sortable3, #sortable4, #sortable5, #sortable6, #sortable7, #sortable8, #sortable9, #sortable10, #sortable11").sortable();
                    $("#sortable, #sortable1, #sortable2, #sortable3, #sortable4, #sortable5, #sortable6, #sortable7, #sortable8, #sortable9, #sortable10, #sortable11").disableSelection();
                }
            }
        });

        // On submit, send test result
        $("#submit-test").click(function () {
            // Uploads a result: { 'result': 'convergente <or any>' }
            var result = {};
            var test_name = ""; // ******** DATABASE VARIABLE ********
            if (test == 1) {
                result = getTestKolbResults();
                test_name = "Kolb"
            }
            if (test == 2) {
                result = getTestHerrmannResults();
                test_name = "Hermann"
            }
            if (test == 3) {
                result = getTestInteligencias();
                test_name = "Inteligencias Multiples"
            }
            if (test == 4) {
                result = getTestHoneyAlonso();
                test_name = "Honey-Alonso"
            }
            if (test == 5) {
                result = getFelderSilverman();
                test_name = "Felder Silverman"
            }
            if (test == 6) {
                result = getBandlerGrinder();
                test_name = "Bandler & Grinder"
            }

            $.ajax({
                type: "POST",
                url: handlerUrlSubmit,
                data: JSON.stringify(result),
                dataType: 'json',
                success: function (data) {
                    // Clear GUI
                    $("#test").empty();
                    // Avoid fake submitments
                    $("#submit-test").attr("disabled", true);

                    // Displays result
                    $("#test").append('<p> Tu test ha revelado que eres: <br>' + result.result + '</br></p>')
                    // send test results to the python file, so they can be uploaded to database

                    //---------------------------------------------
                    arraydatos = result.result.split(" ");
                    console.log(arraydatos);
                    p_visual = 0;
                    p_auditivo = 0;
                    p_kines = 0;
                    
                    for (var i = 0; i < arraydatos.length; i++) {
                        if (arraydatos[i].substr(0, 11) == "<br>Visual:") {
                            p_visual = arraydatos[i+1].substring(0, arraydatos[i+1].length - 1);
                        } else if (arraydatos[i].substr(0, 13) == "<br>Auditivo:") {
                            p_auditivo = arraydatos[i+1].substring(0, arraydatos[i+1].length - 1);
                        }else if (arraydatos[i].substr(0, 16) == "<br>Kinestésico:") {
                            p_kines = arraydatos[i+1].substring(0, arraydatos[i+1].length - 1);
                        }
                    }

                   var Chartgrafico = {
                        type: "bar",
                        data: {
                            datasets: [{
                                data: [p_visual, p_auditivo, p_kines],
                                backgroundColor: [
                                    '#0e2f57', '#0870bc', '#08bcff',
                                ],
                            }],
                            labels: [
                                " Visual", " Auditivo", " Kinestésico",
                            ]
                        },
			 options: {
			    responsive: true, 
			    plugins: {
				legend: {
				    display: false
				}
			    }
			}
                    }

                    var grafica = document.getElementById('chart');
                    window.pie = new Chart(grafica, Chartgrafico);
                    //----------------------------------------------

                    $.ajax({
                        type: "POST",
                        url: handlerUrlUpdate,
                        data: JSON.stringify({ "test_name": test_name, "result": result.result })
                    });
                }
            });
        });
    });

    // TODO: Improve the way these HTML files are being loaded, in order to make this system flexible
    // NOTE: use https://www.willpeavy.com/tools/minifier/
    // to minify (single line) HTML text files
    function loadKolb() {
        html = kolb;
        $("#test").html(html);
    }

    function loadDominancia() {
        html = dominancia;
        $("#test").html(html);
    }

    function loadInteligencias() {
        html = inteligencias;
        $("#test").html(html);
    }

    function loadHoneyAlonso() {
        html = honeyAlonso;
        $("#test").html(html);
    }

    function loadFelderSilverman() {
        html = felderSilverman;
        $("#test").html(html);
    }

    function loadBandlerGrinder() {
        html = bandlerGrinder;
        $("#test").html(html);
    }

    function loadAlreadyPresented() {
        html = '<p>El test no está disponible.</p>';
        $("#test").html(html);
        $("#submit-test").attr("disabled", true);
    }

    /* 
     * HERRMANN TEST. Documentation about the answers was provided but there is no input-ouput
     * relation, rather than a polar plane with A to D quadrants.
     * Therefore, the result of this test is based upon a scoring mechanism:
     * each question (1 to 4) scores per section (A to D). Prominent section is returned
     * as result.
     */
    function getTestHerrmannResults() {
        const sections = ["A", "B", "C", "D"];
        var results = [];
        var sectionsScore = [];

        sections.map((section) => {
            var scorePerSection = 0;
            for (var i = 1; i < 5; i++) {
                var value = parseInt(document.querySelector('input[name="' + section + i + '"]:checked').value);
                scorePerSection += value; // values are between 0 and 1, see template HTML
                results.push(value);
            }
            sectionsScore.push(scorePerSection);
        })

        // At this point, we have an array of 0s or 1s, according to chosen answer
        //alert(JSON.stringify(results))

        // Now we get the most relevant quadrant
        const highestSection = sectionsScore.indexOf(Math.max(...sectionsScore));
        var strQuadrant = '';

        switch (highestSection) {
            case 0: {
                strQuadrant = 'Lógico' // A
                break;
            }
            case 1: {
                strQuadrant = 'Organizado' // B
                break;
            }
            case 2: {
                strQuadrant = 'Interpersonal' // C
                break;
            }
            case 3: {
                strQuadrant = 'Holísitico' // D
                break;
            }
        }

        //TODO: Improve. If scoring per section is equal and there is more than one prominent classifications, all must be returned
        // This reminds, how to classify multifaceted people

        return { result: strQuadrant, result_details: sectionsScore };
    }


    function getTestInteligencias() {
        const sections = ["A", "B", "C", "D", "E", "F", "G"];
        var results = [];
        var sectionsScore = [];

        sections.map((section) => {
            var scorePerSection = 0;
            for (var i = 1; i < 6; i++) {
                var value = parseInt(document.querySelector('input[name="' + section + i + '"]:checked').value);
                scorePerSection += value; // values are between 0 and 1, see template HTML
                results.push(value);
            }
            sectionsScore.push(scorePerSection);
        })
        const highestSection = sectionsScore.indexOf(Math.max(...sectionsScore));
        var strQuadrant = '';

        switch (highestSection) {
            case 0: {
                strQuadrant = 'Inteligencia Verbal' // A
                break;
            }
            case 1: {
                strQuadrant = 'Inteligencia Logico-Matematica' // B
                break;
            }
            case 2: {
                strQuadrant = 'Inteligencia Visual-Espacial' // C
                break;
            }
            case 3: {
                strQuadrant = 'Inteligencia Kinestesica-Corporal' // D
                break;
            }
            case 4: {
                strQuadrant = 'Inteligencia Musical-Ritmica' // E
                break;
            }
            case 5: {
                strQuadrant = 'Inteligencia Intrapersonal' // F
                break;
            }
            case 6: {
                strQuadrant = 'Inteligencia Interpersonal' // H
                break;
            }

        }

        //TODO: Improve. If scoring per section is equal and there is more than one prominent classifications, all must be returned
        // This reminds, how to classify multifaceted people

        return { result: strQuadrant, result_details: sectionsScore };
    }
    function getTestHoneyAlonso() {
        const sections = ["A", "B", "C", "D"];
        var results = [];
        var sectionsScore = [];

        sections.map((section) => {
            var scorePerSection = 0;
            for (var i = 1; i < 21; i++) {
                var value = parseInt(document.querySelector('input[name="' + section + i + '"]:checked').value);
                scorePerSection += value; // values are between 0 and 1, see template HTML
                results.push(value);
            }
            sectionsScore.push(scorePerSection);
        })

        // At this point, we have an array of 0s or 1s, according to chosen answer
        //alert(JSON.stringify(results))

        // Now we get the most relevant quadrant
        const highestSection = sectionsScore.indexOf(Math.max(...sectionsScore));
        var strQuadrant = '';

        switch (highestSection) {
            case 0: {
                strQuadrant = 'Activo' // A
                break;
            }
            case 1: {
                strQuadrant = 'Reflexivo' // B
                break;
            }
            case 2: {
                strQuadrant = 'Teórico' // C
                break;
            }
            case 3: {
                strQuadrant = 'Pragmático' // D
                break;
            }
        }

        //TODO: Improve. If scoring per section is equal and there is more than one prominent classifications, all must be returned
        // This reminds, how to classify multifaceted people

        return { result: strQuadrant, result_details: sectionsScore };
    }

    function getBandlerGrinder() {
        try {
            responseTestBG = {}
            const visual = ['b', 'a', 'b', 'c', 'c', 'b', 'a', 'b', 'a', 'c', 'b', 'b', 'c', 'a', 'b', 'a', 'c', 'c', 'a', 'a', 'b', 'c', 'a', 'b', 'a', 'c', 'b', 'c', 'b', 'c', 'b', 'c', 'a', 'b', 'b', 'a', 'a', 'b', 'b', 'c'];
            const auditivo = ['a', 'c', 'a', 'b', 'b', 'a', 'b', 'a', 'c', 'b', 'a', 'c', 'a', 'b', 'a', 'c', 'b', 'a', 'b', 'c', 'c', 'a', 'b', 'a', 'b', 'b', 'a', 'b', 'c', 'b', 'a', 'a', 'c', 'a', 'c', 'c', 'b', 'c', 'c', 'a'];
            const cines   = ['c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c'];
            const intuitivo=['d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d'];
            let strQuadrant = '';

            const visualResult = [];
            const auditivoResult = [];
            const cinesResult = [];
            console.log(visualResult.length)
            for (let i = 1; i < 41; i++) {
                let value = document.querySelector('input[name="N' + i + '"]:checked').value || 'hola';
                if (value == visual[i - 1]) {
                    visualResult.push(1);
                }
                if (value == auditivo[i - 1]) {
                    auditivoResult.push(1);
                }
                if (value == cines[i - 1]) {
                    cinesResult.push(1);
                }
            }
            if (visualResult.length >= auditivoResult.length && visualResult.length >= cinesResult.length) {
                if (visualResult.length == auditivoResult.length) {
                    strQuadrant = 'Dominante Visual-Auditivo <br>';
                } else if (visualResult.length == cinesResult.length) {
                    strQuadrant = 'Dominante Visual-Kinestésico <br>';
                } else {
                    strQuadrant = 'Dominante Visual <br>';
                }
                strQuadrant = strQuadrant + `Visual: ${visualResult.length * 100 / 40}% <br>`
                if (auditivoResult.length >= cinesResult.length) {
                    strQuadrant = strQuadrant + `Auditivo: ${auditivoResult.length * 100 / 40}% <br>`
                    strQuadrant = strQuadrant + `Kinestésico: ${cinesResult.length * 100 / 40}% <br>`
                } else {
                    strQuadrant = strQuadrant + `Kinestésico: ${cinesResult.length * 100 / 40}% <br>`
                    strQuadrant = strQuadrant + `Auditivo: ${auditivoResult.length * 100 / 40}% <br>`
                }

            } else if (auditivoResult.length >= visualResult.length && auditivoResult.length >= cinesResult.length) {
                if (auditivoResult.length == cinesResult.length) {
                    strQuadrant = 'Dominante Auditivo-Kinestésico <br>';
                } else {
                    strQuadrant = 'Dominante Auditivo <br>';
                }
                strQuadrant = strQuadrant + `Auditivo: ${auditivoResult.length * 100 / 40}% <br>`
                if (visualResult.length >= cinesResult.length) {
                    strQuadrant = strQuadrant + `Visual: ${visualResult.length * 100 / 40}% <br>`
                    strQuadrant = strQuadrant + `Kinestésico: ${cinesResult.length * 100 / 40}% <br>`
                } else {
                    strQuadrant = strQuadrant + `Kinestésico: ${cinesResult.length * 100 / 40}% <br>`
                    strQuadrant = strQuadrant + `Visual: ${visualResult.length * 100 / 40}% <br>`
                }

            } else if (cinesResult.length >= visualResult.length && cinesResult.length > auditivoResult.length) {
                strQuadrant = 'Dominante Kinestésico <br>';
                strQuadrant = strQuadrant + `Kinestésico: ${cinesResult.length * 100 / 40}% <br>`
                if (visualResult.length >= auditivoResult.length) {
                    strQuadrant = strQuadrant + `Visual: ${visualResult.length * 100 / 40}% <br>`
                    strQuadrant = strQuadrant + `Auditivo: ${auditivoResult.length * 100 / 40}% <br>`
                } else {
                    strQuadrant = strQuadrant + `Auditivo: ${auditivoResult.length * 100 / 40}% <br>`
                    strQuadrant = strQuadrant + `Visual: ${visualResult.length * 100 / 40}% <br>`
                }

            }

            //strQuadrant = {'result':`auditivo: ${auditivoResult.length*100/40}%`}; dddddddd
            responseTestBG = { 'result': strQuadrant };
            return responseTestBG;
        }
        catch (e) {
            console.log(e);
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'Nos has llenado el test en su totalidad!'
            })
        }
    }

    function getFelderSilverman() {
        try {
            const sections = ["A", "B", "C", "D"];
            const componentes = ['Activo', 'Reflexivo', 'Sensorial', 'Intuitivo', 'Visual', 'Verbal', 'Secuencial', 'Global'];
            var strQuadrant = '';
            var sectionsScore = [];

            sections.map((section) => {
                var scorePerSectionA = 0;
                var scorePerSectionB = 0;
                for (var i = 1; i < 12; i++) {


                    var value = document.querySelector('input[name="' + section + i + '"]:checked').value;



                    if (value == "a") {
                        scorePerSectionA += 1; // values are between 0 and 1, see template HTML                   
                    }




                    else {
                        scorePerSectionB += 1;
                    }

                }
                sectionsScore.push(scorePerSectionA);
                sectionsScore.push(scorePerSectionB);
            })

            // At this point, we have an array of 0s or 1s, according to chosen answer
            //alert(JSON.stringify(results))

            // Now we get the most relevant quadrant

            for (var i = 0; i < sectionsScore.length; i = i + 2) {

                var diferencia = Math.abs(sectionsScore[i] - sectionsScore[i + 1])
                if (sectionsScore[i] > sectionsScore[i + 1]) {

                    var index_componente1 = i;
                    var index_componente2 = i + 1;

                } else {

                    var index_componente1 = i + 1;
                    var index_componente2 = i;

                }
                switch (diferencia) {
                    case 1:
                    case 3:
                        var resultado = 'Equilibrio entre ' + componentes[index_componente1] + ' y ' + componentes[index_componente2];
                        break;
                    case 5:
                    case 7:
                        var resultado = 'Es mas ' + componentes[index_componente1] + ' que ' + componentes[index_componente2];
                        break;
                    case 9:
                    case 11:
                        var resultado = 'Mucho mas ' + componentes[index_componente1] + ' que ' + componentes[index_componente2];
                        break;
                }

                strQuadrant = strQuadrant + resultado + '<br>';
            }


            //TODO: Improve. If scoring per section is equal and there is more than one prominent classifications, all must be returned
            // This reminds, how to classify multifaceted people

            var valores = [0, 0, 0, 0, 0, 0, 0, 0]

            resultados = strQuadrant
            resultados = resultados.replaceAll("Mucho mas", "3 1")
            resultados = resultados.replaceAll("Es mas", "2 1")
            resultados = resultados.replaceAll("Equilibrio entre", "2 2")
            resultados = resultados.replaceAll(" que ", " ")
            resultados = resultados.replaceAll(" y ", " ")
            resultados = resultados.split("<br>")

            resultados.forEach(element => {

                variable = element.split(" ")

                if (variable[2] == "Verbal") {
                    valores[0] = variable[0]
                    valores[4] = variable[1]
                } else if (variable[3] == "Verbal") {
                    valores[0] = variable[1]
                    valores[4] = variable[0]
                }
                if (variable[2] == "Sensorial") {
                    valores[7] = variable[0]
                    valores[3] = variable[1]
                } else if (variable[3] == "Sensorial") {
                    valores[7] = variable[1]
                    valores[3] = variable[0]
                }
                if (variable[2] == "Activo") {
                    valores[2] = variable[0]
                    valores[6] = variable[1]
                } else if (variable[3] == "Activo") {
                    valores[2] = variable[1]
                    valores[6] = variable[0]
                }
                if (variable[2] == "Global") {
                    valores[5] = variable[0]
                    valores[1] = variable[1]
                } else if (variable[3] == "Global") {
                    valores[5] = variable[1]
                    valores[1] = variable[0]
                }
            });

            var valores_int = valores.map(function (x) {
                return parseInt(x, 10);
            });



            var options = {
                responsive: false,
                maintainAspectRatio: true,
                scale: {
                    max: 3,
                    min: 0,
                    ticks: {
                        stepSize: 1
                    }
                }
            };

            var dataLiteracy = {
                labels: ['Verbal', 'Secuencial', 'Activo', 'Intuitivo', 'Visual', 'Global', 'Reflexivo', 'Sensorial'],
                datasets: [{
                    label: "Resultados",
                    backgroundColor: "rgba(100,123,255,0.5)",
                    borderColor: "rgba(100,123,255,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#0064ff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: valores_int
                }]
            };

            var ctx = document.getElementById("chart");
            var myRadarChart = new Chart(ctx, {
                type: 'radar',
                data: dataLiteracy,
                options: options
            });

            console.log(myRadarChart);

            return { result: strQuadrant, result_details: sectionsScore };

        }

        catch (e) {
            console.log(e);
            window.alert("NO has llenado la totalidad del Test!");
        }
    }


    /* 
     * Functions inherited from last team (Kolb team at 2018). Contact for support.
     * These functions act as a scrapper for sortables input.
     */
    function getTestKolbResults() {
        columns = getAnswersFromForm();
        responseTestKolb = {}

        sumColumns = []
        coords = { "x": -1, "y": -1 }
        for (var k = 0, length3 = columns.length; k < length3; k++) {
            sumColumns.push(getSumColumn(columns[k]))
        }
        coords.x = sumColumns[3] - sumColumns[1]
        coords.y = sumColumns[2] - sumColumns[0]

        if (coords.x > 6 && coords.y >= 4) {
            responseTestKolb = { 'result': "convergente" };
        }

        if (coords.x >= 6 && coords.y <= 4) {
            responseTestKolb = { 'result': "acomodador" };
        }

        if (coords.x <= 6 && coords.y >= 4) {
            responseTestKolb = { 'result': "asimilador" };
        }

        if (coords.x <= 6 && coords.y <= 4) {
            responseTestKolb = { 'result': "divergente" };
        }

        return responseTestKolb;
    }

    function getAnswersFromForm() {
        let columnA = []
        let columnB = []
        let columnC = []
        let columnD = []
        let formAnswers = document.getElementsByTagName('ul');

        for (var j = 0, length2 = formAnswers.length; j < length2; j++) {
            answersQuestions = formAnswers[j].getElementsByTagName('span');
            for (var k = 0, length3 = answersQuestions.length; k < length3; k++) {
                listClass = answersQuestions[k].classList;
                classAnswer = listClass[listClass.length - 1];

                switch (classAnswer) {
                    case 'columnA':
                        columnA.push(k + 1);
                        break;
                    case 'columnB':
                        columnB.push(k + 1);
                        break;
                    case 'columnC':
                        columnC.push(k + 1);
                        break;
                    case 'columnD':
                        columnD.push(k + 1);
                        break;
                }
            }
        }

        return [columnA, columnB, columnC, columnD];
    }

    function getSumColumn(column) {
        let sum = 0;

        for (var k = 0, length3 = column.length; k < length3; k++) {
            sum += column[k];
        }

        return sum;
    }
}

document.getElementById("btnVistaEstudiante").addEventListener("click", function () {
    window.location.href = "/scenario/adaptive_test.0/vista_reglas_estudiante/" + window.location.search;
});