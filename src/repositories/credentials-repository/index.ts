import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function findById(id: number, select?: Prisma.UserSelect) {
  const params: Prisma.CredentialFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.credential.findUnique(params);
}

async function findByTitle(userId: number, title: string) {
  return prisma.credential.findFirst({
    where: {
      userId,
      title,
    },
  });
}

async function getCredentials(userId: number) {
  return prisma.credential.findMany({
    where: {
      userId,
    },
  });
}

async function create(data: Prisma.CredentialUncheckedCreateInput) {
  return prisma.credential.create({
    data,
  });
}

async function erase(credentialId: number) {
  return prisma.credential.delete({
    where: {
      id: credentialId,
    },
  });
}

const credentialRepository = {
  findById,
  findByTitle,
  getCredentials,
  create,
  erase,
};

export default credentialRepository;