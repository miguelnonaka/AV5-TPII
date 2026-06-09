import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";

export default class DeletarAcomodacao extends Processo {

    processar(): void {

        const armazem = Armazem.InstanciaUnica

        const documentoDependente = this.entrada.receberTexto(
            "Informe o documento do dependente:"
        )

        const dependente = armazem.Clientes.find(cliente =>
            cliente.Documentos.some(doc => doc.Numero === documentoDependente)
        )

        if (!dependente) {
            console.log("Dependente não encontrado")
            return
        }

        if (!dependente.Titular) {
            console.log("Este cliente não possui titular")
            return
        }

        const titular = dependente.Titular

        if (!titular.Acomodacao) {
            console.log("O titular não possui acomodação vinculada")
            return
        }

        titular.Acomodacao = undefined
        
        console.clear()
        console.log("Exclusão de acomodação concluida.")
        console.log(`Acomodação do titular ${titular.Nome} removida com sucesso`)

    }
}