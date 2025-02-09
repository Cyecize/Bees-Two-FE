import { RequestTemplateArg } from './request-template-arg';

export class RequestTemplateArgUtil {
  public static convertArgumentsToObj(args: RequestTemplateArg[]): {
    [key: string]: RequestTemplateArg;
  } {
    const obj: { [key: string]: RequestTemplateArg } = {};
    for (const arg of args) {
      obj[arg.keyName] = arg;
    }

    return obj;
  }
}
