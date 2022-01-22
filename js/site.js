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
    localStorage.setItem('base', data);
}

// CarregarDados
function LoadDatabase() {
    if (localStorage.getItem('base') != null) {
        return localStorage.getItem('base');
    }else{
        alert('Nenhum dado, carrege o CSV')
    }
}

// LimparDados
function ClearDatabase() {
    localStorage.setItem('base', null);
}
//#endregion

// Botao para atualizar modelo
function AtualizarModelo(){

    


    document.getElementById("divResult").innerHTML = SepararTabela();
}

// Retorna uma tabela para separar as tabelas 
function SepararTabela() {
    return '<table><tbody><tr><th></th><td></td><td></td><td></td></tr><tr><th></th><td></td><td></td><td></td></tr></tbody></table>';
} 






