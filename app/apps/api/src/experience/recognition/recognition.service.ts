import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import type { GiveRecognitionDto } from "./dto/give-recognition.dto";
import { RecognitionRepository } from "./recognition.repository";

const DEFAULT_POINTS = 10;

/**
 * v1 slice — see schema.prisma's Recognition comment. Peer-to-peer only, no
 * manager/admin approval workflow (no abuse signal yet to justify one). No
 * redemption catalog — points is a running counter, not "rewards".
 */
@Injectable()
export class RecognitionService {
  constructor(
    private readonly repository: RecognitionRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async give(dto: GiveRecognitionDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    if (dto.toEmployeeId === employee.id) {
      throw new ValidationAppError([{ field: "toEmployeeId", code: "SELF_RECOGNITION", message: "You cannot recognize yourself." }]);
    }

    const recipient = await this.employeeRepository.findById(tenantId, dto.toEmployeeId);
    if (!recipient) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Recipient employee not found.");
    }

    const recognition = await this.repository.create(tenantId, {
      fromEmployeeId: employee.id,
      toEmployeeId: dto.toEmployeeId,
      value: dto.value,
      message: dto.message,
      points: dto.points ?? DEFAULT_POINTS,
    });

    const recipientUser = await this.authRepository.findUserByEmployeeId(tenantId, dto.toEmployeeId);
    if (recipientUser) {
      await this.notificationService.notify(tenantId, recipientUser.id, {
        type: "experience.recognition.created",
        title: "You've been recognized!",
        body: `${employee.legalName} recognized you for ${dto.value}: "${dto.message}"`,
        linkPath: "/experience",
      });
    }

    return recognition;
  }

  async feed() {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.repository.findFeed(tenantId);
  }

  async listReceivedByMe() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findReceivedByEmployee(tenantId, employee.id);
  }

  async listGivenByMe() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findGivenByEmployee(tenantId, employee.id);
  }
}
