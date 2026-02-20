export class NotifyDialogPayloadModel {
  constructor(
    public readonly message: string,
    public readonly closeBtnMessage?: string,
  ) {}
}
