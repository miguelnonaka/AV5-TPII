"use client";

import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../components/ApiProvider/ApiProvider";
import { Empty, Loading, Panel } from "../../components/ui/ui";
import { formValue } from "../../utils/forms/forms";
import styles from "./page.module.css";

export default function AcomodacoesPage() {
  const { request, showAlert } = useApi();
  const [acomodacoes, setAcomodacoes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      setAcomodacoes(await request("/acomodacoes"));
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

  async function seedAcomodacoes() {
    try {
      await request("/acomodacoes/catalogo-padrao", {
        method: "POST"
      });
      showAlert("Acomodacoes padrao disponiveis.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function createAcomodacao(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      nome: formValue(data, "nome"),
      camaSolteiro: Number(formValue(data, "camaSolteiro") || 0),
      camaCasal: Number(formValue(data, "camaCasal") || 0),
      suite: Number(formValue(data, "suite") || 0),
      climatizacao: data.get("climatizacao") === "on",
      garagem: Number(formValue(data, "garagem") || 0)
    };

    try {
      await request("/acomodacoes", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      showAlert("Acomodacao cadastrada.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function removeAcomodacao(id) {
    try {
      await request(`/acomodacoes/${id}`, {
        method: "DELETE"
      });
      showAlert("Acomodacao removida.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function updateAcomodacao(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      nome: formValue(data, "nome"),
      camaSolteiro: Number(formValue(data, "camaSolteiro") || 0),
      camaCasal: Number(formValue(data, "camaCasal") || 0),
      suite: Number(formValue(data, "suite") || 0),
      climatizacao: data.get("climatizacao") === "on",
      garagem: Number(formValue(data, "garagem") || 0)
    };

    try {
      await request(`/acomodacoes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      setEditingId(null);
      showAlert("Acomodacao atualizada.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  return (
    <>
      {loading && <Loading />}

      <section className={styles.grid}>
        <Panel title="Acomodacoes" action="Criar catalogo padrao" onAction={seedAcomodacoes}>
          <div className={styles.list}>
            {acomodacoes.length === 0 && <Empty>Nenhuma acomodacao cadastrada.</Empty>}
            {acomodacoes.map((acomodacao) => (
              <article className={styles.item} key={acomodacao.id}>
                <div className={styles.itemHead}>
                  <strong>{acomodacao.nome}</strong>
                  <span>{acomodacao.clientes?.length || 0} clientes</span>
                </div>
                <div className={styles.itemMeta}>
                  <span>Solteiro: {acomodacao.camaSolteiro}</span>
                  <span>Casal: {acomodacao.camaCasal}</span>
                  <span>Suite: {acomodacao.suite}</span>
                  <span>Garagem: {acomodacao.garagem}</span>
                  <span>Clima: {acomodacao.climatizacao ? "sim" : "nao"}</span>
                </div>
                {editingId === acomodacao.id && (
                  <form className={styles.inlineForm} onSubmit={(event) => updateAcomodacao(event, acomodacao.id)}>
                    <label>Nome<input name="nome" defaultValue={acomodacao.nome} required /></label>
                    <label>Cama solteiro<input name="camaSolteiro" type="number" min="0" defaultValue={acomodacao.camaSolteiro} /></label>
                    <label>Cama casal<input name="camaCasal" type="number" min="0" defaultValue={acomodacao.camaCasal} /></label>
                    <label>Suite<input name="suite" type="number" min="0" defaultValue={acomodacao.suite} /></label>
                    <label>Garagem<input name="garagem" type="number" min="0" defaultValue={acomodacao.garagem} /></label>
                    <label className={styles.check}>
                      <input name="climatizacao" type="checkbox" defaultChecked={acomodacao.climatizacao} />
                      Climatizacao
                    </label>
                    <div className={styles.actions}>
                      <button type="submit">Salvar</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  </form>
                )}
                <div className={styles.actions}>
                  <button type="button" onClick={() => setEditingId(acomodacao.id)}>
                    Editar
                  </button>
                  <button className={styles.danger} type="button" onClick={() => removeAcomodacao(acomodacao.id)}>
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <section className={styles.formPanel}>
          <h2>Nova acomodacao</h2>
          <form className={styles.form} onSubmit={createAcomodacao}>
            <label>Nome<input name="nome" required /></label>
            <div className={styles.row}>
              <label>Cama solteiro<input name="camaSolteiro" type="number" min="0" defaultValue="0" /></label>
              <label>Cama casal<input name="camaCasal" type="number" min="0" defaultValue="1" /></label>
            </div>
            <div className={styles.row}>
              <label>Suite<input name="suite" type="number" min="0" defaultValue="1" /></label>
              <label>Garagem<input name="garagem" type="number" min="0" defaultValue="0" /></label>
            </div>
            <label className={styles.check}><input name="climatizacao" type="checkbox" defaultChecked /> Climatizacao</label>
            <button type="submit">Cadastrar acomodacao</button>
          </form>
        </section>
      </section>
    </>
  );
}
