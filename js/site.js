$(document).ready(function() {
    CriarBancoDados();

    // Carregar os CSV
    const myForm = document.getElementById("formCarregarCSV");
    const csvFile = document.getElementById("fileCarregarCSV");

    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = csvFile.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target.result;
            var auxSplitLine = text.split("\n");

            var auxTitles = FormatarString(auxSplitLine[0]).split(";");
            var auxSegundaLinha = auxSplitLine[1].split(";");

            var ddlCampos = document.getElementById('ddlCampos');
            for (let i = 0; i < auxTitles.length; i++) {
                ddlCampos.innerHTML += '<option value="' + i + '" selected>' + auxTitles[i] + '</option>';
            }
    
            var ddlMesclagem = document.getElementById('ddlMesclagem');
            for (let i = 0; i < auxTitles.length; i++) {
                ddlMesclagem.innerHTML += '<option value="' + i + '">' + auxTitles[i] + '</option>';
            }
    
            var ddlSoma = document.getElementById('ddlSoma');
            for (let i = 0; i < auxTitles.length; i++) {
                ddlSoma.innerHTML += '<option value="' + i + '">' + auxTitles[i] + '</option>';
            }
    
            var ddlTotaisMesclagem = document.getElementById('ddlTotaisMesclagem');
            for (let i = 0; i < auxTitles.length; i++) {
                ddlTotaisMesclagem.innerHTML += '<option value="' + i + '">' + auxTitles[i] + '</option>';
            }

            //Criar banco
            var db = CriarBancoDados();
    
            //Cria tabelas
            db.transaction(function(transaction){
                // criar a tabela
                var sqlCreate = "CREATE TABLE itens (id INTEGER PRIMARY KEY";
                var auxItem = {};
                for (let i = 0; i < auxTitles.length; i++) {
                    if(isNaN(parseFloat(auxSegundaLinha[i]))){
                        sqlCreate += ', ' + auxTitles[i] + ' VARCHAR';
                    }else{
                        sqlCreate += ', ' + auxTitles[i] + ' DECIMAL(10,2)';
                        //sqlCreate += ', ' + auxTitles[i] + ' REAL';
                    }
                }
                sqlCreate += ")";

                transaction.executeSql(
                    sqlCreate, 
                    null,
                    null,
                    // callback de erro, função anônima que recebe um objeto SQLTransaction e um SQLError
                    function(transaction, error){
                        console.log('deu pau!');
                        console.log(error);
                    });

                var sqlInsert = "INSERT INTO itens (" + auxTitles[0];
                for (let i = 1; i < auxTitles.length; i++) {
                    sqlInsert += ',' + auxTitles[i];
                }
                sqlInsert += ") values (?";
                for (let i = 1; i < auxTitles.length; i++) {
                    sqlInsert += ', ?';
                }
                sqlInsert += ")";

                var dados = [];
                for (let row = 1; row < auxSplitLine.length; row++) {
                    var auxSplitCol = auxSplitLine[row].split(";");
                    if(auxSplitCol.length > 1){
                        transaction.executeSql(
                            sqlInsert, 
                            auxSplitCol,
                            null,
                            // callback de erro, função anônima que recebe um objeto SQLTransaction e um SQLError
                            function(transaction, error){
                                console.log('deu pau!');
                                console.log(error);
                            });
                    }
                }
            });
        };
        reader.readAsText(input);
    });

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

function CarregarBancoDados() {
    var nome = 'local';
    var versao = '1.0';
    var descricao = 'Web SQL Database';
    var tamanho = 200000;

    return openDatabase(nome, versao, descricao, tamanho);
}

function CriarBancoDados() {
    var db = CarregarBancoDados();

    console.log(db);//Exibir o nome do banco no console

    if(!db){
        alert('Problema ao criar uma instancia');//Erro
        return;
    }

    // o método transaction aceita uma função anônima que recebe um objeto SQLTransaction como parâmetro
    db.transaction(function(transaction){
        transaction.executeSql(
            "DROP TABLE itens", 
            null, 
            null,
            // callback de erro, função anônima que recebe um objeto SQLTransaction e um SQLError
            function(transaction, error){
                console.log('deu pau!');
                console.log(error);
            });
    });

    return db;
}


