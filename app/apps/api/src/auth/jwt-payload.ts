export interface JwtPayload {
  sub: string;
  tenantId: string;
  sid: string;
  roles: string[];
}
