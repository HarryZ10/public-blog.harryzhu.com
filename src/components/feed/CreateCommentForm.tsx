import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { toast } from 'react-hot-toast';
import { addComment } from "../../api/CommentsAPI";
import themes from "../../styles/themes";
import { useNavigate } from 'react-router-dom';

interface ComponentProps {
  post_id: string;
}

export interface JSONPayload {
  user_id: string;
  username: string;
  exp: number;
}

interface CommentData {
  user_id: string;
  post_id: string;
  comment_text: string;
  token: string | undefined;
}

const CreateCommentForm: React.FC<ComponentProps> = ({ post_id }) => {

    const [commentCreated, setCommentCreated] = useState(false);
    const [isPostable, setIsPostable] = useState(false);
    const [formStringData, setFormStringData] = useState('');
    const navigate = useNavigate();

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

    const confirmPost = async (post_id: string) => {

        if (isPostable) {
            try {
                const user_id = getUserIdFromToken();

                const commentData: CommentData = {
                    user_id: user_id,
                    post_id: post_id,
                    comment_text: formStringData,
                    token: Cookies.get('token')
                }

                if (user_id) {
                    await addComment(post_id, commentData)
                    .then((res) => {
                        if (res?.message) {
                            setCommentCreated(true);
                            toast.dismiss();
                            toast.success("Comment created. Refresh to see changes.");
                        }
                    })
                    .catch(err => {
                        if (err?.code == "ADD_COMMENTS_FAILED") {
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
        fontFamily: "Cabin",
        fontWeight: '400',
        fontSize: '16px',
        width: '100%',
        marginTop: '70px',
        marginLeft: '20px',
        backgroundColor: isPostable ? themes.dark.colors.submission : '#b193ca',
        color: themes.dark.colors.postText,
        borderColor: isPostable ? themes.dark.colors.submission : '#b193ca',
        borderRadius: '5px',
        transition: 'transform 0.3s, background-color 0.3s, border-color 0.3s',
        cursor: !isPostable ? 'not-allowed' : 'pointer'
    }

    const confirmPostButton: string = isPostable ? "hover-effect-button" : '';

    return (
        <>
            <Form>
                <Form.Group as={Row}>
                    <Col sm={8} style={{ padding: 0, marginTop: '20px' }}>
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
                    <Col sm={3} style={{ padding: 0 }}>
                        <StyledButton
                            style={modalButtonStyle}
                            className={confirmPostButton}
                            variant="primary"
                            onClick={() => confirmPost(post_id)}
                        >
                            Comment
                        </StyledButton>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

const StyledButton = styled(Button)<any>`
    @media (max-width: 768px) {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
        margin-left: 0 !important;
    }
`;

const CharacterCount = styled.div`
    font-size: 14px;
    margin-top: 5px;
    text-align: right;
`

const FormInputStyle = {
    backgroundColor: themes.dark.colors.modalTextInput,
    border: '1px solid #3D3D42',
    color: themes.dark.colors.postText,
    marginBottom: '10px',
}

export default CreateCommentForm;
