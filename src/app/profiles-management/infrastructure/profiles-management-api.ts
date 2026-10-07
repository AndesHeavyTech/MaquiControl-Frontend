import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Organization } from '../domain/model/organization.entity';
import { Profile } from '../domain/model/profile.entity';
import { OrganizationApiEndpoint } from './organization-api-endpoint';
import { ProfileApiEndpoint } from './profile-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class ProfilesManagementApi extends BaseApi {
  readonly #profileEndpoint = new ProfileApiEndpoint(this.http);
  readonly #organizationEndpoint = new OrganizationApiEndpoint(this.http);

  getProfiles(): Observable<Profile[]> {
    return this.#profileEndpoint.getAll();
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.#profileEndpoint.create(profile);
  }

  updateProfile(profile: Profile, id: number): Observable<Profile> {
    return this.#profileEndpoint.update(profile, id);
  }

  getOrganizations(): Observable<Organization[]> {
    return this.#organizationEndpoint.getAll();
  }

  createOrganization(organization: Organization): Observable<Organization> {
    return this.#organizationEndpoint.create(organization);
  }

  updateOrganization(organization: Organization, id: number): Observable<Organization> {
    return this.#organizationEndpoint.update(organization, id);
  }
}
