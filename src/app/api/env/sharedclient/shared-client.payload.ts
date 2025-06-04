import { Env } from '../env';
import { BeesEntity } from '../../common/bees-entity';

/**
 * @monaco
 */
export interface SharedClientPayload {
  name: string;
  clientId: string;
  clientSecret: string;
  countryCode: string | null;
  vendorId: string | null;
  env: Env;
  targetEntities: BeesEntity[];
}
