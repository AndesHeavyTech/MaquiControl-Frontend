import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Organization } from '../domain/model/organization.entity';
import { OrganizationType } from '../domain/model/organization-type';
import { OrganizationResource, OrganizationResponse } from './organization-response';

export class OrganizationAssembler
  implements BaseAssembler<Organization, OrganizationResource, OrganizationResponse>
{
  toEntitiesFromResponse(response: OrganizationResponse): Organization[] {
    return response.organizations.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: OrganizationResource): Organization {
    return new Organization({
      id: resource.id,
      legalName: resource.legalName,
      tradeName: resource.tradeName,
      taxId: resource.taxId,
      type: this.toOrganizationType(resource.type),
      address: resource.address,
    });
  }

  toResourceFromEntity(entity: Organization): OrganizationResource {
    return {
      id: entity.id,
      legalName: entity.legalName,
      tradeName: entity.tradeName,
      taxId: entity.taxId,
      type: entity.type,
      address: entity.address,
    };
  }

  private toOrganizationType(value: string): OrganizationType {
    if (!Object.values(OrganizationType).includes(value as OrganizationType)) {
      throw new Error(`Unknown organization type: ${value}`);
    }

    return value as OrganizationType;
  }
}
