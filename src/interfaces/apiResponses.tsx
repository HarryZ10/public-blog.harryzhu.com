// src/interfaces/apiResponses.tsx
import { PreprocessedPost, Comment } from "./post";

export interface RegisterResponse {
    message: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

export interface RetrieveUsernameResponse {
    message: string;
    username: string;
}

export interface CreatePostResponse {
    message: string;
    id?: string;
    date?: string;
}

export interface UpdateCommentResponse {
    comment_id: string;
    message: string;
}

export interface PostsResponse {
    results: PreprocessedPost[],
    message: string;
}

export interface GetCommentsResponse {
    results: Comment[],
    message: string,
}