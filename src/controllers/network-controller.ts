import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import networksService, { PostNetworkParams } from '@/services/networks-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const network = await networksService.getNetwork(userId);
    return res.status(httpStatus.OK).send(network);
  } catch (error) {
    next(error);
  }
}

export async function showNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { networkId } = req.params;

  try {
    const network = await networksService.showNetwork(userId, parseInt(networkId));
    return res.status(httpStatus.OK).send(network);
  } catch (error) {
    next(error);
  }
}

export async function postNetwork(req: AuthenticatedRequest, res: Response) {
  const { title, network, password } = req.body as PostNetworkParams;
  const { userId } = req;

  try {
    const response = await networksService.postNetwork({ userId, title, network, password });
    return res.status(httpStatus.CREATED).json({
      networkId: response.id,
    });
  } catch (error) {
    if (error.name === 'DuplicatedTitleError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function eraseNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { networkId } = req.params;

  try {
    await networksService.eraseNetwork(userId, parseInt(networkId));
    return res.sendStatus(httpStatus.ACCEPTED);
  } catch (error) {
    next(error);
  }
}