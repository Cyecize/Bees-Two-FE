import { RequestFormType } from './request-form-type';
import { BeesFormParamPayload } from './bees-form-param.payload';

export interface BeesFormDataPayload {
  formType: RequestFormType;
  formData: BeesFormParamPayload[];
}

export class MultipartBeesFormDataPayload implements BeesFormDataPayload {
  formType: RequestFormType = RequestFormType.MULTIPART_FORM_DATA;

  // The value of the param must be base64 encoded when form is of multipart type.
  constructor(public formData: BeesFormParamPayload[]) {}
}
