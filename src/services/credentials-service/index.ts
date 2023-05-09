import { Credential } from '@prisma/client';
import credentialRepository from '@/repositories/credentials-repository';
import { cryptrUtil } from '@/utils/cryptr-utils';
import { DuplicatedTitleError, notFoundError } from '@/errors';

async function getCredential(userId: number) {
  const credentials = await credentialRepository.getCredentials(userId);
  if (credentials.length === 0) {
    throw notFoundError();
  }

  credentials.map((credential) => (credential.password = cryptrUtil.decrypt(credential.password)));
  return credentials;
}

async function showCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.findById(credentialId);
  if (!credential || credential.userId !== userId) {
    throw notFoundError();
  }

  credential.password = cryptrUtil.decrypt(credential.password);
  return credential;
}

export async function postCredential({
  userId,
  title,
  url,
  username,
  password,
}:PostCredentialParams): Promise<Credential> {
  await validateUniqueTitle(userId, title);

  const hashedPassword = cryptrUtil.encrypt(password);
  return credentialRepository.create({
    userId,
    title,
    url,
    username,
    password: hashedPassword,
  });
}

async function eraseCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.findById(credentialId);
  if (!credential || credential.userId !== userId) {
    throw notFoundError();
  }

  await credentialRepository.erase(credentialId);
}

async function validateUniqueTitle(userId: number, title: string) {
  const credentialWithSameTitle = await credentialRepository.findByTitle(userId, title);
  if (credentialWithSameTitle) {
    throw DuplicatedTitleError();
  }
}

export type PostCredentialParams = Pick<Credential, 'userId' | 'title' | 'url' | 'username' | 'password'>;

const credentialService = {
  getCredential,
  showCredential,
  postCredential,
  eraseCredential,
};

export default credentialService;