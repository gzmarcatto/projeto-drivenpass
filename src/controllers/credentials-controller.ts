import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import credentialsService, { PostCredentialParams } from '@/services/credentials-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const credentials = await credentialsService.getCredential(userId);
    return res.status(httpStatus.OK).send(credentials);
  } catch (error) {
    next(error);
  }
}

export async function showCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { credentialId } = req.params;

  try {
    const credentials = await credentialsService.showCredential(userId, parseInt(credentialId));
    return res.status(httpStatus.OK).send(credentials);
  } catch (error) {
    next(error);
  }
}

export async function postCredentials(req: AuthenticatedRequest, res: Response) {
  const { title, url, username, password } = req.body as PostCredentialParams;
  const { userId } = req;

  try {
    const credential = await credentialsService.postCredential({ userId, title, url, username, password });
    return res.status(httpStatus.CREATED).json({
      credentialId: credential.id,
    });
  } catch (error) {
    if (error.name === 'DuplicatedTitleError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function eraseCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { credentialId } = req.params;

  try {
    await credentialsService.eraseCredential(userId, parseInt(credentialId));
    return res.sendStatus(httpStatus.ACCEPTED);
  } catch (error) {
    next(error);
  }
}