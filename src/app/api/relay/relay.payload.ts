import { RelayVersion } from './relay.version';
import { BeesEntity } from '../common/bees-entity';

export interface RelayPayload {
  entity: BeesEntity;
  version: RelayVersion;
  payload?: string | null;
}
