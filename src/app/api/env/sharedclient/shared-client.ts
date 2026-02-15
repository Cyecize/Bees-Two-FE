import { Env } from '../env';
import { BeesEntity } from '../../common/bees-entity';
import { SharedClientSupportedMethod } from './shared-client-supported-method';

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
  requestMethods: SharedClientSupportedMethod[];
  createDate: string;
  updateDate: string;
}
