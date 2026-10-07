import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../domain/model/profile.entity';
import { ProfileAssembler } from './profile-assembler';
import { ProfileResource, ProfileResponse } from './profile-response';

export class ProfileApiEndpoint extends BaseApiEndpoint<
  Profile,
  ProfileResource,
  ProfileResponse,
  ProfileAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/profiles`, new ProfileAssembler());
  }
}
