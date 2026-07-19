import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/** Marks a route as exempt from the global AuthGuard (e.g. /health, /auth/login). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
