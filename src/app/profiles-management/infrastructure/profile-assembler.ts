import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ContactInformation } from '../domain/model/contact-information.value-object';
import { Profile } from '../domain/model/profile.entity';
import { ProfileResource, ProfileResponse } from './profile-response';

export class ProfileAssembler implements BaseAssembler<Profile, ProfileResource, ProfileResponse> {
  toEntitiesFromResponse(response: ProfileResponse): Profile[] {
    return response.profiles.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: ProfileResource): Profile {
    return new Profile({
      id: resource.id,
      userAccountId: resource.userAccountId,
      organizationId: resource.organizationId,
      firstName: resource.firstName,
      lastName: resource.lastName,
      documentNumber: resource.documentNumber,
      contactInformation: new ContactInformation({
        phoneNumber: resource.contactInformation.phoneNumber,
        secondaryEmail: resource.contactInformation.secondaryEmail,
        address: resource.contactInformation.address,
        district: resource.contactInformation.district,
        city: resource.contactInformation.city,
      }),
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
    });
  }

  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: entity.id,
      userAccountId: entity.userAccountId,
      organizationId: entity.organizationId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      documentNumber: entity.documentNumber,
      contactInformation: {
        phoneNumber: entity.contactInformation.phoneNumber,
        secondaryEmail: entity.contactInformation.secondaryEmail,
        address: entity.contactInformation.address,
        district: entity.contactInformation.district,
        city: entity.contactInformation.city,
      },
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
