import { ExtraInfo } from "./post"

export interface PostCard {
    post_id: string;
    post_text: string;
    post_date: string;
    user_id: string;
    additional_info: ExtraInfo;

    onDelete: (props: {
        id: string;
        post_text: string;
        post_date: string;
        user_id: string;
        additional_info: ExtraInfo;
    }) => void;

    onUpdate: (props: {
        id: string;
        post_text: string;
        post_date: string;
        user_id: string;
        additional_info: ExtraInfo;
    }) => void; 
}
