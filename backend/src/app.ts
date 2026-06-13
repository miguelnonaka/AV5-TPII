import express from "express";
import cors from "cors";

import clienteRouter from "./routes/ClienteRoute";
import acomodacaoRouter from "./routes/AcomodacaoRoute";
import documentoRouter from "./routes/DocumentoRoute";
import enderecoRouter from "./routes/EnderecoRoute";
import telefoneRouter from "./routes/TelefoneRoute";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/clientes", clienteRouter);
app.use("/acomodacoes", acomodacaoRouter);
app.use("/documentos", documentoRouter);
app.use("/enderecos", enderecoRouter);
app.use("/telefones", telefoneRouter);
app.use("/api/clientes", clienteRouter);
app.use("/api/acomodacoes", acomodacaoRouter);
app.use("/api/documentos", documentoRouter);
app.use("/api/enderecos", enderecoRouter);
app.use("/api/telefones", telefoneRouter);

app.get("/", (_req, res) => {
    res.json({
        sistema: "Atlantis",
        status: "online"
    });
});

app.get("/api/health", (_req, res) => {
    res.json({
        sistema: "Atlantis",
        status: "ok"
    });
});

export default app;
