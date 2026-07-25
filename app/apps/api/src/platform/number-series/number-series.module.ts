import { Global, Module } from "@nestjs/common";
import { NumberSeriesController } from "./number-series.controller";
import { NumberSeriesRepository } from "./number-series.repository";
import { NumberSeriesService } from "./number-series.service";

/** Foundation & Platform (E00) — Number Series engine. Global so any module can inject NumberSeriesService without re-importing it. */
@Global()
@Module({
  controllers: [NumberSeriesController],
  providers: [NumberSeriesService, NumberSeriesRepository],
  exports: [NumberSeriesService],
})
export class NumberSeriesModule {}
