import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Card, Row, Col, Button, Collapse } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

import CreateCommentForm from "../CreateCommentForm";
import { PostCard as PCInfo} from "../../../interfaces/postCard";
import { JSONPayload } from "../CreateCommentForm";
import { getUsername } from "../../../api/UsersAPI";
import { getCommentsByPostId } from "../../../api/CommentsAPI";
import themes from "../../../styles/themes";

import useIntersectionObserver from "../../../utils/useIntersectionObserver";
import '../../../styles/fadein.css';

interface Comment {
    comment_text: string;
    id: string
    comment_date: string;
    post_id: string;
    user_id: string;
    username: string;
}

const PostCard: React.FC<PCInfo> = ({ post_id, post_text, post_date, user_id, additional_info, onDelete, onUpdate }) => {

    // Post Card Other Info collapse/show toggle
    const [openAdditionalInfo, setOpenAdditionalInfo] = useState(false);

    const [openCommentForm, setOpenCommentForm] = useState(false);

    // Get username info
    const [username, setUsername] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    // Comment data
    const [comments, setComments] = useState<Array<Comment>>([]);

    // Intersection Observer
    const [IOref, IOentry] = useIntersectionObserver({ threshold: 0.35, executeOnce: true });

    // Add initial transform/opacity classes if the entry is not intersecting.
    const addInitial = !IOentry?.isIntersecting;

    useEffect(() => {
        const fetchCommentsAndUsernames = async () => {
            await getCommentsByPostId(post_id)
            .then(async resp => {
                 // Create a new array to store comments with usernames
                let commentsWithUsernames: Array<Comment> = [];

                for (let comment of resp?.results) {

                    // Fetch the username for each comment
                    let username = await fetchUsername(comment.user_id);

                    // Create a new comment object including the username
                    commentsWithUsernames.push({ ...comment, username });
                }

                setComments(commentsWithUsernames);
            })
            .catch(err => {
                if (err?.code == "GET_COMMENTS_FAILED") {
                    toast.error(err?.message);
                } else {
                    toast.error("Failed to get comments: Please check console for more details.")
                }
            });
        }

        fetchCommentsAndUsernames();
    }, [post_id]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            const userObject = jwtDecode<JSONPayload>(token);
            const userid = userObject.user_id;
            setCurrentUserId(userid);
        }
    }, [user_id])

    useEffect(() => {
        const fetchUsername = async () => {
            const resp = await getUsername(user_id);
            setUsername(resp);
        };

        fetchUsername();
    }, [user_id]);

    // Job offer info
    const jobOfferInfo = additional_info?.jobOfferInfo;

    // Handles delete and updates
    // eslint-disable-next-line
    const handleDelete = () => {
        onDelete({ id: post_id, post_text, post_date, user_id, additional_info });
    };

    const handleUpdate = () => {
        onUpdate({ id: post_id, post_text, post_date, user_id, additional_info });
    };

    const formatCurrency = (value: string): string => {
        const numberValue = parseInt(value);
        if (isNaN(numberValue)) {
            // Handle NaN, could return '$0.00' or any default value you see fit
            return '$0.00';
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(numberValue);
    }; 

     return (
        <StyledCard
            style={PostCardStyle}
            id="post-card-index"
            ref={IOref}
            className={`fade-in ${addInitial ? "fade-in-initial" : ""}`.trim()}
        >
            <Card.Header style={CardBorderStyle}>Post from {username} on {post_date}</Card.Header>
            <Card.Body style={CardBorderStyle}>
                <Card.Title>Job Offer Details</Card.Title>
                <Card.Text>{post_text}</Card.Text>
                <hr style={{ 
                    borderColor: themes.dark.colors.cardBorder,
                    borderTop: '0.5px solid' }} />

                {jobOfferInfo && (
                    <div style={{ paddingBottom: '20px' }}>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Base Salary:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{formatCurrency(jobOfferInfo.baseSalary)}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Sign-on Bonus:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{formatCurrency(jobOfferInfo.signOnBonus)}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Equity:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{formatCurrency(jobOfferInfo.equity)}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Unlimited PTO:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.unlimitedPTO ? 'Yes' : 'No'}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>401k Available:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.has401k ? 'Yes' : 'No'}</Col>
                        </Row>

                         <a href="#!" onClick={(e) => {
                                 e.preventDefault();
                                 setOpenAdditionalInfo(!openAdditionalInfo);
                             }}
                             style={{
                                 textDecoration: 'none',
                                 color: 'inherit',
                                 paddingTop: '20px',
                                 paddingBottom: '5px',
                                 cursor: 'pointer',
                                 display: 'inline-block'
                             }}
                         >
                             {openAdditionalInfo ? 'Hide Details' : 'Show Details'}
                         </a>

                        <Collapse in={openAdditionalInfo}>
                            <div id="job-offer-info-collapse">
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Medical Insurance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.healthInsurance.medical ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Dental Insurance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.healthInsurance.dental ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Vision Insurance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.healthInsurance.vision ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Flexible Work Hours:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.flexibleWorkHours ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Remote Work Options:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.remoteWorkOptions ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Relocation Assistance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.relocationAssistance ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Maternity/Paternity Leave:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.maternityPaternityLeave ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Gym Membership:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.gymMembership ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Tuition Assistance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.tuitionAssistance ? 'Yes' : 'No'}</Col>
                                </Row>
                            </div>
                        </Collapse>
                     </div>
                )}

                <Card.Footer style={CardBorderStyle}>
                    <Row>
                        <Col xs={6} md={9} style={{ padding: 0 }} className="d-flex justify-content-start">

                            {currentUserId === user_id && (
                                <Button
                                    onClick={handleUpdate}
                                    style={EditButtonStyle}
                                >
                                    Edit
                                </Button>
                            )}
                        </Col>

                        <Col xs={6} md={3} style={{ padding: 0 }}
                            className="d-flex justify-content-end">

                            {currentUserId === user_id && (
                                <ActionButton style={DeleteButtonStyle} onClick={handleDelete}>Delete</ActionButton>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <CreateCommentForm post_id={post_id} />
                    </Row>

                    {comments && comments.map(co => (
                        <Row className="align-items-center my-2">
                            <Col xs={4} sm={4} md={3} className="text-truncate">
                                <strong>{co.username}:</strong>
                            </Col>
                            <Col xs={8} sm={8} md={9} className="text-break">
                                {co.comment_text}
                            </Col>
                        </Row>
                    ))}

                </Card.Footer>
            </Card.Body>
        </StyledCard>
    )
}

export default PostCard;

const fetchUsername = async (user_id: string): Promise<string> => {
    const username = await getUsername(user_id);
    return username;
}

const StyledCard = styled(Card)`
    @media (max-width: 768px) {
        width: 80% !important;
    }
`;

const ActionButton = styled(Button)`
    color: ${props => props.theme.dark.colors.postText};

    @media (max-width: 1024px) { // For larger screens
        width: 150px !important;
    }

    @media (max-width: 480px) { // For mobile phones
        width: 100px !important;
    }
`;

const PostCardStyle = {
    width: "50%",
    margin: "0 auto",
    marginBottom: "50px",
    marginTop: "50px",
    backgroundColor: themes.dark.colors.postBackground,
    color: themes.dark.colors.postText,
    borderRadius: '5px',
}

const CardBorderStyle = {
    borderColor: themes.dark.colors.cardBorder,
}

// eslint-disable-next-line
const DeleteButtonStyle: React.CSSProperties = {
    backgroundColor: themes.dark.colors.danger,
    border: themes.dark.colors.danger,
    width: '100%'
}

const EditButtonStyle: React.CSSProperties = {
    backgroundColor: themes.dark.colors.submission,
    border: themes.dark.colors.danger,
    width: '150px',
}