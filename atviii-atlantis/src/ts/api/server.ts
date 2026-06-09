import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import acomodacaoRoutes from "./routes/acomodacaoRoutes";
import clienteRoutes from "./routes/clienteRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/api/status", (_request, response) => {
    response.json({ status: "Atlantis API online" });
});

app.use("/api/clientes", clienteRoutes);
app.use("/api/acomodacoes", acomodacaoRoutes);

app.use((erro: Error, _request: Request, response: Response, _next: NextFunction) => {
    console.error(erro);
    response.status(500).json({
        mensagem: "Erro interno no servidor",
        detalhe: erro.message
    });
});

app.listen(port, () => {
    console.log(`Atlantis API rodando em http://localhost:${port}`);
});
