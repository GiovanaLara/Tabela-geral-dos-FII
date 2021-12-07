let fii_user = [];
let fii_table = [];
let gifCarregamento = document.getElementById("loading")
let tabela = document.getElementById("tabela")
async function carregarDadosUser(url) {
    await fetch(url)
        .then(resp => resp.json())
        .then(json => fii_user = json);
    carregarDadosFundos();
}

async function carregarDadosFundos() {
    for (let item of fii_user) {
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${item.nome} `)
            .then(resp => resp.json());
        fii_table.push(json);
    }
    exibirTabela();
}

carregarDadosUser("json/fii.json");

function Loading() {
    let timer = setInterval(() => {
        if (fii_table.length == fii_user.length) {
            console.log("Carregou tudo")
            gifCarregamento.style.display = "none"
            clearInterval(timer)
        } else {
            console.log(fii_table.length)
        }
    }, 1000);
}
Loading()
function exibirTabela() {
    let totalGeral = 0;
    let geralCotas = 0;
    let totalGeralInvestido = 0;
    fii_table.forEach(item => {
        let fundo;
        let pagamento = item.proximoRendimento.cotaBase = '-' ? item.ultimoRendimento : item.proximoRendimento
        let valorPagamento = item.proximoRendimento.rendimento == '-' ? item.ultimoRendimento.rendimento : item.proximoRendimento.rendimento
        let percentualRendimento = valorPagamento * 100 / item.valorPatrimonioPCota
        let totalCotas;
        let totalInvestido;
        fii_user.forEach(user => {
            if (item.fundo.indexOf(user.nome.toUpperCase()) >= 0) {
                console.log(user)
                fundo = user.nome.toUpperCase()
                totalCotas = user.qtde
                totalInvestido = user.totalgasto
            }
        });
        let precoMedio = totalInvestido / totalCotas;
        let tr = document.createElement("tr")

        tr.innerHTML = `
            <td>${fundo}</td>                    
            <td>${item.setor}</td>                    
            <td>${pagamento.dataBase}</td>
            <td>${pagamento.dataPag}</td>
            <td>R$ ${valorPagamento}</td>
            <td>R$ ${item.valorAtual}</td>
            <td>${totalCotas}</td>
            <td>R$ ${totalInvestido}</td>
            <td>R$ ${precoMedio.toFixed(2)}</td>                                
            <td>${percentualRendimento.toFixed(2)}%</td>                                
            <td>${item.dividendYield}%</td>                                
            <td>R$ ${item.rendimentoMedio24M.toFixed(2)}</td>   
        `
        if (percentualRendimento >= 0.60) {
            tr.className = "positivo"
        } else {
            tr.className = "negativo"
        }
        tabela.appendChild(tr)
        totalGeral += (totalCotas * valorPagamento)
        geralCotas += totalCotas
        totalGeralInvestido += totalInvestido
    });
    let final = document.createElement("tr")
    final.innerHTML = `
    <td></td>                    
    <td></td>                    
    <td>Total Geral</td>   
    <td></td>                    
    <td>R$ ${totalGeral.toFixed(2)}</td>   
    <td></td>                    
    <td>${geralCotas}</td>                    
    <td>R$ ${totalGeralInvestido.toFixed(2)}</td>                    
    <td></td>                    
    <td></td>                    
    <td></td>                    
    <td></td>                    
    `
    final.className = "fundo_total"
    tabela.appendChild(final)
}
    