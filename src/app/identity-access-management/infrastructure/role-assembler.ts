import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Role } from '../domain/model/role.entity';
import { RoleName } from '../domain/model/role-name';
import { RoleResource, RoleResponse } from './role-response';

export class RoleAssembler implements BaseAssembler<Role, RoleResource, RoleResponse> {
  toEntitiesFromResponse(response: RoleResponse): Role[] {
    return response.roles.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RoleResource): Role {
    return new Role({
      id: resource.id,
      name: this.toRoleName(resource.name),
      description: resource.description,
    });
  }

  toResourceFromEntity(entity: Role): RoleResource {
    return { id: entity.id, name: entity.name, description: entity.description };
  }

  private toRoleName(value: string): RoleName {
    if (!Object.values(RoleName).includes(value as RoleName)) {
      throw new Error(`Unknown role name: ${value}`);
    }

    return value as RoleName;
  }
}
