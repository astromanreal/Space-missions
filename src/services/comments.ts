
import { User } from './social';

export interface Comment {
    _id: string;
    content: string;
    author: Partial<User>;
    update: string; // ID of the MissionUpdate
    parentComment?: string; // ID of the parent comment if it's a reply
    replies: Comment[];
    createdAt: string;
    updatedAt: string;
}
