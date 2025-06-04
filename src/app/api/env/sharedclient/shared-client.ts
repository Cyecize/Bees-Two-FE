import { Env } from '../env';
import { BeesEntity } from '../../common/bees-entity';

/**
 * @monaco
 */
export interface SharedClient {
  id: number;
  name: string;
  env: Env;
  countryCode: string | null;
  vendorId: string | null;
  targetEntities: BeesEntity[];
}
