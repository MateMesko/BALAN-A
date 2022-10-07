var printValue
var valueGlobal
var validade=[]
const inputValidity=document.querySelector("#inputValidity")
let falseInput=document.getElementById('falseButton')
let realButton=document.getElementById('txtFileUpload')

falseInput.addEventListener('click',()=>{
    realButton.click()
})

$(document).ready(function() {
    // The event listener for the file upload
    document.getElementById('txtFileUpload').addEventListener('change', upload, false);
    // Method that checks that the browser supports the HTML5 File API
    function browserSupportFileUpload() {
        var isCompatible = false;
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            isCompatible = true;
        }

        return isCompatible;
    }

    // Method that reads and processes the selected file

    function upload(evt) {

        if (!browserSupportFileUpload()) {
            alert('The File APIs are not fully supported in this browser!');
        }
            
        else {

            var data = null;
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);

            reader.onload = function(event){

                var csvData = event.target.result;
                data = $.csv.toArrays(csvData);

                if (data && data.length > 0) {
                //alert('Imported -' + data.length + '- rows successfully!');
                valueGlobal=data

                checkData(data);
                }

                else {
                    alert('No data to import!');
                }
            };

            reader.onerror = function(){
                alert('Unable to read ' + file.fileName);
            };
        }
    }

    function checkData(dataReceived){
        createTable(dataReceived);
    }

});
    function convertValue(dataReceived){

        var valor=''
        var codigo=''
        var codigobase=''
        var produto=''
        var produtobase=''
        var preco=''
        var precobase=''
        var valorfinal=''
        var f=''
        var valitIndex=0
        var g=0
        var letterIndex=0
        var productIndex=0
        var finalValitValue=[]
        var finalValue=[]
        var mgvKilograma=''
        var cdcKilograma=''

        for(var columnIndex in dataReceived)
        {   
            for(var lineIndex in dataReceived[columnIndex])
            {
                if(columnIndex!=0){
                    if(lineIndex==0){

                        codigobase=dataReceived[columnIndex][lineIndex]
                        codigo=codigobase

                        for(f=codigobase;codigo.length<6;f++){
                            codigo=`0${codigo}`
                        }
                        f=''
                    }

                    if(lineIndex==1){

                        produto=dataReceived[columnIndex][lineIndex]
                        produtobase=''

                        for(letterIndex=0;letterIndex<produto.length;letterIndex++){
                            produtobase=`${produtobase}${produto[letterIndex]}`
                            produtobase=produtobase.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

                            if(letterIndex==49){
                                letterIndex=produto.length
                            }
                        }
                        
                        for(productIndex=produtobase.length;productIndex<50;productIndex++){
                            produtobase=`${produtobase} `
                        }
                    }

                    if(lineIndex==2){
                        precobase=0
                        preco=''
                        precobase=dataReceived[columnIndex][lineIndex]
                        //preco=precobase
                        for(g=0;g<precobase.length;g++){
                            if(precobase[g]!=',')
                            {
                                preco=`${preco}${precobase[g]}`
                            }
                        }

                        for(f=precobase;preco.length<6;f++){
                            preco=`0${preco}`
                        }
                    }

                    if(lineIndex==3){
                        finalValue[columnIndex]=document.querySelector(`#valueItenInput${columnIndex}`)

                        finalValitValue[columnIndex]=''
                        for(valitIndex=0;valitIndex<3;valitIndex++){
                            if(finalValue[columnIndex].value[valitIndex]==undefined)
                                finalValitValue[columnIndex]=`0`+`${finalValitValue[columnIndex]}`
                            else
                                finalValitValue[columnIndex]=`${finalValitValue[columnIndex]}`+`${finalValue[columnIndex].value[valitIndex]}`
                
                        
                        }

                        if(dataReceived[columnIndex][lineIndex]=='Kilograma'){
                            mgvKilograma='0'           //DDT  CCCCCC  PPPPPP VVV D1D2         RRRRRRFFFFIIIIIIVECFCFLLLLLLLLLLLLGGGGGGGGGGGZCSCSCTCTFRFRCE11CE22CONNEANEANEANEANGL|DA|D3D4CE3CE4MIDIA
                            cdcKilograma='P'
                        }

                        else{
                            mgvKilograma='1'
                            cdcKilograma='U'
                        }


                        if(window.location.pathname=='/mgv.html')
                        {
                        valor=valor+`01${mgvKilograma}${codigo}${preco}${finalValitValue[columnIndex]}${produtobase}0000000000000000110000000000000000000000000001000000000000000000000000000000000000000000|01|                                                                      0000000000000000000000000||0||
`                 
}          
                        else{
                            valor=valor+`${codigo}${cdcKilograma}${produtobase}${preco}${finalValitValue[columnIndex]}
`
                        }
                        
                    }      
                }
            }
        }

        this.printValue=valor 
    }

    function baixar(){
        convertValue(valueGlobal)
        console.log(valueGlobal)

        let blob = new Blob([this.printValue], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `ITENSMGV`+ ".txt");
    }

    function updateValueInputs(){
        var finalValue=[]

        for(var columnIndex in valueGlobal){
            if(columnIndex>0)
            {
                finalValue[columnIndex]=document.querySelector(`#valueItenInput${columnIndex}`)
                finalValue[columnIndex].value=inputValidity.value
            }
        }
       
    }
    function createTable(tableData) {
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        var indice=0
        var indiceUnidade=0

        tableData.forEach(function(rowData) {
            var row = document.createElement('tr');
            indiceUnidade=0
            rowData.forEach(function(cellData) {
            indiceUnidade++
            
            var cell = document.createElement('td');
            if(indiceUnidade==4){

                if(cellData=='Kilograma')
                {

                    cell.setAttribute("class",`kilo`)
                }
                else if(cellData!='Nome')
                {
                    
                    cell.setAttribute("class",`unidade`)
                }
            }
            cell.appendChild(document.createTextNode(cellData));
            
            row.appendChild(cell);
          });
          
        if(indice==0){
            validade=inputValidity.value
            var spanItem = document.createElement('td');
            spanItem.appendChild(document.createTextNode('Validade:'));
            row.appendChild(spanItem);
        }

        else{
            var inputItem = document.createElement('input');
            inputItem.setAttribute("id",`valueItenInput${indice}`)
            inputItem.setAttribute("value",`${validade}`)
            inputItem.setAttribute("class",`inputValue`)
            inputItem.setAttribute("maxlength",`3`)
            inputItem.setAttribute("onkeypress",`if (!isNaN(String.fromCharCode(window.event.keyCode))) return true; else return false;`)
            inputItem.appendChild(document.createTextNode('OK'));
            row.appendChild(inputItem);
        }

        indice++
        tableBody.appendChild(row);
  });  
  table.appendChild(tableBody);
  document.body.appendChild(table);
  
}