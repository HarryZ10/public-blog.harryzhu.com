// src/api/PostsAPI.js
import Cookies from "js-cookie";
import { CreatePostResponse, UpdateCommentResponse, PostsResponse } from "../interfaces/apiResponses";
import { CreatePostData } from "../interfaces/post";
import ToastError from "../utils/ToastError";

const API_BASE_URL = process.env.REACT_APP_API_ROOT ?? 'http://10.10.10.25:80';

// Get all posts
export const getAllPosts = async (): Promise<PostsResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
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
                    `${err?.message || ''}`,
                    'GET_POSTS_FAILED'
                );
                throw error;
            });
        }
    })
    .catch((err) => {
        throw err;
    });

    return response
};

export const getAllPostsByMe = async (): Promise<PostsResponse> => {
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
    })
    .then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `${err?.message}`,
                    'GET_POSTS_BY_USER_FAILED'
                );
                throw error;
            });
        }
    })
    .catch(err => {
        throw err;
    })

    return response;
};

// Create a new post
export const createPost = async (data: CreatePostData): Promise<CreatePostResponse> => {

    const response: CreatePostResponse = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(data),

    }).then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to create post: ${err?.message}`,
                    'CREATE_POST_FAILED'
                );
                throw error;
            });
        }
    })
    .catch(err => {
        throw err;
    });

    return response;
};

// Update an existing post
export const updatePost = async (data: CreatePostData): Promise<UpdateCommentResponse> => {

    const response: UpdateCommentResponse = await fetch(`${API_BASE_URL}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            ...data,
            token: Cookies.get('token'),
        }), 
    }).then(async (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to update post: ${err?.message}`,
                    'UPDATE_POST_FAILED'
                );
                throw error;
            });
        }
    }).catch(err => {
        throw err;
    })

    return response;
};

// Delete an existing post
export const deletePost = async (id: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            "user_id": userId,
            "id": id,
            "token": Cookies.get('token')
        })

    }).then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to delete post: ${err?.message}`,
                    'DELETE_POST_FAILED'
                );
                throw error;
            });
        }
    }).catch(err => {
        throw err;
    })

    return response;
};
