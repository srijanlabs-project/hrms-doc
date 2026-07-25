import { SetMetadata } from "@nestjs/common";

export const ALLOW_SEPARATED_KEY = "allowSeparated";

/** Exempts a route from ExitStatusGuard so a Separated/Archived employee can still reach it (e.g. logout, their own exit summary). */
export const AllowSeparated = () => SetMetadata(ALLOW_SEPARATED_KEY, true);
