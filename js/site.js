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
    LoadDatabase();
    AplicarSelect2();
});

//#region [Controle]
//select2
function AplicarSelect2() {
    $('.select2')
        .select2({
            placeholder: "Type",
            with: "300px",
        });
}
//#endregion


//#region [Armazenar dados no navegador]

// GravarDados
function SetDatabase(data) {
    localStorage.setItem('base', JSON.stringify(data));
}

// CarregarDados
function LoadDatabase() {
    if (localStorage.getItem('base') != null) {

        var auxDados = JSON.parse(localStorage.getItem('base'));
        
        var ddlCampos = document.getElementById('ddlCampos');
        for (let i = 0; i < auxDados[0].length; i++) {
            ddlCampos.innerHTML += '<option value="' + i + '" selected>' + auxDados[0][i] + '</option>';
        }

        var ddlMesclagem = document.getElementById('ddlMesclagem');
        for (let i = 0; i < auxDados[0].length; i++) {
            ddlMesclagem.innerHTML += '<option value="' + i + '">' + auxDados[0][i] + '</option>';
        }

        var ddlSoma = document.getElementById('ddlSoma');
        for (let i = 0; i < auxDados[0].length; i++) {
            ddlSoma.innerHTML += '<option value="' + i + '">' + auxDados[0][i] + '</option>';
        }

        var ddlTotaisMesclagem = document.getElementById('ddlTotaisMesclagem');
        for (let i = 0; i < auxDados[0].length; i++) {
            ddlTotaisMesclagem.innerHTML += '<option value="' + i + '">' + auxDados[0][i] + '</option>';
        }
        
        return auxDados;
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
    var dados = JSON.parse(localStorage.getItem('base'));

    if(dados != null){

        var result = '<table class="table" style="border: 1px solid black;"><thead><tr style="background-color:' + document.getElementById('colorCabecalhoBackground').value + ';color:' + document.getElementById('colorCabecalhoFonte').value + '">';
        
        var auxCamposExibir = $('#ddlCampos').select2('data').map(i => i.id);

        for (let i = 0; i < auxCamposExibir.length; i++) {
            result += '<th scope="col">' + dados[0][auxCamposExibir[i]] + '</th>';
        }

        result += '</tr></thead>';
        result += SepararTabela();

        document.getElementById("divResult").innerHTML = result
    }
}

// Retorna uma tabela para separar as tabelas 
function SepararTabela() {
    return '<table><tbody><tr><th></th><td></td><td></td><td></td></tr><tr><th></th><td></td><td></td><td></td></tr></tbody></table>';
} 






