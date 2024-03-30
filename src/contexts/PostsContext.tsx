import React, { useContext, useState, createContext } from 'react';
import toast from "react-hot-toast";
import { ExtraInfo, Post } from '../interfaces/post';
import { getAllPosts, createPost, updatePost, deletePost, getAllPostsByMe } from '../api/PostsAPI';
import { CreatePostResponse } from '../interfaces/apiResponses';

interface PostsContextProps {
    posts: Post[];
    loading: boolean;
    error: string | null;
    fetchPosts: (isProfileMode: boolean) => Promise<void>;
    createPost: (postData: Post) => Promise<void>;
    updatePost: (postData: Post) => Promise<void>;
    deletePost: (postId: string, userId: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextProps | undefined>(undefined);

export const usePosts = () => {
    const ctx = useContext(PostsContext);
    if (!ctx) {
        throw new Error("usePosts must be in a PostsProvider");
    }
    return ctx
};

export const PostsProvider: React.FC<any> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
 
    const fetchPosts = async (isProfileMode: boolean) => {
        try {
            const fetchFn = isProfileMode ? getAllPostsByMe : getAllPosts;
            const res = await fetchFn()
                .then((resp) => {
                    toast.dismiss();
                    // toast.success("Successfully loaded all posts")
                    return resp;
                });

            if (res?.message === "Success") {
                const postsWithParsedExtra: Post[] = res.results.map((post) => {
                    const extraInfo: ExtraInfo = JSON.parse(post.extra);
                    return { ...post, extra: extraInfo };
                });

                setPosts(postsWithParsedExtra);
                setLoading(false);
            } else {
                console.error("Can not load posts");
            }

        } catch (err: any) {
            setError(err?.message);
            if (err?.code === "GET_POSTS_FAILED" || err?.code === "GET_POSTS_BY_USER_FAILED") {
                console.error(err?.message);
            } else {
                console.error(`Failed to refresh feed`)
            }
            setLoading(false);
        }
    };

    const createPostSDK = async (postData: Post) => {
        try {
            const res: CreatePostResponse = await createPost(postData);
            if (res?.message === "Success") {
                toast.dismiss();
                toast.success("Post created successfully");
            } else {
                toast.dismiss();
                toast.error("Failed to create post");
            }
        } catch (err: any) {
            setError(err?.message);
            if (err?.code === "CREATE_POST_FAILED") {
                toast.dismiss();
                toast.error(err?.message);
            } else {
                toast.dismiss();
                toast.error("Failed to create post: Please check console for more details.")
            }
        }
    };

    const updatePostSDK = async (postData: Post) => {
        try {
            const res = await updatePost(postData);
            if (res?.message === 'Success') {
                toast.dismiss();
                toast.success('Post updated successfully!');
            } else {
                toast.dismiss();
                toast.error('Failed to update post');
            }
        } catch (err: any) {
            setError(err?.message);
            if (err?.code === "UPDATE_POST_FAILED") {
                toast.dismiss();
                toast.error(err?.message);
            } else {
                toast.dismiss();
                toast.error("Failed to update post: Please check console for more details.")
            }
        }
    };

    const deletePostSDK = async (postId: string, userId: string) => {
        try {
            const res = await deletePost(postId, userId);
            if (res?.message === 'Success') {
                toast.dismiss();
                toast.success('Post deleted successfully!');
            } else {
                toast.dismiss();
                toast.error('Failed to delete post');
            }
        } catch (err: any) {
            setError(err?.message);
            if (err?.code === "DELETE_POST_FAILED") {
                toast.dismiss();
                toast.error(err?.message);
            } else {
                toast.dismiss();
                toast.error("Failed to delete post: Please check console for more details.")
            }
        }
    };

    return (
        <PostsContext.Provider
            value={{
                posts,
                loading,
                error,
                fetchPosts,
                createPost: createPostSDK,
                updatePost: updatePostSDK,
                deletePost: deletePostSDK,
            }}
        >
            {children}
        </PostsContext.Provider>
    )
};
