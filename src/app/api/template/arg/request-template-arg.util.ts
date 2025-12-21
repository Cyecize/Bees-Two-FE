import {
  RequestTemplateArg,
  RequestTemplateArgView,
  TypedRequestTemplateArg,
} from './request-template-arg';
import { TemplateArgDataType } from './template-arg-data.type';
import { RequestTemplatePresetWithValues } from './preset/request-template-preset';
import { ObjectUtils } from '../../../shared/util/object-utils';

export class RequestTemplateArgUtil {
  public static convertArgumentsToObj(args: RequestTemplateArg[]): {
    [key: string]: RequestTemplateArg;
  } {
    const obj: { [key: string]: RequestTemplateArg } = {};
    for (const arg of args) {
      const argClone: TypedRequestTemplateArg<any> = JSON.parse(
        JSON.stringify(arg),
      );
      obj[argClone.keyName] = argClone;
      if (!argClone.value?.trim()) {
        argClone.value = null;
        continue;
      }

      try {
        switch (argClone.dataType) {
          case TemplateArgDataType.BOOLEAN:
            argClone.value = argClone.value?.trim().toLowerCase() === 'true';
            break;
          case TemplateArgDataType.NUMBER:
            argClone.value = Number(argClone.value?.trim());
            break;
          case TemplateArgDataType.CUSTOM:
            argClone.value = JSON.parse(argClone.value);
            break;
        }
      } catch (error) {
        console.log(
          `Could not convert argument ${arg.name} to ${arg.dataType}! ${error}`,
        );
        throw error;
      }
    }

    return obj;
  }

  public static generateType(arg: RequestTemplateArg): string {
    let type = '';
    switch (arg.dataType) {
      case TemplateArgDataType.BOOLEAN:
        type = 'boolean';
        break;
      case TemplateArgDataType.NUMBER:
        type = 'number';
        break;
      case TemplateArgDataType.STRING:
        type = 'string';
        break;
      case TemplateArgDataType.CUSTOM:
        if (!arg.customType) {
          type = 'any';
          break;
        }
        type = arg.customType.trim();
        break;
      default:
        alert(`Arg ${arg.keyName} has unsupported data type ${arg.dataType}`);
        type = 'string';
    }

    if (arg.arrayType) {
      type = type + '[]';
    }

    return type;
  }

  public static applyPreset(
    args: RequestTemplateArgView[],
    preset: RequestTemplatePresetWithValues,
    filterMissingArgs = true,
  ): RequestTemplateArgView[] {
    // Deep clone
    args = args.map((a) => JSON.parse(JSON.stringify(a)));
    if (filterMissingArgs) {
      args = args.filter(
        (arg: RequestTemplateArg) =>
          !ObjectUtils.isNil(
            preset.argValues.find((val) => val.argId === arg.id),
          ),
      );
    }

    args.forEach((arg: RequestTemplateArg) => {
      const argOverride = preset.argValues.find((val) => val.argId === arg.id);
      if (argOverride) {
        arg.value = argOverride.value;
      }
    });

    return args;
  }
}
