import { Router } from "express";
import { TelefoneController } from "../controllers/TelefoneController";

const router = Router();

const controller =
    new TelefoneController();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.get("/cliente/:clienteId", controller.listarPorCliente);
router.put("/:id", controller.atualizar);
router.patch("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

export default router;
