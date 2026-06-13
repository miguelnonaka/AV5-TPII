import { Router } from "express";
import { AcomodacaoController } from "../controllers/AcomodacaoController";

const router = Router();

const controller =
    new AcomodacaoController();

router.post(
    "/catalogo-padrao",
    controller.criarCatalogoPadrao
);

router.get(
    "/acomodados",
    controller.listarAcomodados
);

router.post(
    "/hospedagens",
    controller.vincular
);

router.delete(
    "/hospedagens/:titularId",
    controller.cancelarHospedagem
);

router.post(
    "/",
    controller.criar
);

router.get(
    "/",
    controller.listar
);

router.get(
    "/:id",
    controller.buscarPorId
);

router.put(
    "/:id",
    controller.atualizar
);

router.patch(
    "/:id",
    controller.atualizar
);

router.delete(
    "/:id",
    controller.remover
);

export default router;
