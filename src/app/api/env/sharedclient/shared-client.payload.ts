import { Env } from '../env';
import { BeesEntity } from '../../common/bees-entity';
import { SharedClientSupportedMethod } from './shared-client-supported-method';

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
  requestMethods: SharedClientSupportedMethod[];
}
