import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController";

const router = Router();

const controller =
    new ClienteController();

router.post(
    "/",
    controller.criar
);

router.get(
    "/",
    controller.listar
);

router.post(
    "/titulares",
    controller.criar
);

router.get(
    "/titulares",
    controller.listarTitulares
);

router.post(
    "/titulares/:titularId/dependentes",
    controller.criarDependente
);

router.get(
    "/titulares/:titularId/dependentes",
    controller.listarDependentesDoTitular
);

router.get(
    "/dependentes",
    controller.listarDependentes
);

router.get(
    "/dependentes/:dependenteId/titular",
    controller.buscarTitularDoDependente
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

router.patch(
    "/:id/acomodacao/remover",
    controller.removerAcomodacao
);

router.delete(
    "/:id",
    controller.remover
);

export default router;
