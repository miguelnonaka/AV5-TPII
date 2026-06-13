import styles from "./Ui.module.css";

export function Panel({ title, action, onAction, aside, children }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHead}>
        <h2>{title}</h2>
        {aside}
        {action && (
          <button type="button" onClick={onAction}>
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function Metric({ label, value }) {
  return (
    <article className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function Empty({ children }) {
  return <div className={styles.empty}>{children}</div>;
}

export function Loading() {
  return <div className={styles.loading}>Carregando dados...</div>;
}

export function HospedadosList({ hospedados, onCancel, compact = false }) {
  if (hospedados.length === 0) {
    return <Empty>Nenhum cliente hospedado.</Empty>;
  }

  return (
    <div className={compact ? `${styles.list} ${styles.compact}` : styles.list}>
      {hospedados.map((cliente) => (
        <article className={styles.item} key={cliente.id}>
          <div className={styles.itemHead}>
            <strong>{cliente.nome}</strong>
            <span>{cliente.acomodacao?.nome || "-"}</span>
          </div>
          <div className={styles.itemMeta}>
            <span>{cliente.depende ? "Dependente" : "Titular"}</span>
            <span>Documento: {cliente.documentos?.[0]?.numero || "-"}</span>
          </div>
          {onCancel && !cliente.depende && (
            <div className={styles.actions}>
              <button className={styles.danger} type="button" onClick={() => onCancel(cliente.id)}>
                Cancelar hospedagem
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
