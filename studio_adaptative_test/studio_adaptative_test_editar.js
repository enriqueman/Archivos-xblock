
/* Javascript for StudentAdaptiveTestXBlock. */
function StudioAdaptiveTestXBlock(runtime, element) {

    
    function showTestAlert(index){

        if(index==0) alert("Kolb seleccionado con éxito");
        if(index==1) alert("Dominancia Cerebral seleccionado con éxito");
        if(index==2) alert("Inteligencias Multiples seleccionado con éxito");
        if(index==3) alert("Honey-Alonso seleccionado con éxito");
        
        if(index==4) Swal.fire(
            'Éxito!',
            'Test Felder Silverman seleccionado!',
            'success'
        ).then( () => {location.href="http://localhost:8000/scenario/adaptive_test.0/studio_analytics/";})
    
        //alert("Felder Silverman seleccionado con éxito") 
        if(index==5) Swal.fire(
            'Éxito!',
            'Test Bandler & Grinder seleccionado!',
            'success'
        ).then( () => {location.href="http://localhost:8000/scenario/adaptive_test.0/studio_analytics/";})
        
        if(index==7) Swal.fire(
            'Éxito!',
            'Herrmann V2 Seleccionado con éxito',
            'success'
        ).then( () => {location.href="http://localhost:8000/scenario/adaptive_test.0/studio_analytics/";})
    }

    var handlerUrl = runtime.handlerUrl(element, 'select_test');

    // Reads chosen test index and sends it to python script
    $('#Escoger', element).click(function (eventObject){
        var index = $("#select-test")[0].selectedIndex;
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: (String) (index + 1), // 1: Kolb, 2: Dominancia
            dataType: 'json',
            success: showTestAlert(index)
        });
    });
}   
