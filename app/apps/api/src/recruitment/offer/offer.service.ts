import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuthRepository } from "../../auth/auth.repository";
import { OnboardingCaseRepository } from "../../onboarding/onboarding-case.repository";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { NumberSeriesService } from "../../platform/number-series/number-series.service";
import { ApplicationRepository } from "../candidate/application.repository";
import { BackgroundCheckRepository } from "./background-check.repository";
import type { CompleteBackgroundCheckDto } from "./dto/complete-background-check.dto";
import type { CreateOfferDto } from "./dto/create-offer.dto";
import type { InitiateBackgroundCheckDto } from "./dto/initiate-background-check.dto";
import { OfferRepository } from "./offer.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-OFFER-001",
    code: "OFFER-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-OFFER",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/06-recruitment-and-ats/08-offer-management.md:
 * Draft -> Approved -> Issued -> Accepted/Declined -> Converted. No
 * negotiation/counter-offer workflow, no expiry timer, no offer-letter
 * document generation, one flat monthlyBasic instead of a component/clause
 * system — see schema.prisma's Offer comment for the full collapse.
 * Converting an Accepted offer creates a Draft Employee (employeeCode comes
 * from the Number Series engine's "Employee" series, an "NH-####" sequence
 * by default), a login-capable User
 * (roles: ["employee"], so the new hire can sign in and see their
 * onboarding case via OTP the same way every other seeded user does — real
 * account provisioning timing/IT-ticket integration is deferred), and an
 * OnboardingCase with the fixed v1 checklist. Background verification (an
 * L2 dependency named inside this spec, not its own deep-spec) is one
 * admin-recorded check per offer; a Flagged result blocks conversion below.
 */
@Injectable()
export class OfferService {
  constructor(
    private readonly repository: OfferRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly onboardingCaseRepository: OnboardingCaseRepository,
    private readonly authRepository: AuthRepository,
    private readonly backgroundCheckRepository: BackgroundCheckRepository,
    private readonly requestContext: RequestContextService,
    private readonly numberSeries: NumberSeriesService,
  ) {}

  async list() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async getById(id: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.findOrThrow(tenantId, id);
  }

  async create(dto: CreateOfferDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, dto.applicationId, {
        monthlyBasic: dto.monthlyBasic,
        joiningDate: new Date(dto.joiningDate),
      });
    } catch {
      throw stateConflict("This application already has an offer.", "Duplicate");
    }
  }

  async approve(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const offer = await this.findOrThrow(tenantId, id);
    if (offer.status !== "Draft") {
      throw stateConflict("Only Draft offers can be approved.", offer.status);
    }
    return this.repository.updateStatus(tenantId, id, {
      status: "Approved",
      approvedByUserId: userId,
      approvedAt: new Date(),
    });
  }

  async issue(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const offer = await this.findOrThrow(tenantId, id);
    if (offer.status !== "Approved") {
      throw stateConflict("Only Approved offers can be issued.", offer.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Issued", issuedAt: new Date() });
  }

  async respond(id: string, accepted: boolean, declineReason?: string) {
    const { tenantId } = this.requireAuthenticated();
    const offer = await this.findOrThrow(tenantId, id);
    if (offer.status !== "Issued") {
      throw stateConflict("Only Issued offers can receive a candidate response.", offer.status);
    }
    return this.repository.updateStatus(tenantId, id, {
      status: accepted ? "Accepted" : "Declined",
      respondedAt: new Date(),
      declineReason: accepted ? undefined : declineReason,
    });
  }

  async initiateBackgroundCheck(offerId: string, dto: InitiateBackgroundCheckDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    await this.findOrThrow(tenantId, offerId);
    const existing = await this.backgroundCheckRepository.findByOfferId(tenantId, offerId);
    if (existing) {
      throw stateConflict("A background check has already been initiated for this offer.", existing.status);
    }
    return this.backgroundCheckRepository.create(tenantId, offerId, {
      checkType: dto.checkType ?? "Comprehensive",
      initiatedByUserId: userId,
    });
  }

  async completeBackgroundCheck(offerId: string, dto: CompleteBackgroundCheckDto) {
    const { tenantId } = this.requireAuthenticated();
    await this.findOrThrow(tenantId, offerId);
    const check = await this.backgroundCheckRepository.findByOfferId(tenantId, offerId);
    if (!check) {
      throw new NotFoundAppError("OBJ-BACKGROUND-CHECK", "No background check has been initiated for this offer.");
    }
    if (check.status !== "Pending") {
      throw stateConflict("This background check has already been completed.", check.status);
    }
    return this.backgroundCheckRepository.updateResult(tenantId, check.id, {
      status: dto.status,
      remarks: dto.remarks,
      completedAt: new Date(),
    });
  }

  async convert(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const offer = await this.findOrThrow(tenantId, id);
    if (offer.status !== "Accepted") {
      throw stateConflict("Only Accepted offers can be converted.", offer.status);
    }
    const backgroundCheck = await this.backgroundCheckRepository.findByOfferId(tenantId, id);
    if (backgroundCheck?.status === "Flagged") {
      throw stateConflict(
        "This offer's background check was flagged and must be resolved before conversion.",
        "BackgroundFlagged",
      );
    }

    const employeeCode = await this.numberSeries.next(tenantId, "Employee");
    const employee = await this.employeeRepository.create(tenantId, {
      employeeCode,
      legalName: offer.application.candidate.fullName,
      personalEmail: offer.application.candidate.email,
      departmentId: offer.application.requisition.departmentId,
      managerId: offer.application.requisition.hiringManagerId,
      status: "Draft",
      joiningDate: offer.joiningDate,
    });

    await this.onboardingCaseRepository.createForEmployee(tenantId, employee.id);
    await this.applicationRepository.updateStage(tenantId, offer.application.id, { stage: "Hired" });
    try {
      await this.authRepository.createUser(tenantId, {
        email: offer.application.candidate.email,
        roles: ["employee"],
        employeeId: employee.id,
      });
    } catch (err) {
      // Only swallow the one expected case: this email already has a user
      // account in this tenant (e.g. rehire) — Employee/OnboardingCase still
      // get created; account linking is a manual HR follow-up there. Any
      // other failure (e.g. a transient DB error) must not be hidden.
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
    }

    return this.repository.updateStatus(tenantId, id, { status: "Converted", convertedEmployeeId: employee.id });
  }

  private async findOrThrow(tenantId: string, id: string) {
    const offer = await this.repository.findById(tenantId, id);
    if (!offer) {
      throw new NotFoundAppError("OBJ-OFFER", "Offer not found.");
    }
    return offer;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
