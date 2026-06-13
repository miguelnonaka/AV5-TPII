import { Router } from "express";
import { EnderecoController } from "../controllers/EnderecoController";

const router = Router();

const controller =
    new EnderecoController();

router.post("/", controller.salvarParaCliente);
router.get("/", controller.listar);
router.get("/cliente/:clienteId", controller.buscarPorCliente);
router.put("/:id", controller.atualizar);
router.patch("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

export default router;
