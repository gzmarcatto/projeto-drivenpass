import Joi from 'joi';
import { PostNetworkParams } from '@/services/networks-service';

export const postNetworkSchema = Joi.object<PostNetworkParams>({
  title: Joi.string().required(),
  network: Joi.string().required(),
  password: Joi.string().required(),
});