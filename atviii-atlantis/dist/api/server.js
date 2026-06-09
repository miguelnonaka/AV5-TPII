"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const acomodacaoRoutes_1 = __importDefault(require("./routes/acomodacaoRoutes"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/status", (_request, response) => {
    response.json({ status: "Atlantis API online" });
});
app.use("/api/clientes", clienteRoutes_1.default);
app.use("/api/acomodacoes", acomodacaoRoutes_1.default);
app.use((erro, _request, response, _next) => {
    console.error(erro);
    response.status(500).json({
        mensagem: "Erro interno no servidor",
        detalhe: erro.message
    });
});
app.listen(port, () => {
    console.log(`Atlantis API rodando em http://localhost:${port}`);
});
