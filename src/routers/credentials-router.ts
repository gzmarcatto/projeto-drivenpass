import { Router } from "express";
import { postCredentialSchema } from "@/schemas";
import { authenticateToken, validateBody } from "@/middlewares";
import { eraseCredentials, getCredentials, postCredentials, showCredentials } from "@/controllers";

const credentialsRouter = Router();

credentialsRouter.all('/*', authenticateToken);
credentialsRouter.get('/', getCredentials);
credentialsRouter.get('/:credentialId', showCredentials);
credentialsRouter.post('/', validateBody(postCredentialSchema), postCredentials);
credentialsRouter.delete('/:credentialId', eraseCredentials);

export { credentialsRouter };
