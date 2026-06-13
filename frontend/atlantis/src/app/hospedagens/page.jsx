"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "../../components/ApiProvider/ApiProvider";
import { HospedadosList, Loading, Panel } from "../../components/ui/ui";
import { formValue } from "../../utils/forms/forms";
import styles from "./page.module.css";

export default function HospedagensPage() {
  const { request, showAlert } = useApi();
  const [clientes, setClientes] = useState([]);
  const [acomodacoes, setAcomodacoes] = useState([]);
  const [hospedados, setHospedados] = useState([]);
  const [selectedTitular, setSelectedTitular] = useState("");
  const [dependentesHospedagem, setDependentesHospedagem] = useState([]);
  const [loading, setLoading] = useState(false);

  const titulares = useMemo(
    () => clientes.filter((cliente) => !cliente.depende && cliente.titularId === null),
    [clientes]
  );

  const dependentes = useMemo(
    () => clientes.filter((cliente) => cliente.depende || cliente.titularId !== null),
    [clientes]
  );

  const dependentesDoTitular = useMemo(() => {
    if (!selectedTitular) return [];

    return dependentes.filter((dependente) => dependente.titularId === Number(selectedTitular));
  }, [dependentes, selectedTitular]);

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
      setSelectedTitular((current) => current || String(clientesData.find((cliente) => !cliente.depende)?.id || ""));
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

  function toggleDependente(id) {
    setDependentesHospedagem((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function createHospedagem(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      titularId: Number(formValue(data, "titularId")),
      acomodacaoId: Number(formValue(data, "acomodacaoId")),
      incluirTitular: data.get("incluirTitular") === "on",
      dependenteIds: dependentesHospedagem
    };

    try {
      await request("/acomodacoes/hospedagens", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setDependentesHospedagem([]);
      showAlert("Hospedagem registrada.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function cancelarHospedagem(titularId) {
    try {
      await request(`/acomodacoes/hospedagens/${titularId}`, {
        method: "DELETE"
      });
      showAlert("Hospedagem cancelada.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  return (
    <>
      {loading && <Loading />}

      <section className={styles.grid}>
        <section className={styles.formPanel}>
          <h2>Registrar hospedagem</h2>
          <form className={styles.form} onSubmit={createHospedagem}>
            <label>
              Titular
              <select
                name="titularId"
                value={selectedTitular}
                onChange={(event) => setSelectedTitular(event.target.value)}
                required
              >
                <option value="">Selecione</option>
                {titulares.map((titular) => (
                  <option key={titular.id} value={titular.id}>
                    {titular.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Acomodacao
              <select name="acomodacaoId" required>
                <option value="">Selecione</option>
                {acomodacoes.map((acomodacao) => (
                  <option key={acomodacao.id} value={acomodacao.id}>
                    {acomodacao.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.check}>
              <input name="incluirTitular" type="checkbox" defaultChecked /> Incluir titular
            </label>

            <div>
              <span className={styles.fieldTitle}>Dependentes</span>
              <div className={styles.checkboxList}>
                {dependentesDoTitular.length === 0 && (
                  <span className={styles.muted}>Nenhum dependente para este titular.</span>
                )}
                {dependentesDoTitular.map((dependente) => (
                  <label className={styles.check} key={dependente.id}>
                    <input
                      type="checkbox"
                      checked={dependentesHospedagem.includes(dependente.id)}
                      onChange={() => toggleDependente(dependente.id)}
                    />
                    {dependente.nome}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit">Vincular acomodacao</button>
          </form>
        </section>

        <Panel title="Clientes hospedados" action="Atualizar" onAction={refresh}>
          <HospedadosList hospedados={hospedados} onCancel={cancelarHospedagem} />
        </Panel>
      </section>
    </>
  );
}
