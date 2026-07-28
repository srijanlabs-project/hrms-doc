import { Injectable, RequestMethod } from "@nestjs/common";
import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../auth/decorators/public.decorator";
import { ROLES_KEY } from "../../auth/decorators/roles.decorator";

export interface PermissionMatrixRow {
  module: string;
  method: string;
  path: string;
  access: string;
}

function joinPath(controllerPath: string, methodPath: string): string {
  const combined = `/${controllerPath}/${methodPath}`.replace(/\/+/g, "/");
  return combined.length > 1 ? combined.replace(/\/$/, "") : combined;
}

/**
 * W1·E03 Identity and Access — permissions matrix. Reads the app's real,
 * running authorization state directly from every controller's @Roles()/
 * @Public() decorator metadata via Nest's DiscoveryService, rather than a
 * hand-maintained document that would drift from the actual `@Roles(...)`
 * gates scattered across ~50 controllers. Stands in for the spec's full
 * governed permission catalog (versioning, deprecation, risk tiers, SoD
 * mapping) — this codebase's real authorization model is 4 coarse
 * role strings checked by one guard, not a queryable permission-object
 * graph, so a read-only "what can each role do" report is the honest
 * buildable slice.
 */
@Injectable()
export class PermissionsMatrixService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  getMatrix(): PermissionMatrixRow[] {
    const rows: PermissionMatrixRow[] = [];

    for (const wrapper of this.discoveryService.getControllers()) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const controllerPath: string = Reflect.getMetadata(PATH_METADATA, metatype) ?? "";
      const moduleName = metatype.name.replace(/Controller$/, "");
      const classRoles = this.reflector.get<string[] | undefined>(ROLES_KEY, metatype);
      const classPublic = this.reflector.get<boolean | undefined>(IS_PUBLIC_KEY, metatype);

      const prototype = Object.getPrototypeOf(instance);
      for (const methodName of this.metadataScanner.getAllMethodNames(prototype)) {
        const handler = prototype[methodName];
        const httpMethod: number | undefined = Reflect.getMetadata(METHOD_METADATA, handler);
        if (httpMethod === undefined) continue;

        const methodPath: string = Reflect.getMetadata(PATH_METADATA, handler) ?? "";
        const methodRoles = this.reflector.get<string[] | undefined>(ROLES_KEY, handler);
        const methodPublic = this.reflector.get<boolean | undefined>(IS_PUBLIC_KEY, handler);

        const roles = methodRoles ?? classRoles;
        const isPublic = methodPublic ?? classPublic ?? false;

        rows.push({
          module: moduleName,
          method: RequestMethod[httpMethod] ?? String(httpMethod),
          path: joinPath(controllerPath, methodPath),
          access: isPublic ? "Public (no auth)" : roles && roles.length > 0 ? roles.join(", ") : "Any authenticated user",
        });
      }
    }

    return rows.sort((a, b) => a.module.localeCompare(b.module) || a.path.localeCompare(b.path));
  }
}
