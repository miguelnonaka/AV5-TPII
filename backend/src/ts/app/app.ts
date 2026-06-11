import Processo from "../abstracoes/processo";
import CadastroAcomodacoes from "../processos/cadastroAcomodacoes";
import Principal from "../processos/principal";

import Armazem from "../dominio/armazem";

import Cliente from "../modelos/cliente";
import Documento from "../modelos/documento";
import Endereco from "../modelos/endereco";
import Telefone from "../modelos/telefone";

import { TipoDocumento } from "../enumeracoes/TipoDocumento";

console.clear()

console.log(`Bem-vindo(a) ao melhor sistema de gestão de clubes, hotéis e resorts do mundo, o Atlantis :)`);

let processo: Processo
let execucao: Boolean = true

processo = new CadastroAcomodacoes()
processo.processar()

const armazem = Armazem.InstanciaUnica

const titular = new Cliente(
    "Miguel",
    "Tomo",
    new Date(2007, 5, 18),
    false
)

titular.Endereco = new Endereco(
    "Rua das Flores",
    "Centro",
    "São José dos Campos",
    "São Paulo",
    "Brasil",
    "12200-000"
)

titular.Telefones = [
    new Telefone("12", "99999-1111")
]

titular.Documentos = [
    new Documento(
        "12345678900",
        TipoDocumento.CPF,
        new Date(2020, 1, 10)
    ),

    new Documento(
        "55443322",
        TipoDocumento.RG,
        new Date(2019, 3, 5)
    )
]


const dependente1 = new Cliente(
    "Yuki",
    "Yuki",
    new Date(2012, 7, 12),
    true
)

dependente1.Titular = titular

dependente1.Documentos = [
    new Documento(
        "11122233344",
        TipoDocumento.CPF,
        new Date(2022, 6, 15)
    )
]

dependente1.Endereco = titular.Endereco.clonar() as Endereco

const dependente2 = new Cliente(
    "Akira",
    "Aki",
    new Date(2015, 2, 22),
    true
)

dependente2.Titular = titular

dependente2.Documentos = [
    new Documento(
        "55566677788",
        TipoDocumento.CPF,
        new Date(2023, 4, 18)
    )
]

dependente2.Endereco = titular.Endereco.clonar() as Endereco

titular.Dependentes = [
    dependente1,
    dependente2
]


const cliente2 = new Cliente(
    "Renato",
    "Ren",
    new Date(1998, 10, 9),
    false
)

cliente2.Endereco = new Endereco(
    "Av. Brasil",
    "Jardim América",
    "São Paulo",
    "São Paulo",
    "Brasil",
    "01000-000"
)

cliente2.Telefones = [
    new Telefone("11", "98888-7777")
]

cliente2.Documentos = [
    new Documento(
        "99988877766",
        TipoDocumento.CPF,
        new Date(2018, 8, 25)
    )
]


armazem.Clientes.push(titular)
armazem.Clientes.push(dependente1)
armazem.Clientes.push(dependente2)
armazem.Clientes.push(cliente2)


while (execucao) {
    processo = new Principal()
    processo.processar()
    execucao = processo.Execucao
}