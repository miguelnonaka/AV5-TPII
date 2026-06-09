export type TipoDocumentoApi = "CPF" | "RG" | "Passaporte";

export type EnderecoInput = {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    codigoPostal: string;
};

export type TelefoneInput = {
    ddd: string;
    numero: string;
};

export type DocumentoInput = {
    numero: string;
    tipo: TipoDocumentoApi;
    dataExpedicao: string;
};

export type ClienteInput = {
    nome: string;
    nomeSocial: string;
    dataNascimento: string;
    depende?: boolean;
    titularId?: number | null;
    endereco?: EnderecoInput;
    telefones?: TelefoneInput[];
    documentos?: DocumentoInput[];
};
