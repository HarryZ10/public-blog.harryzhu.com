import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { toast } from 'react-hot-toast';
import { addComment } from "../../api/CommentsAPI";
import themes from "../../styles/themes";
import { getUsername } from "../../api/UsersAPI";

interface ComponentProps {
  post_id?: string;
  handleNewComments: (commentData: any, id: string, date: string) => void;
}

export interface JSONPayload {
  user_id: string;
  username: string;
  exp: number;
}

interface CommentData {
  user_id: string;
  post_id?: string;
  comment_text: string;
  username?: string;
}

const CreateCommentForm: React.FC<ComponentProps> = ({ post_id, handleNewComments }) => {

    const [isPostable, setIsPostable] = useState(false);
    const [formStringData, setFormStringData] = useState('');

    useEffect(() => {
        if (formStringData.length <= 150) {
            setIsPostable(formStringData.trim() !== '');
        } else {
            setIsPostable(false);
        }
    }, [formStringData, formStringData.length]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormStringData(value);
    };

    const getUserIdFromToken = (): string => {
        const token = Cookies.get('token');
        let userid = '';
        if (token) {
            const decoded = jwtDecode<JSONPayload>(token);
            userid = decoded.user_id;
        }
        return userid;
    };

    const confirmPost = async (post_id?: string) => {

        if (isPostable) {
            try {
                const user_id = getUserIdFromToken();
                const username = await getUsername(user_id);
                const commentData: CommentData = {
                    user_id: user_id,
                    post_id: post_id || undefined,
                    comment_text: formStringData,
                    username: username,
                }

                if (user_id) {
                    await addComment(commentData, post_id)
                    .then((res) => {
                        if (res?.message) {
                            toast.dismiss();
                            toast.success("Comment created");
                            handleNewComments(commentData, res.id, res.date);
                        }
                    })
                    .catch(err => {
                        if (err?.code === "ADD_COMMENTS_FAILED") {
                            toast.dismiss();
                            toast.error(err?.message);
                        } else {
                            toast.dismiss();
                            toast.error("Failed to add comments: Please check console for more details.")
                        }
                    });
                }
            } catch (error) {
                toast.dismiss();
                toast.error("Comment error: " + error);
            }
        }
    }

    const modalButtonStyle: React.CSSProperties = {
        backgroundColor: isPostable ? themes.dark.colors.submission : '#b193ca',
        borderColor: isPostable ? themes.dark.colors.submission : '#b193ca',
        cursor: !isPostable ? 'not-allowed' : 'pointer',
        color: themes.dark.colors.postText,
    }

    const confirmPostButton: string = isPostable ? "hover-effect-button" : '';

    return (
        <>
            <Form>
                <Form.Group as={Row}>
                    <Col style={{ padding: 0, marginTop: '20px' }}>
                        <Form.Control
                            as="textarea"
                            name="commentContent"
                            className="comment-textarea"
                            value={formStringData}
                            onChange={handleInputChange}
                            placeholder="What's your counter flex?"
                            style={{
                                ...FormInputStyle, ...{
                                    border: 'none',
                                    fontSize: '17px',
                                }
                            }}
                            rows={3}
                        />
                        <CharacterCount
                            style={{
                                color: `${formStringData.length > 150 ? "#c9163a" : "#777"}`
                            }}
                        >
                            {formStringData.length} characters
                        </CharacterCount>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <StyledButton
                        style={{
                            ...modalButtonStyle,
                        }}
                        className={confirmPostButton}
                        variant="primary"
                        onClick={() => confirmPost(post_id)}
                    >
                        Comment
                    </StyledButton>
                </Form.Group>
            </Form>
        </>
    );
}

const StyledButton = styled(Button)<any>`
    @media (max-width: 960px) {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
        margin-left: 0 !important;
        width: 100% !important;
    }

    font-family: "Cabin";
    font-weight: 400;
    font-size: 16px;
    margin: 10px 0 15px auto;
    width: 60%;
    border-radius: 5px;
    transition: transform 0.3s, background-color 0.3s, border-color 0.3s
`;

const CharacterCount = styled.div`
    font-size: 14px;
    margin-top: 5px;
    text-align: right;
`;

const FormInputStyle = {
    backgroundColor: themes.dark.colors.modalTextInput,
    border: '1px solid #3D3D42',
    color: themes.dark.colors.postText,
    marginBottom: '10px',
    width: '100%',
};

export default CreateCommentForm;
