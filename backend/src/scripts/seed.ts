import "dotenv/config";
import { prisma } from "../prisma/client";
import { AcomodacaoService } from "../services/AcomodacaoService";

type TitularSeed = {
    nome: string;
    nomeSocial: string;
    dataNascimento: string;
    documento: string;
    tipoDocumento: string;
    dataExpedicao: string;
    telefone: {
        ddd: string;
        numero: string;
    };
    endereco: {
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
        pais: string;
        codigoPostal: string;
    };
};

type DependenteSeed = {
    nome: string;
    nomeSocial: string;
    dataNascimento: string;
    documento: string;
    tipoDocumento: string;
    dataExpedicao: string;
};

const titulares: TitularSeed[] = [
    {
        nome: "Marina Costa",
        nomeSocial: "Marina Costa",
        dataNascimento: "1988-04-12",
        documento: "11122233344",
        tipoDocumento: "CPF",
        dataExpedicao: "2015-05-10",
        telefone: {
            ddd: "12",
            numero: "988881111"
        },
        endereco: {
            rua: "Rua das Palmeiras, 120",
            bairro: "Centro",
            cidade: "Sao Jose dos Campos",
            estado: "SP",
            pais: "Brasil",
            codigoPostal: "12210000"
        }
    },
    {
        nome: "Rafael Almeida",
        nomeSocial: "Rafa Almeida",
        dataNascimento: "1991-09-25",
        documento: "22233344455",
        tipoDocumento: "CPF",
        dataExpedicao: "2018-02-18",
        telefone: {
            ddd: "11",
            numero: "977772222"
        },
        endereco: {
            rua: "Avenida Atlantica, 450",
            bairro: "Jardim Oceano",
            cidade: "Santos",
            estado: "SP",
            pais: "Brasil",
            codigoPostal: "11060001"
        }
    },
    {
        nome: "Helena Duarte",
        nomeSocial: "Helena Duarte",
        dataNascimento: "1979-12-03",
        documento: "BR123456",
        tipoDocumento: "Passaporte",
        dataExpedicao: "2022-08-01",
        telefone: {
            ddd: "21",
            numero: "966663333"
        },
        endereco: {
            rua: "Rua Lago Azul, 77",
            bairro: "Porto Novo",
            cidade: "Rio de Janeiro",
            estado: "RJ",
            pais: "Brasil",
            codigoPostal: "20040002"
        }
    }
];

const dependentesPorTitular: Record<string, DependenteSeed[]> = {
    "11122233344": [
        {
            nome: "Lia Costa",
            nomeSocial: "Lia Costa",
            dataNascimento: "2014-06-20",
            documento: "44455566677",
            tipoDocumento: "CPF",
            dataExpedicao: "2020-03-12"
        },
        {
            nome: "Noah Costa",
            nomeSocial: "Noah Costa",
            dataNascimento: "2017-11-08",
            documento: "55566677788",
            tipoDocumento: "CPF",
            dataExpedicao: "2021-04-02"
        }
    ],
    "22233344455": [
        {
            nome: "Clara Almeida",
            nomeSocial: "Clara Almeida",
            dataNascimento: "2016-01-15",
            documento: "66677788899",
            tipoDocumento: "RG",
            dataExpedicao: "2022-07-11"
        }
    ]
};

async function buscarClientePorDocumento(numero: string) {
    const documento = await prisma.documento.findFirst({
        where: {
            numero
        },
        include: {
            cliente: true
        }
    });

    return documento?.cliente || null;
}

async function criarTitularSeNecessario(data: TitularSeed) {
    const existente = await buscarClientePorDocumento(data.documento);

    if (existente) {
        return existente;
    }

    return prisma.cliente.create({
        data: {
            nome: data.nome,
            nomeSocial: data.nomeSocial,
            dataNascimento: new Date(data.dataNascimento),
            depende: false,
            endereco: {
                create: data.endereco
            },
            telefones: {
                create: data.telefone
            },
            documentos: {
                create: {
                    numero: data.documento,
                    tipo: data.tipoDocumento,
                    dataExpedicao: new Date(data.dataExpedicao)
                }
            }
        }
    });
}

async function criarDependenteSeNecessario(
    titularId: number,
    data: DependenteSeed
) {
    const existente = await buscarClientePorDocumento(data.documento);

    if (existente) {
        return existente;
    }

    const titular = await prisma.cliente.findUnique({
        where: {
            id: titularId
        },
        include: {
            endereco: true,
            telefones: true
        }
    });

    if (!titular) {
        throw new Error("Titular seed nao localizado");
    }

    return prisma.cliente.create({
        data: {
            nome: data.nome,
            nomeSocial: data.nomeSocial,
            dataNascimento: new Date(data.dataNascimento),
            depende: true,
            titularId,
            endereco: titular.endereco
                ? {
                    create: {
                        rua: titular.endereco.rua,
                        bairro: titular.endereco.bairro,
                        cidade: titular.endereco.cidade,
                        estado: titular.endereco.estado,
                        pais: titular.endereco.pais,
                        codigoPostal: titular.endereco.codigoPostal
                    }
                }
                : undefined,
            telefones: {
                create: titular.telefones.map(telefone => ({
                    ddd: telefone.ddd,
                    numero: telefone.numero
                }))
            },
            documentos: {
                create: {
                    numero: data.documento,
                    tipo: data.tipoDocumento,
                    dataExpedicao: new Date(data.dataExpedicao)
                }
            }
        }
    });
}

async function vincularHospedagem(
    documentoTitular: string,
    nomeAcomodacao: string,
    documentosDependentes: string[] = []
) {
    const titular = await buscarClientePorDocumento(documentoTitular);
    const acomodacao = await prisma.acomodacao.findFirst({
        where: {
            nome: nomeAcomodacao
        }
    });

    if (!titular || !acomodacao) {
        return;
    }

    const hospedes = [titular];

    for (const documento of documentosDependentes) {
        const dependente = await buscarClientePorDocumento(documento);

        if (dependente && dependente.titularId === titular.id) {
            hospedes.push(dependente);
        }
    }

    await prisma.cliente.updateMany({
        where: {
            id: {
                in: hospedes.map(hospede => hospede.id)
            }
        },
        data: {
            acomodacaoId: acomodacao.id
        }
    });
}

async function main() {
    const acomodacaoService = new AcomodacaoService();
    const acomodacoes =
        await acomodacaoService.garantirCatalogoPadrao();

    const titularesCriados = [];
    const dependentesCriados = [];

    for (const titularSeed of titulares) {
        const titular =
            await criarTitularSeNecessario(titularSeed);

        titularesCriados.push(titular);

        const dependentes =
            dependentesPorTitular[titularSeed.documento] || [];

        for (const dependenteSeed of dependentes) {
            dependentesCriados.push(
                await criarDependenteSeNecessario(
                    titular.id,
                    dependenteSeed
                )
            );
        }
    }

    await vincularHospedagem(
        "11122233344",
        "Familia Simples",
        ["44455566677", "55566677788"]
    );

    await vincularHospedagem(
        "22233344455",
        "Casal Simples",
        ["66677788899"]
    );

    console.log(
        [
            `${acomodacoes.length} acomodacoes padrao disponiveis`,
            `${titularesCriados.length} titulares de exemplo disponiveis`,
            `${dependentesCriados.length} dependentes de exemplo disponiveis`
        ].join("\n")
    );
}

main()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
