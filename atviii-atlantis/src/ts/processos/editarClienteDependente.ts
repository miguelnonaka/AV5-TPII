import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Telefone from "../modelos/telefone";
import CadastrarDocumentosCliente from "./cadastrarDocumentosCliente";
import CadastroEnderecoTitular from "./cadastroEnderecoTitular";

export default class EditarDependente extends Processo {
    processar(): void {
        let armazem = Armazem.InstanciaUnica
        console.log('Iniciando edição de dependente...')

        let documento = this.entrada.receberTexto('Informe o documento do dependente:')
        let cliente = armazem.Clientes.find(c =>
            c.Documentos.some(doc => doc.Numero === documento)
        )


        if (!cliente) {
            console.log('Cliente não encontrado')
            return
        }

        if (cliente.Depende == false) {
            console.log('Este cliente não é dependente')
            return
        }

        let opcao: number

        do {
            console.clear()
            console.log(`Editando dependente: ${cliente.Nome}\n`)
            console.log('1 - Nome')
            console.log('2 - Nome Social')
            console.log('3 - Data de Nascimento')
            console.log('4 - Endereço')
            console.log('5 - Documentos')
            console.log('6 - Telefones')
            console.log('0 - Sair\n')

            opcao = this.entrada.receberNumero('Escolha uma opção:')

            switch (opcao) {
                case 1:
                    cliente.Nome = this.entrada.receberTexto('Novo nome:')
                    console.log('Nome atualizado')
                    break

                case 2:
                    cliente.NomeSocial = this.entrada.receberTexto('Novo nome social:')
                    console.log('Nome social atualizado')
                    break

                case 3:
                    cliente.DataNascimento = this.entrada.receberData('Nova data:')
                    console.log('Data atualizada')
                    break

                case 4:
                    this.processo = new CadastroEnderecoTitular(cliente)
                    this.processo.processar()
                    break

                case 5:
                    this.processo = new CadastrarDocumentosCliente(cliente)
                    this.processo.processar()
                    break

                case 6:
                    if (!cliente.Titular) {
                        console.log('Dependente sem titular definido')
                        break
                    }

                    if (cliente.Titular.Telefones.length === 0) {
                        console.log('Titular não possui telefones')
                        break
                    }

                    cliente.Telefones = cliente.Titular.Telefones.map(t => t.clonar() as Telefone)

                    console.log('Telefones atualizados com base no titular')
                    break

                case 0:
                    break

                default:
                    console.log('Opção inválida')
            }

            if (opcao !== 0) {
                this.entrada.receberTexto('Pressione ENTER para continuar...')
            }

        } while (opcao !== 0)

        console.log('Finalizando edição do dependente...')
    }
}