import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Card, Row, Col, Button, Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { Button as MoreActionButton, Dropdown, Space } from "antd";
import { DownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';

import CreateCommentForm from "../CreateCommentForm";
import { PostCard as PCInfo} from "../../../interfaces/postCard";
import CommentList from "./CommentList";
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
    const [openComments, setOpenComments] = useState(false);

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
                console.error(`Failed to get comments on ${post_id}`);
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
            await getUsername(user_id)
                .then((res) => {
                    setUsername(res);
                })
                .catch((err: any) => {
                    console.error(err?.message);
                })
        };

        fetchUsername();
    }, [user_id]);

    // Job offer info
    const jobOfferInfo = additional_info?.jobOfferInfo;

    // Handles delete and updates
    // eslint-disable-next-line
    const handleDelete = () => {
        onDelete();
    };

    const handleUpdate = () => {
        onUpdate();
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

    const handleCommentUpdates = (commentData: any) => {
        setComments(comments.filter((comment) => comment.id !== commentData.id));
    };

    const handleNewComments = (commentData: any, id: string, date: string) => {
        const newComment = { ...commentData, id};

        // Soft reload
        setComments((prevComments) => [
            ...prevComments.filter((comment) => comment.id !== id),
            {
                id: id,
                comment_date: date,
                comment_text: commentData.comment_text,
                post_id: commentData.post_id,
                user_id: commentData.user_id,
                username: commentData.username,
            }
        ]);

    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1') {
            handleUpdate();
        } else if (e.key == '2') {
            handleDelete();
        }
    };

    const items: MenuProps['items'] = [
        {
            label: 'Edit',
            key: '1',
            icon: <EditOutlined />,
        },
        {
            label: 'Delete',
            key: '2',
            icon: <DeleteOutlined />,
            danger: true,
        }, 
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <StyledCard
            style={PostCardStyle}
            id="post-card-index"
            ref={IOref}
            className={`fade-in ${addInitial ? "fade-in-initial" : ""}`.trim()}
        >
            <Card.Header style={CardBorderStyle}>
                <Row>
                    <Col xs={8} md={8} lg={9}>
                        Post from
                        <Link
                            to={`/profile/${user_id}`}
                            className="px-1"
                            style={{
                            textDecoration: 'none',
                            color: '#9f66e3',
                            }}
                        >
                            {username}
                        </Link>
                        on {post_date}
                    </Col>
                    <Col xs={4} md={4} lg={3}>
                        {/* More Actions for Author */}
                        {currentUserId === user_id && (
                            <Dropdown menu={menuProps}>
                            <MoreActionButtonStyled>
                                <Space>
                                Actions
                                <DownOutlined />
                                </Space>
                            </MoreActionButtonStyled>
                            </Dropdown>
                        )}
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body style={CardBorderStyle}>
                <Card.Title>Job Offer Details</Card.Title>
                <Card.Text>{post_text}</Card.Text>

                {jobOfferInfo && (
                    <>
                        <hr style={{ 
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            height: '10px',
                            width: '100%',
                            margin: '20px 0'
                        }}
                        />

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
                                <div>
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
                    </>
                )}

                <Card.Footer style={CardBorderStyle}>

                    <MoreActionButtonStyled
                        onClick={(e: any) => {
                            e.preventDefault();
                            setOpenComments(!openComments);
                        }}
                        icon={<InfoCircleOutlined />}
                        className="mb-3"
                    >
                        {openComments ? 'Hide Comments' : 'View Comments'}
                    </MoreActionButtonStyled>

                    <Collapse in={openComments}>
                        <div 
                            style={{
                                marginLeft: '10px',
                            }}
                        >
                            <CreateCommentForm post_id={post_id} handleNewComments={handleNewComments}/>
                            <CommentList comments={comments} handleUpdates={handleCommentUpdates}/>
                        </div>
                    </Collapse>

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
        width: 95% !important;
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

const MoreActionButtonStyled = styled(MoreActionButton)`

    @media (max-width: 480px) { // For mobile phones
        width: 100%;
        margin: 0 auto;
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