function FormatarString(str) {
    return str
        .replace('\n','')
        .replace('\r','')
        .replace(/\s/g, '')
        .replace('(','')
        .replace(')','')
        .toLowerCase();
}

// Retorna uma tabela para separar as tabelas 
function SepararTabela() {
    return '<table><tbody><tr><th></th><td></td><td></td><td></td></tr><tr><th></th><td></td><td></td><td></td></tr></tbody></table>';
} 
//#endregion

function AtualizarModelo(){

    document.getElementById("divResult").innerHTML = '';

    var db = CarregarBancoDados();

    if(db != null){

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT proposta FROM itens GROUP BY proposta",
                null,
                function(transaction, result){
                    for(var i = 0; i < result.rows.length; i++){
                        var sqlBuscaProposta = "SELECT * FROM (SELECT ite.proposta proposta, ite.tipodeprofissional tipo_proposta, ROUND(sum(ite.tempodecimal),2) tempo, ROUND(sum(ite.valortotal),2) valor_total, ite.cap cap FROM itens ite WHERE ite.proposta = '" + result.rows[i]['proposta'] + "' GROUP BY ite.proposta, ite.tipodeprofissional UNION  SELECT  ite.proposta proposta, 'Total Geral' ite, ROUND(sum(ite.tempodecimal),2) tempo, ROUND(sum(ite.valortotal),2) valor_total, ite.cap cap FROM itens ite WHERE ite.proposta = '" + result.rows[i]['proposta'] + "' GROUP BY ite.proposta ) rs ORDER BY rs.proposta, rs.tipo_proposta";
                        transaction.executeSql(
                            sqlBuscaProposta,
                            null,
                            function(transaction, result){
                                var resultTable = '';

                                resultTable += '<table class="table" style="border: 1px solid black;">'; 
                                resultTable += '<thead><tr style="background-color:' + document.getElementById('colorCabecalhoBackground').value + ';color:' + document.getElementById('colorCabecalhoFonte').value + '">';
                                resultTable += '<th scope="col">Proposta</th>';
                                resultTable += '<th scope="col">Tipo de profissional</th>';
                                resultTable += '<th scope="col">Total Tempo (decimal)</th>';
                                resultTable += '<th scope="col">Valor total</th>';
                                resultTable += '<th scope="col">CAP</th>';
                                resultTable += '</tr></thead><tbody>';

                                for(var i = 0; i < result.rows.length; i++){
                                    
                                    resultTable += '<tr>';
                                    if(i == 0){
                                        resultTable += '<td rowspan="' + result.rows.length + '">' + result.rows[i]['proposta'] + '</td>';
                                        resultTable += '<td>' + result.rows[i]['tipo_proposta'] + '</td>';
                                        resultTable += '<td>' + parseFloat(result.rows[i]['tempo']).toFixed(2) + '</td>';
                                        resultTable += '<td>R$ ' + parseFloat(result.rows[i]['valor_total']).toFixed(2) + '</td>';
                                        resultTable += '<td rowspan="' + result.rows.length + '">R$ ' + result.rows[i]['cap'] + '</td>';
                                    }else{
                                        //resultTable += '<td></td>';
                                        resultTable += '<td>' + result.rows[i]['tipo_proposta'] + '</td>';
                                        resultTable += '<td>' + parseFloat(result.rows[i]['tempo']).toFixed(2) + '</td>';
                                        resultTable += '<td>R$ ' + parseFloat(result.rows[i]['valor_total']).toFixed(2) + '</td>';
                                        //resultTable += '<td></td>';
                                    }
                                    resultTable += '</tr>';

                                }

                                resultTable += '</tbody></table>';
                                resultTable += SepararTabela();

                                document.getElementById("divResult").innerHTML += resultTable;
                            },
                            function(transaction, error){
                                console.log('deu pau!');
                                console.log(error);
                            }
                        );
                    }
                },
                function(transaction, error){
                    console.log('deu pau!');
                    console.log(error);
                }
            );

            return;
        });
        
    }
}
