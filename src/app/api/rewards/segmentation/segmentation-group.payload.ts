/**
 * @monaco
 * @monaco_include_deps
 */
export interface SegmentationGroupPayload {
  groupId: string | null;
  groupName: string;
  groupDescription: string | null;
  purpose: string | null;
  pocs: SegmentationGroupPocsPayload[];
}

export interface SegmentationGroupPocsPayload {
  pocId: string;
  points: number | null;
  quantity: number | null;
}
