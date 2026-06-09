import Processo from "../abstracoes/processo";
import MenuTipoEditarCliente from "../menus/menuTipoEditarClientes";
import editarDependente from "./editarClienteDependente";
import editarTitular from "./editarClienteTitular"

export default class TipEditarCliente extends Processo {
    constructor() {
        super()
        this.menu = new MenuTipoEditarCliente()
    }
    processar(): void {
        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        
        switch (this.opcao) {
            case 1:
                this.processo = new editarTitular()
                this.processo.processar()
                break
            case 2:
                this.processo = new editarDependente()
                this.processo.processar()
                break
            default:
                console.log('Opção não entendida :(')
        }
    }
}