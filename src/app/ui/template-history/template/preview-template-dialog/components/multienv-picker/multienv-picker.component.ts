import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CountryEnvironmentModel } from '../../../../../../api/env/country-environment.model';
import { DialogService } from '../../../../../../shared/dialog/dialog.service';
import { EnvViewerDialogComponent } from '../../../../../env/env-viewer-dialog/env-viewer-dialog.component';

@Component({
  selector: 'app-multienv-picker',
  standalone: true,
  imports: [],
  templateUrl: './multienv-picker.component.html',
  styleUrl: './multienv-picker.component.scss',
})
export class MultienvPickerComponent implements OnInit {
  @Input() envs: CountryEnvironmentModel[] = [];
  @Output() envsChange = new EventEmitter<CountryEnvironmentModel[]>();

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  addEnvs(newEnvs: CountryEnvironmentModel[]): void {
    const updatedEnvs = [...this.envs, ...newEnvs];
    this.envsChange.emit(updatedEnvs);
  }

  removeEnv(index: number): void {
    const updatedEnvs = this.envs.filter((_, i) => i !== index);
    this.envsChange.emit(updatedEnvs);
  }

  viewEnvDetails(env: CountryEnvironmentModel): void {
    this.dialogService.open(EnvViewerDialogComponent, '', env);
  }
}
