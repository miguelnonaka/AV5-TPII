export interface CriarAcomodacaoDTO {
    nome: string
    camaSolteiro: number
    camaCasal: number
    suite: number
    climatizacao: boolean
    garagem: number
}

export interface AtualizarAcomodacaoDTO {
    nome?: string
    camaSolteiro?: number
    camaCasal?: number
    suite?: number
    climatizacao?: boolean
    garagem?: number
}

export interface VincularAcomodacaoDTO {
    titularId: number
    acomodacaoId: number
    incluirTitular?: boolean
    dependenteIds?: number[]
}
