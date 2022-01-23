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

        var result = '';
        
        var auxCamposExibir = $('#ddlCampos').select2('data').map(i => i.id);
        var auxMesclagem = $('#ddlMesclagem').select2('data').map(i => i.id);

        var auxListaMesclagem = [];
        for (let i = 0; i < auxMesclagem.length; i++) {
            auxListaMesclagem.push([]); 
        }
  
        //Pegar tipo de lista mesclagem
        for (let row = 1; row < dados.length; row++) {
            var auxAdd = [];

            for (let i = 0; i < auxMesclagem.length; i++) {
                auxAdd.push(true);
            }

            for (let auxI = 0; auxI < auxAdd.length; auxI++) {
                for (let i = 0; i < auxListaMesclagem[auxI].length; i++) {
                    if(auxListaMesclagem[auxI][i] == dados[row][auxMesclagem[auxI]] 
                        | dados[row][auxMesclagem[auxI]] == '' 
                        | dados[row][auxMesclagem[auxI]] == undefined){
                        auxAdd[auxI] = false;
                    }
                }
            }

            for (let auxI = 0; auxI < auxAdd.length; auxI++) {
                if(auxAdd[auxI]){
                    auxListaMesclagem[auxI].push(dados[row][auxMesclagem[auxI]]);
                }
            }
        }
        
        if(auxListaMesclagem.length <= 0){
            alert('Selecione dois tipos de mesclagem');
            return;
        }

        //Montar tabela
        for (let i = 0; i < auxListaMesclagem[0].length; i++) {

            //Montar cabeçalho
            result += '<table class="table" style="border: 1px solid black;">'; 
            result += '<thead><tr style="background-color:' + document.getElementById('colorCabecalhoBackground').value + ';color:' + document.getElementById('colorCabecalhoFonte').value + '">';
            for (let i = 0; i < auxCamposExibir.length; i++) {
                result += '<th scope="col">' + dados[0][auxCamposExibir[i]] + '</th>';
            }
            result += '</tr></thead><tbody>';

            var auxPrimeiraLinha = '';
            var auxLinha = '';
            var auxLinhaIncluida = new Object();
            for (let row = 1; row < dados.length; row++) {
                if(auxListaMesclagem[0][i] == dados[row][0]){
                    var auxIncluir = false;
                    for (let mesc = 1; mesc < auxListaMesclagem.length; mesc++) {
                        for (let mescCol = 0; mescCol < auxListaMesclagem[mesc].length; mescCol++) {
                            if(auxListaMesclagem[mesc][mescCol] == dados[row][auxMesclagem[mesc]]){
                                var auxSubIncluir = true;
                                if(mesc in auxLinhaIncluida){
                                    if(mescCol in auxLinhaIncluida[mesc]){
                                        auxSubIncluir = false;
                                    }else{
                                        auxLinhaIncluida[mesc][mescCol] = false;
                                    }
                                }else{
                                    auxLinhaIncluida[mesc] = {};
                                    auxLinhaIncluida[mesc][mescCol] = false;
                                }
                                if(auxSubIncluir){
                                    auxIncluir = true;
                                    mescCol = auxListaMesclagem[mesc].length;
                                }
                            }
                        }
                        if(auxIncluir){ mesc = auxListaMesclagem.length }
                    }
                    if(auxIncluir){
                        if(auxPrimeiraLinha == ''){
                            auxPrimeiraLinha += '<tr>';
                            for (let col = 0; col < auxCamposExibir.length; col++) {
                                auxPrimeiraLinha += '<td>' + dados[row][auxCamposExibir[col]] + '</td>';
                            }
                            auxPrimeiraLinha += '</tr>';
                        }else{
                            auxLinha += '<tr>';
                            for (let col = 0; col < auxCamposExibir.length; col++) {
                                auxLinha += '<td>' + dados[row][auxCamposExibir[col]] + '</td>';
                            }
                            auxLinha += '</tr>';
                        }
                    }
                }
            }
            console.log(auxLinhaIncluida);
            
            result += auxPrimeiraLinha + auxLinha;
            result += '</tbody>';
            result += '</table>';
            
            result += SepararTabela();
        }

        result += SepararTabela();

        document.getElementById("divResult").innerHTML = result
    }
}

// Retorna uma tabela para separar as tabelas 
function SepararTabela() {
    return '<table><tbody><tr><th></th><td></td><td></td><td></td></tr><tr><th></th><td></td><td></td><td></td></tr></tbody></table>';
} 






