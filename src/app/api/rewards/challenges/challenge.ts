import { ChallengeExecutionMethod } from './challenge-execution-method';
import { ChallengeFilterType } from './challenge-filter-type';
import { ChallengeMode } from './challenge-mode';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  squareImage: string;
  goodPhotoSample: string;
  badPhotoSample: string;
  startDate: string;
  endDate: string;
  lastModified: string;
  campaignId: string;
  visionId: string;
  type: any; // ChallengeType enum
  points: number;
  executionMethod: ChallengeExecutionMethod;
  filter: any; // Custom Filter Object
  mode: ChallengeMode;
  quantityMin: number;
  currencyMin: number;
  individualTarget: boolean;
  filterType: ChallengeFilterType;
  skus: any[]; //Custom Skus Object
  items: any[]; //Custom items Object
}
