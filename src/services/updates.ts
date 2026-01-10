
import { User } from "./social";
import { SpaceMission } from "./space-missions";

export interface MissionUpdate {
    _id: string;
    title: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    mission: Partial<SpaceMission>;
    author: Partial<User>;
    createdAt: string;
}
