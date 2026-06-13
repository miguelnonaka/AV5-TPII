export interface CriarTelefoneDTO {
    ddd: string
    numero: string
    clienteId: number
}

export interface AtualizarTelefoneDTO {
    ddd?: string
    numero?: string
}

export interface CriarEnderecoDTO {
    rua: string
    bairro: string
    cidade: string
    estado: string
    pais: string
    codigoPostal: string
    clienteId: number
}

export interface AtualizarEnderecoDTO {
    rua?: string
    bairro?: string
    cidade?: string
    estado?: string
    pais?: string
    codigoPostal?: string
}

export interface CriarDocumentoDTO {
    numero: string
    tipo: string
    dataExpedicao: string
    clienteId: number
}

export interface AtualizarDocumentoDTO {
    numero?: string
    tipo?: string
    dataExpedicao?: string
}
