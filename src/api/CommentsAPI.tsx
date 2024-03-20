// src/api/CommentsAPI.js
import Cookies from "js-cookie";
import ToastError from "../utils/ToastError";
import { GetCommentsResponse } from "../interfaces/apiResponses";

interface CommentData {
  user_id: string;
  post_id: string;
  comment_text: string;
  token: string | undefined;
}

const API_BASE_URL = process.env.REACT_APP_API_ROOT ?? 'http://10.10.10.25:80';

// Add comment to post
export const addComment = async (post_id: string, data: CommentData) => {
    const resp = await fetch(`${API_BASE_URL}/posts/${post_id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(data),
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

// Get comments by post id
export const getCommentsByPostId = async (post_id: string): Promise<GetCommentsResponse> => {
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
