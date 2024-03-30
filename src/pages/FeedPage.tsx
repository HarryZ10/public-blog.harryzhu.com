import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import CreatePostForm from '../components/feed/CreatePostForm';
import NavBar from '../components/layout/NavBar';
import PostCard from '../components/feed/post/PostCard';
import ActionPlus from '../components/layout/ActionPlus';

import { Post } from '../interfaces/post';
import { usePosts } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';

interface FeedProps {
    isProfileMode: boolean,
}

const FeedPage: React.FC<FeedProps> = ({ isProfileMode }) => {

    const { user, login, logout } = useAuth();
    const history = useNavigate();;

    if (!user) {
        history("/login");
        toast.dismiss();
        toast.error("Unauthenticated")
    }

    const { posts, loading, error, fetchPosts, createPost, updatePost, deletePost } = usePosts();

    const [postId, setPostId] = useState('');
    const [formPostData, setFormPostData] = useState<Post>({
        id: '',
        user_id: '',
        project_id: '',
        post_text: '',
        post_date: '',
        extra: {
            jobOfferInfo: {
                baseSalary: '',
                equity: '',
                signOnBonus: '',
                otherOptions: {
                    unlimitedPTO: false,
                    has401k: false,
                    healthInsurance: {
                        medical: false,
                        dental: false,
                        vision: false
                    },
                    flexibleWorkHours: false,
                    remoteWorkOptions: false,
                    relocationAssistance: false,
                    maternityPaternityLeave: false,
                    gymMembership: false,
                    tuitionAssistance: false,
                }
            }
        }
    });

    const [show, setShow] = useState(false);
    const handleFormClose = () => {
        setShow(false);
        setPostId('');
        setFormPostData({
            id: '',
            user_id: '',
            project_id: '',
            post_text: '',
            post_date: '',
            extra: {
                jobOfferInfo: {
                    baseSalary: '',
                    equity: '',
                    signOnBonus: '',
                    otherOptions: {
                        unlimitedPTO: false,
                        has401k: false,
                        healthInsurance: {
                            medical: false,
                            dental: false,
                            vision: false
                        },
                        flexibleWorkHours: false,
                        remoteWorkOptions: false,
                        relocationAssistance: false,
                        maternityPaternityLeave: false,
                        gymMembership: false,
                        tuitionAssistance: false,
                    }
                }
            }
        });
    };

    useEffect(() => {
        fetchPosts(isProfileMode);
    }, [isProfileMode]);

    const handleUpdatePost = async (data: Post) => {
        setPostId(data.id);
        setFormPostData(data);
        setShow(!show);
    };

    const handleDeletePost = async (postId: string, userId: string) => {
        await deletePost(postId, userId);
        await fetchPosts(isProfileMode);
    };

    const handleFormShow = () => setShow(true);

    if (loading) {
        toast.dismiss();
        toast.loading("Loading...");
    }

    return (
        <div>
            <NavBar />
            <PageTitle>
                {!isProfileMode ? "Flexes for you." : "My Stuff"}
            </PageTitle>
            {Array.isArray(posts) && posts
                .sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime())
                .map(post => (
                    <PostCard
                        key={post.id}
                        post_id={post.id}
                        post_text={post.post_text}
                        post_date={post.post_date}
                        user_id={post.user_id}
                        additional_info={post.extra}
                        onDelete={() => handleDeletePost(post.id, post.user_id)}
                        onUpdate={() => handleUpdatePost(post)}
                    />
                ))
            }
            { !isProfileMode ? <ActionPlus id="create-post" onClick={handleFormShow} /> : <></> }

            <CreatePostForm
                show={show}
                handleClose={handleFormClose}
                id={postId}
                initialFormData={formPostData}
            />

        </div>
    );
};

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.skyblueHighlight };
    font-size: 82px;
    line-height: 72px;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 5rem;
    padding: '28px 0 16px';
`;

export default FeedPage;
