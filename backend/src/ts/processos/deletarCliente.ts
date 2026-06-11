import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";

export default class DeletarCliente extends Processo {
    processar(): void {
        let armazem = Armazem.InstanciaUnica
        console.log('Iniciando remoção de cliente...')

        let documento = this.entrada.receberTexto('Informe o documento do cliente:')

        let cliente = armazem.Clientes.find(c =>
            c.Documentos.some(doc => doc.Numero === documento)
        )

        if (!cliente) {
            console.log('Cliente não encontrado')
            return
        }

        if (cliente.Titular) {
            let titular = cliente.Titular

            titular.Dependentes = titular.Dependentes.filter(d => d !== cliente)
        }

        if (!cliente.Titular) {
            cliente.Dependentes.forEach(dep => {
                dep.Titular = undefined as any
            })
        }

        armazem.Clientes = armazem.Clientes.filter(c => c !== cliente)

        console.log('Cliente removido com sucesso')
    }
}