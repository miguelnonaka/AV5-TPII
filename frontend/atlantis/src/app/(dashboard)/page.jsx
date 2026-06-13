"use client";

import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../components/ApiProvider/ApiProvider";
import { HospedadosList, Loading, Metric, Panel } from "../../components/ui/ui";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { request, showAlert } = useApi();
  const [clientes, setClientes] = useState([]);
  const [acomodacoes, setAcomodacoes] = useState([]);
  const [hospedados, setHospedados] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const [clientesData, acomodacoesData, hospedadosData] = await Promise.all([
        request("/clientes"),
        request("/acomodacoes"),
        request("/acomodacoes/acomodados")
      ]);

      setClientes(clientesData);
      setAcomodacoes(acomodacoesData);
      setHospedados(hospedadosData);
    } catch (error) {
      showAlert(error.message, true);
    } finally {
      setLoading(false);
    }
  }, [request, showAlert]);

  useEffect(() => {
    // Initial page data load from the backend API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const titulares = clientes.filter(
    (cliente) => !cliente.depende && cliente.titularId === null
  );
  const dependentes = clientes.filter(
    (cliente) => cliente.depende || cliente.titularId !== null
  );

  return (
    <>
      {loading && <Loading />}

      <section className={styles.metrics}>
        <Metric label="Titulares" value={titulares.length} />
        <Metric label="Dependentes" value={dependentes.length} />
        <Metric label="Acomodacoes" value={acomodacoes.length} />
        <Metric label="Hospedados" value={hospedados.length} />
      </section>

      <section className={styles.grid}>
        <Panel title="Hospedagens ativas" action="Atualizar" onAction={refresh}>
          <HospedadosList hospedados={hospedados} compact />
        </Panel>
      </section>
    </>
  );
}
