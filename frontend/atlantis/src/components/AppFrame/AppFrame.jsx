"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApi } from "../ApiProvider/ApiProvider";
import styles from "./AppFrame.module.css";

const pages = [
  {
    href: "/",
    label: "Visao geral",
    title: "Visao geral",
    subtitle: "Resumo operacional do sistema Atlantis."
  },
  {
    href: "/clientes",
    label: "Clientes",
    title: "Clientes",
    subtitle: "Cadastro de titulares, dependentes e dados pessoais."
  },
  {
    href: "/acomodacoes",
    label: "Acomodacoes",
    title: "Acomodacoes",
    subtitle: "Tipos de quartos e suas configuracoes."
  },
  {
    href: "/hospedagens",
    label: "Hospedagens",
    title: "Hospedagens",
    subtitle: "Vinculo de titulares e dependentes a uma acomodacao."
  }
];

export function AppFrame({ children }) {
  const pathname = usePathname();
  const { alert } = useApi();
  const currentPage =
    pages.find((page) => page.href === pathname) || pages[0];

  return (
    <div className={styles.shell}>
      <header className={styles.navbar}>
        <a
          className={styles.brand}
          href="https://www.youtube.com/watch?v=0vL4BmoR-YQ"
          target="_blank"
          rel="noreferrer"
        >
          <div className={styles.brandMark}>A</div>
          <div>
            <strong>Atlantis</strong>
            <span>Gestao hoteleira</span>
          </div>
        </a>

        <nav className={styles.nav} aria-label="Navegacao principal">
          {pages.map((page) => (
            <Link
              key={page.href}
              className={pathname === page.href ? styles.active : ""}
              href={page.href}
            >
              {page.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className={styles.content}>
        <section className={styles.pageHeader}>
          <div>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.subtitle}</p>
          </div>
        </section>

        {alert && (
          <section className={alert.isError ? `${styles.alert} ${styles.error}` : styles.alert}>
            {alert.message}
          </section>
        )}

        {children}
      </main>
    </div>
  );
}
