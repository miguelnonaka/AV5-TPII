import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";

export default class ListarAcomodacao extends Processo {

    processar(): void {
        console.clear()
        console.log("Lista de acomodações\n")

        const armazem = Armazem.InstanciaUnica

        if (armazem.Acomodacoes.length === 0) {
            console.log("Nenhuma acomodação cadastrada")
            return
        }

        armazem.Acomodacoes.forEach((acomodacao, indice) => {
            console.log(`${indice + 1}. ${acomodacao.NomeAcomadacao}`)
        })
    }
}