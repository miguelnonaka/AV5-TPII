export interface TelefoneDTO {
    ddd: string
    numero: string
}

export interface EnderecoDTO {
    rua: string
    bairro: string
    cidade: string
    estado: string
    pais: string
    codigoPostal: string
}

export interface DocumentoDTO {
    numero: string
    tipo: string
    dataExpedicao: string
}

export interface CriarClienteDTO {
    nome: string
    nomeSocial: string
    dataNascimento: string

    endereco?: EnderecoDTO

    telefones?: TelefoneDTO[]

    documentos: DocumentoDTO[]
}

export interface AtualizarClienteDTO {
    nome?: string
    nomeSocial?: string
    dataNascimento?: string
    endereco?: EnderecoDTO
    telefones?: TelefoneDTO[]
    documentos?: DocumentoDTO[]
}

export interface CriarDependenteDTO extends CriarClienteDTO {
    endereco?: EnderecoDTO
    telefones?: TelefoneDTO[]
}
