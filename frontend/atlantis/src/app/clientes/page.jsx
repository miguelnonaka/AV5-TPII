"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "../../components/ApiProvider/ApiProvider";
import { Empty, Loading, Panel } from "../../components/ui/ui";
import {
  documentoFromForm,
  enderecoFromForm,
  formValue,
  telefoneFromForm
} from "../../utils/forms/forms";
import styles from "./page.module.css";

export default function ClientesPage() {
  const { request, showAlert } = useApi();
  const [clientes, setClientes] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const titulares = useMemo(
    () => clientes.filter((cliente) => !cliente.depende && cliente.titularId === null),
    [clientes]
  );

  const dependentes = useMemo(
    () => clientes.filter((cliente) => cliente.depende || cliente.titularId !== null),
    [clientes]
  );

  const clientesFiltrados = useMemo(() => {
    if (filter === "titulares") return titulares;
    if (filter === "dependentes") return dependentes;

    return clientes;
  }, [clientes, dependentes, filter, titulares]);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      setClientes(await request("/clientes"));
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

  async function createTitular(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      nome: formValue(data, "nome"),
      nomeSocial: formValue(data, "nomeSocial"),
      dataNascimento: formValue(data, "dataNascimento"),
      endereco: enderecoFromForm(data),
      telefones: telefoneFromForm(data),
      documentos: [documentoFromForm(data)]
    };

    try {
      await request("/clientes/titulares", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      form.elements.pais.value = "Brasil";
      showAlert("Titular cadastrado.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function createDependente(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const titularId = Number(formValue(data, "titularId"));

    const payload = {
      nome: formValue(data, "nome"),
      nomeSocial: formValue(data, "nomeSocial"),
      dataNascimento: formValue(data, "dataNascimento"),
      documentos: [documentoFromForm(data)]
    };

    try {
      await request(`/clientes/titulares/${titularId}/dependentes`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      showAlert("Dependente cadastrado.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function removeCliente(id) {
    try {
      await request(`/clientes/${id}`, {
        method: "DELETE"
      });
      showAlert("Cliente removido.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  async function updateCliente(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      nome: formValue(data, "nome"),
      nomeSocial: formValue(data, "nomeSocial"),
      dataNascimento: formValue(data, "dataNascimento")
    };

    try {
      await request(`/clientes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      setEditingId(null);
      showAlert("Cliente atualizado.");
      refresh();
    } catch (error) {
      showAlert(error.message, true);
    }
  }

  return (
    <>
      {loading && <Loading />}

      <section className={styles.grid}>
        <Panel
          title="Clientes cadastrados"
          aside={<ClientFilter value={filter} onChange={setFilter} />}
        >
          <div className={styles.list}>
            {clientesFiltrados.length === 0 && <Empty>Nenhum cliente encontrado.</Empty>}
            {clientesFiltrados.map((cliente) => (
              <article className={styles.item} key={cliente.id}>
                <div className={styles.itemHead}>
                  <strong>{cliente.nome}</strong>
                  <span>{cliente.depende ? "Dependente" : "Titular"}</span>
                </div>
                <div className={styles.itemMeta}>
                  <span>Social: {cliente.nomeSocial}</span>
                  <span>Docs: {cliente.documentos?.map((doc) => doc.numero).join(", ") || "-"}</span>
                  <span>Acomodacao: {cliente.acomodacao?.nome || "-"}</span>
                </div>
                {editingId === cliente.id && (
                  <form className={styles.inlineForm} onSubmit={(event) => updateCliente(event, cliente.id)}>
                    <label>Nome<input name="nome" defaultValue={cliente.nome} required /></label>
                    <label>Nome social<input name="nomeSocial" defaultValue={cliente.nomeSocial} required /></label>
                    <label>
                      Data nascimento
                      <input
                        name="dataNascimento"
                        type="date"
                        defaultValue={cliente.dataNascimento?.slice(0, 10)}
                        required
                      />
                    </label>
                    <div className={styles.actions}>
                      <button type="submit">Salvar</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  </form>
                )}
                <div className={styles.actions}>
                  <button type="button" onClick={() => setEditingId(cliente.id)}>
                    Editar
                  </button>
                  <button className={styles.danger} type="button" onClick={() => removeCliente(cliente.id)}>
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <section className={styles.formPanel}>
          <h2>Novo titular</h2>
          <ClienteForm mode="titular" onSubmit={createTitular} />

          <h2>Novo dependente</h2>
          <ClienteForm mode="dependente" titulares={titulares} onSubmit={createDependente} />
        </section>
      </section>
    </>
  );
}

function ClientFilter({ value, onChange }) {
  return (
    <div className={styles.segmented}>
      {["todos", "titulares", "dependentes"].map((option) => (
        <button
          key={option}
          type="button"
          className={value === option ? styles.active : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ClienteForm({ mode, titulares = [], onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {mode === "dependente" && (
        <label>
          Titular
          <select name="titularId" required>
            <option value="">Selecione</option>
            {titulares.map((titular) => (
              <option key={titular.id} value={titular.id}>
                {titular.nome}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>Nome<input name="nome" required /></label>
      <label>Nome social<input name="nomeSocial" required /></label>
      <label>Data nascimento<input name="dataNascimento" type="date" required /></label>

      {mode === "titular" && (
        <>
          <div className={styles.row}>
            <label>DDD<input name="ddd" maxLength="3" /></label>
            <label>Telefone<input name="numero" /></label>
          </div>
          <label>Rua<input name="rua" /></label>
          <div className={styles.row}>
            <label>Bairro<input name="bairro" /></label>
            <label>Cidade<input name="cidade" /></label>
          </div>
          <div className={styles.row}>
            <label>Estado<input name="estado" /></label>
            <label>CEP<input name="codigoPostal" /></label>
          </div>
          <label>Pais<input name="pais" defaultValue="Brasil" /></label>
        </>
      )}

      <label>Documento<input name="documentoNumero" required /></label>
      <div className={styles.row}>
        <label>
          Tipo
          <select name="documentoTipo">
            <option>CPF</option>
            <option>RG</option>
            <option>Passaporte</option>
          </select>
        </label>
        <label>Expedicao<input name="dataExpedicao" type="date" required /></label>
      </div>

      <button type="submit">{mode === "titular" ? "Cadastrar titular" : "Cadastrar dependente"}</button>
    </form>
  );
}
