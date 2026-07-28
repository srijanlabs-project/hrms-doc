import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { PeopleModule } from "../../people/people.module";
import { ConsentController } from "./consent.controller";
import { ConsentRepository } from "./consent.repository";
import { ConsentService } from "./consent.service";

@Module({
  imports: [AuthModule, PeopleModule],
  controllers: [ConsentController],
  providers: [ConsentService, ConsentRepository],
  exports: [ConsentService],
})
export class ConsentModule {}
