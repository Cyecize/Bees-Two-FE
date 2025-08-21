import { BeesParam, BeesParamImpl } from '../../api/common/bees-param';

export class BeesQueryParamsHelper {
  public static toBeesParams(obj: any, result: BeesParam[]): BeesParam[] {
    // Adds all non-null string / bool / array fields
    Object.keys(obj).forEach((fieldName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const val = obj[fieldName];

      if ((typeof val === 'string' && val.trim()) || typeof val === 'boolean') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.push(new BeesParamImpl(fieldName, obj[fieldName]));
      }

      if (Array.isArray(val) && val.length > 0) {
        result.push(new BeesParamImpl(fieldName, val.join(',')));
      }
    });

    return result;
  }
}
