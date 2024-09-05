import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { SegmentationGroupByAccountModel } from '../../../api/rewards/segmentation/segmentation-group-by-account.model';
import { SegmentationGroupByAccountQuery } from '../../../api/rewards/segmentation/segmentation-group-by-account.query';

export class ShowSegmentGroupByAccountDetailsDialogPayload {
  constructor(
    public group: SegmentationGroupByAccountModel,
    public query: SegmentationGroupByAccountQuery,
    public selectedEnv: CountryEnvironmentModel,
  ) {}
}
