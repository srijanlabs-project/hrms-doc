import { DiscoveryModule } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { PermissionsMatrixController } from "./permissions-matrix.controller";
import { PermissionsMatrixService } from "./permissions-matrix.service";

@Module({
  imports: [DiscoveryModule],
  controllers: [PermissionsMatrixController],
  providers: [PermissionsMatrixService],
})
export class PermissionsMatrixModule {}
