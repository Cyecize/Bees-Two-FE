import { LoaderService } from './loader.service';
import { AppComponent } from '../../app.component';

export const ShowLoader = (): any => {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // access the loader
      const loader =
        AppComponent.getInjector().get<LoaderService>(LoaderService);

      loader.show();
      try {
        await originalMethod.apply(this, args);
      } finally {
        loader.hide();
      }
    };

    return descriptor;
  };
};
