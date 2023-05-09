import Joi from 'joi';
import { PostCredentialParams } from '@/services/credentials-service';

export const postCredentialSchema = Joi.object<PostCredentialParams>({
  title: Joi.string().required(),
  url: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});