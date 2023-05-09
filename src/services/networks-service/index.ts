import { Network } from '@prisma/client';
import networkRepository from '@/repositories/network-repositories';
import { cryptrUtil } from '@/utils/cryptr-utils';
import { DuplicatedTitleError, notFoundError } from '@/errors';

async function getNetwork(userId: number) {
  const networks = await networkRepository.getNetwork(userId);
  if (networks.length === 0) {
    throw notFoundError();
  }

  networks.map((network) => (network.password = cryptrUtil.decrypt(network.password)));
  return networks;
}

async function showNetwork(userId: number, networkId: number) {
  const network = await networkRepository.findById(networkId);
  if (!network || network.userId !== userId) {
    throw notFoundError();
  }

  network.password = cryptrUtil.decrypt(network.password);
  return network;
}

export async function postNetwork({ userId, title, network, password }: PostNetworkParams): Promise<Network> {
  await validateUniqueTitleOrFail(userId, title);

  const hashedPassword = cryptrUtil.encrypt(password);
  return networkRepository.create({
    userId,
    title,
    network,
    password: hashedPassword,
  });
}

async function eraseNetwork(userId: number, networkId: number) {
  const network = await networkRepository.findById(networkId);
  if (!network || network.userId !== userId) {
    throw notFoundError();
  }

  await networkRepository.erase(networkId);
}

async function validateUniqueTitleOrFail(userId: number, title: string) {
  const networkWithSameTitle = await networkRepository.findByTitle(userId, title);
  if (networkWithSameTitle) {
    throw DuplicatedTitleError();
  }
}

export type PostNetworkParams = Pick<Network, 'userId' | 'title' | 'network' | 'password'>;

const networkService = {
  getNetwork,
  showNetwork,
  postNetwork,
  eraseNetwork,
};

export default networkService;