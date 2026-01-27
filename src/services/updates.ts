
import { User } from "./social";
import { SpaceMission } from "./space-missions";
import { Comment } from "./comments";


export interface MissionUpdate {
    _id: string;
    title: string;
    content: string;
    referenceLink: string;
    status: 'pending' | 'approved' | 'rejected';
    mission: Partial<SpaceMission>;
    author: Partial<User>;
    createdAt: string;
    likes: Partial<User>[]; // Array of User Objects
    comments: Comment[];
}
