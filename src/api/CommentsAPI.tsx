// src/api/CommentsAPI.js
import Cookies from "js-cookie";
import ToastError from "../utils/ToastError";
import { GetCommentsResponse } from "../interfaces/apiResponses";

export interface UpdateCommentData {
    id: string;
    user_id: string;
    post_id: string;
    comment_text: string;
    comment_date: string;
}

export interface CommentData {
    user_id: string;
    post_id?: string;
    username?: string;
    comment_text: string;
}

const API_BASE_URL = process.env.REACT_APP_API_ROOT ?? 'http://10.10.10.25:80';

// Add comment to post
export const addComment = async (data: CommentData, post_id?: string) => {
    const resp = await fetch(`${API_BASE_URL}/posts/${post_id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            ...data,
            token: Cookies.get("token"),
        }),
    })
    .then(async (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to add comment: ${err?.message}`,
                    'ADD_COMMENT_FAILED'
                );
                throw error;
            });
        }
    })
    .catch((err) => {
        throw err;
    });

    return resp;
};


// Update comment to post
export const updateComment = async (data: UpdateCommentData) => {
    const resp = await fetch(`${API_BASE_URL}/comments/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            ...data,
            token: Cookies.get("token"),
        }),
    })
    .then(async (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to update comment: ${err?.message}`,
                    'UPDATE_COMMENT_FAILED'
                );
                throw error;
            });
        }
    })
    .catch((err) => {
        throw err;
    });

    return resp;
};

export const deleteComment = async (data: UpdateCommentData) => {
    const resp = await fetch(`${API_BASE_URL}/comments/${data.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            ...data,
            token: Cookies.get("token"),
        }),
    })
    .then(async (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to delete comment: ${err?.message}`,
                    'DELETE_COMMENT_FAILED'
                );
                throw error;
            });
        }
    })
    .catch((err) => {
        throw err;
    });

    return resp;
};

// Get comments by post id
export const getCommentsByPostId = async (post_id: string | undefined): Promise<GetCommentsResponse> => {
    const resp = await fetch(`${API_BASE_URL}/posts/${post_id}/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
    })
    .then(async (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to get comments: ${err?.message}`,
                    'GET_COMMENTS_FAILED'
                );
                throw error;
            });
        }
    })
    .catch((err) => {
        throw err;
    });

    return resp;
};
