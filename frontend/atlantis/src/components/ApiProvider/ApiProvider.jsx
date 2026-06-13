"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ApiContext = createContext(null);

function initialApiBase() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("atlantis-api-base") || "http://localhost:3000/api";
  }

  return "http://localhost:3000/api";
}

export function ApiProvider({ children }) {
  const [apiBase, setApiBase] = useState(initialApiBase);
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  const showAlert = useCallback((message, isError = false) => {
    setAlert({ message, isError });

    window.clearTimeout(alertTimer.current);
    alertTimer.current = window.setTimeout(() => setAlert(null), 4500);
  }, []);

  const request = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${apiBase}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      });

      if (!response.ok) {
        let message = "Erro na comunicacao com a API";

        try {
          const body = await response.json();
          message = body.mensagem || message;
        } catch {
          message = `${message}: ${response.status}`;
        }

        throw new Error(message);
      }

      if (response.status === 204) return null;

      return response.json();
    },
    [apiBase]
  );

  const saveApiBase = useCallback(() => {
    window.localStorage.setItem("atlantis-api-base", apiBase);
    showAlert("Endereco da API salvo.");
  }, [apiBase, showAlert]);

  const value = useMemo(
    () => ({
      apiBase,
      setApiBase,
      alert,
      showAlert,
      request,
      saveApiBase
    }),
    [apiBase, alert, request, saveApiBase, showAlert]
  );

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi precisa estar dentro de ApiProvider");
  }

  return context;
}
