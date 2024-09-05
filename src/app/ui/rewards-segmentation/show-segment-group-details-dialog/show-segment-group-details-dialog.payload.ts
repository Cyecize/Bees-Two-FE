import { SegmentationGroupQuery } from '../../../api/rewards/segmentation/segmentation-group.query';
import { SegmentationGroupModel } from '../../../api/rewards/segmentation/segmentation-group.model';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class ShowSegmentGroupDetailsDialogPayload {
  constructor(
    public group: SegmentationGroupModel,
    public query: SegmentationGroupQuery,
    public selectedEnv: CountryEnvironmentModel,
  ) {}
}
