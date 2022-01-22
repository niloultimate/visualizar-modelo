$(document).ready(function() {
    // Carregar os CSV
    const myForm = document.getElementById("formCarregarCSV");
    const csvFile = document.getElementById("fileCarregarCSV");

    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = csvFile.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target.result;
            var auxSplitLine = text.split("\n")
            var auxMatriz = [];
            for (let i = 0; i < auxSplitLine.length; i++) {
                auxMatriz.push(auxSplitLine[i].split(";"));
            }
            SetDatabase(auxMatriz);
            AtualizarModelo();
        };
        reader.readAsText(input);
    });
});

//#region [Armazenar dados no navegador]

// GravarDados
function SetDatabase(data) {
    localStorage.setItem('base', JSON.stringify(data));
}

// CarregarDados
function LoadDatabase() {
    if (localStorage.getItem('base') != null) {
        return JSON.parse(localStorage.getItem('base'));
    }else{
        alert('Nenhum dado, carrege o CSV');
        return null;
    }
}

// LimparDados
function ClearDatabase() {
    localStorage.setItem('base', null);
}
//#endregion

// Botao para atualizar modelo
function AtualizarModelo(){
    var dados = LoadDatabase();

    if(dados != null){

        var result = '<table class="table"><thead style="background-color:' + document.getElementById('colorCabecalhoBackground').value + ';color:' + document.getElementById('colorCabecalhoFonte').value + '"><tr>';
        
        for (let col = 0; col < dados[0].length; col++) {
            result += '<th scope="col">' + dados[0][col] + '</th>';
        }

        result += '</tr></thead>';
        result += SepararTabela();

        console.log(dados[0]);

        document.getElementById("divResult").innerHTML = result
    }
}

// Retorna uma tabela para separar as tabelas 
function SepararTabela() {
    return '<table><tbody><tr><th></th><td></td><td></td><td></td></tr><tr><th></th><td></td><td></td><td></td></tr></tbody></table>';
} 






