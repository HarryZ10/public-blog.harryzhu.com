import { ExtraInfo } from "./post"

export interface PostCard {
    post_id?: string;
    post_text: string;
    post_date?: string;
    user_id: string;
    additional_info: ExtraInfo;

    onDelete: () => void;
    onUpdate: () => void; 
}
