import { Router } from "express";
import { DocumentoController } from "../controllers/DocumentoController";

const router = Router();

const controller =
    new DocumentoController();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.get("/cliente/:clienteId", controller.listarPorCliente);
router.get("/numero/:numero", controller.buscarPorNumero);
router.get("/:id", controller.buscarPorId);
router.put("/:id", controller.atualizar);
router.patch("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

export default router;
