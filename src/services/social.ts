
import { SpaceMission } from "./space-missions";

/**
 * Represents user data returned from the /api/auth/me or /api/auth/user/:id endpoints.
 */
export interface User {
    _id: string; 
    username: string;
    name?: string;
    email: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
    trackedMissions?: Partial<SpaceMission>[]; // Missions can be partial for summary views
}
