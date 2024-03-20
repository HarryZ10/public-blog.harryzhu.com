import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';

import { JSONPayload } from './CreateCommentForm';
import { CreatePostData, Post } from '../../interfaces/post';
import { CreatePostResponse, UpdateCommentResponse } from '../../interfaces/apiResponses';

import { createPost, updatePost } from '../../api/PostsAPI';
import ActionPlus from '../layout/ActionPlus';
import themes from '../../styles/themes';
import "../../styles/createPost.css"
import toast from 'react-hot-toast';

interface FormData {
    postContent: string;
    baseSalary: string;
    signOnBonus: string;
    equity: string;
    unlimitedPTO: boolean;
    has401k: boolean;
    medicalInsurance: boolean;
    dentalInsurance: boolean;
    visionInsurance: boolean;
    flexibleWorkHours: boolean;
    remoteWorkOptions: boolean;
    relocationAssistance: boolean;
    maternityPaternityLeave: boolean;
    gymMembership: boolean;
    tuitionAssistance: boolean;
}

interface FormProps {
    id?: string,
    initialFormData?: Post;

    show: boolean;
    handleClose: () => void;
}

const CreatePostForm: React.FC<FormProps> = ({ id, initialFormData, show, handleClose }) => {

    const [postCreated, setPostCreated] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        postContent: initialFormData?.post_text || '',
        baseSalary: initialFormData?.extra?.jobOfferInfo?.baseSalary || '',
        signOnBonus: initialFormData?.extra?.jobOfferInfo?.signOnBonus || '',
        equity: initialFormData?.extra?.jobOfferInfo?.equity || '',
        unlimitedPTO: initialFormData?.extra?.jobOfferInfo?.otherOptions?.unlimitedPTO || false,
        has401k: initialFormData?.extra?.jobOfferInfo?.otherOptions?.has401k || false,
        medicalInsurance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.healthInsurance?.medical || false,
        dentalInsurance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.healthInsurance?.dental || false,
        visionInsurance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.healthInsurance?.vision || false,
        flexibleWorkHours: initialFormData?.extra?.jobOfferInfo?.otherOptions?.flexibleWorkHours || false,
        remoteWorkOptions: initialFormData?.extra?.jobOfferInfo?.otherOptions?.remoteWorkOptions || false,
        relocationAssistance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.relocationAssistance || false,
        maternityPaternityLeave: initialFormData?.extra?.jobOfferInfo?.otherOptions?.maternityPaternityLeave || false,
        gymMembership: initialFormData?.extra?.jobOfferInfo?.otherOptions?.gymMembership || false,
        tuitionAssistance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.tuitionAssistance || false,
    });

    const post_id = id || '';

    const isUpdateMode = post_id !== '';

    useEffect(() => {
        if (formData.postContent.length <= 150) {
            setIsButtonEnabled(formData.postContent.trim() !== '');
        } else {
            setIsButtonEnabled(false);
        }
    }, [formData.postContent, formData.postContent.length]);

    useEffect(() => {
        setFormData({
            postContent: initialFormData?.post_text || '',
            baseSalary: initialFormData?.extra?.jobOfferInfo?.baseSalary || '',
            signOnBonus: initialFormData?.extra?.jobOfferInfo?.signOnBonus || '',
            equity: initialFormData?.extra?.jobOfferInfo?.equity || '',
            unlimitedPTO: initialFormData?.extra?.jobOfferInfo?.otherOptions?.unlimitedPTO || false,
            has401k: initialFormData?.extra?.jobOfferInfo?.otherOptions?.has401k || false,
            medicalInsurance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.healthInsurance?.medical || false,
            dentalInsurance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.healthInsurance?.dental || false,
            visionInsurance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.healthInsurance?.vision || false,
            flexibleWorkHours: initialFormData?.extra?.jobOfferInfo?.otherOptions?.flexibleWorkHours || false,
            remoteWorkOptions: initialFormData?.extra?.jobOfferInfo?.otherOptions?.remoteWorkOptions || false,
            relocationAssistance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.relocationAssistance || false,
            maternityPaternityLeave: initialFormData?.extra?.jobOfferInfo?.otherOptions?.maternityPaternityLeave || false,
            gymMembership: initialFormData?.extra?.jobOfferInfo?.otherOptions?.gymMembership || false,
            tuitionAssistance: initialFormData?.extra?.jobOfferInfo?.otherOptions?.tuitionAssistance || false,
        });
    }, [initialFormData])

    useEffect(() => {
        if (postCreated) {
            handleClose();
            setPostCreated(false);
        }
    }, [postCreated]);

    const getUserIdFromToken = (): string => {
        const token = Cookies.get('token');
        let userid = '';
        if (token) {
            const decoded = jwtDecode<JSONPayload>(token);
            userid = decoded.user_id;
        }
        return userid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState: FormData) => ({
        // prevState refers to the current state of formData before the update is applied
        // and then we "spread" it to include it in the newly filled in input value
        ...prevState,

        // If it is a checkbox, just get the value out of 'checked'
        [name]: type === 'checkbox' ? checked : value,
    }));
};

    const confirmPost = async () => {
        if (isButtonEnabled) {
            try {
                const user_id = getUserIdFromToken();
                if (!user_id) {
                    throw new Error('User ID not found in token');
                }

                const postData: CreatePostData = {
                    id: post_id,
                    user_id: user_id,
                    post_text: formData.postContent,
                    token: Cookies.get('token'),
                    extra: {
                        jobOfferInfo: {
                            baseSalary: formData.baseSalary,
                            equity: formData.equity,
                            signOnBonus: formData.signOnBonus,
                            otherOptions: {
                                unlimitedPTO: formData.unlimitedPTO,
                                has401k: formData.has401k,
                                healthInsurance: {
                                    medical: formData.medicalInsurance,
                                    dental: formData.dentalInsurance,
                                    vision: formData.visionInsurance
                                },
                                flexibleWorkHours: formData.flexibleWorkHours,
                                remoteWorkOptions: formData.remoteWorkOptions,
                                relocationAssistance: formData.relocationAssistance,
                                maternityPaternityLeave: formData.maternityPaternityLeave,
                                gymMembership: formData.gymMembership,
                                tuitionAssistance: formData.tuitionAssistance,
                            }
                        }
                    }
                };

                let response: CreatePostResponse | UpdateCommentResponse;

                if (!isUpdateMode) {
                    await createPost(postData)
                    .then(res => {
                        if (res.message === "Post created") {
                            setPostCreated(true);
                            handleClose();
                            toast.success(`${res.message} successfully! Refresh to see changes.`)
                        }
                    })
                    .catch(err => {
                        if (err?.code == "CREATE_POST_FAILED") {
                            toast.error(err?.message);
                        } else {
                            toast.error("Failed to create post: Please check console for more details.")
                        }
                    });
     
                } else {
                    await updatePost(postData)
                    .then(res => {
                        if (res?.message === "Post updated") {
                            setPostCreated(true);
                            handleClose();
                            toast.success("Post updated successfully");
                        }
                    })
                    .catch(err => {
                        if (err?.code == "UPDATE_POST_FAILED") {
                            toast.error(err?.message);
                        } else {
                            toast.error("Failed to update post: Please check console for more details.")
                        }
                    });
                }

            } catch (error) {
                toast.dismiss();
                toast.error(`Something went wrong: ${error}`);
            }
        }
    };

    const CharacterCount = styled.div`
        color: ${formData.postContent.length > 150 ? "#c9163a" : "#777"};
        font-size: 14px;
        margin-top: 5px;
        text-align: right;
    `

    const modalButtonStyle = {
        fontFamily: "Cabin",
        fontWeight: '400',
        fontSize: '16px',
        width: '70%',
        margin: '10px auto',
        backgroundColor: isButtonEnabled ? themes.dark.colors.submission : '#b193ca',
        color: themes.dark.colors.postText,
        borderColor: isButtonEnabled ? themes.dark.colors.submission : '#b193ca',
        borderRadius: '5px',
        transition: 'transform 0.3s, background-color 0.3s, border-color 0.3s'
    }

    return (
        <> 
            <StyledModal show={show} onHide={handleClose}>
                <div style={modalBackground}>
                    <Modal.Header closeButton>
                        <Modal.Title style={modalTitleStyle}>
                            { isUpdateMode ? 'Edit Post' : 'Create Post' }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={modalTextStyle}>
                        <Form>
                            {/* Text fields */}
                            <Form.Group as={Row}>
                                <Col sm={12}>
                                    <Form.Control
                                        as="textarea"
                                        name="postContent"
                                        className="post-textarea"
                                        value={formData.postContent}
                                        onChange={handleInputChange}
                                        placeholder={ isUpdateMode ? '' : 'What\'s your flex?' }
                                        style={{...FormInputStyle, ...{
                                            border: 'none',
                                            fontSize: '20px',
                                        }}}
                                        rows={2}
                                    />
                                    <CharacterCount>
                                        {formData.postContent.length} characters
                                    </CharacterCount>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={3}>Base Salary</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="baseSalary"
                                        value={formData.baseSalary}
                                        onChange={handleInputChange}
                                        style={{
                                            ...FormInputStyle, ...{
                                                fontSize: '16px',
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>Sign-On Bonus</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="signOnBonus"
                                        value={formData.signOnBonus}
                                        onChange={handleInputChange}
                                        style={{
                                            ...FormInputStyle, ...{
                                                fontSize: '16px',
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={3}>Equity</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="equity"
                                        value={formData.equity}
                                        onChange={handleInputChange}
                                        style={{
                                            ...FormInputStyle, ...{
                                                fontSize: '16px',
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>

                            {/* True/False Questions */}
                            <Row>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Unlimited PTO"
                                        name="unlimitedPTO"
                                        checked={formData.unlimitedPTO}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Has 401k"
                                        name="has401k"
                                        checked={formData.has401k}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Medical Insurance"
                                        name="medicalInsurance"
                                        checked={formData.medicalInsurance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Dental Insurance"
                                        name="dentalInsurance"
                                        checked={formData.dentalInsurance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Vision Insurance"
                                        name="visionInsurance"
                                        checked={formData.visionInsurance}
                                        style={FormCheckboxStyle}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Flexible Work Hours"
                                        name="flexibleWorkHours"
                                        checked={formData.flexibleWorkHours}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Remote Work Options"
                                        name="remoteWorkOptions"
                                        checked={formData.remoteWorkOptions}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Relocation Assistance"
                                        name="relocationAssistance"
                                        checked={formData.relocationAssistance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Maternity/Paternity Leave"
                                        name="maternityPaternityLeave"
                                        checked={formData.maternityPaternityLeave}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Gym Membership"
                                        name="gymMembership"
                                        checked={formData.gymMembership}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Tuition Assistance"
                                        name="tuitionAssistance"
                                        checked={formData.tuitionAssistance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                            </Row>
                         </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            style={{
                                ...modalButtonStyle,
                                cursor: !isButtonEnabled ? 'not-allowed' : 'pointer'
                            }}

                            className={isButtonEnabled ? "hover-effect-button" : ''}

                            variant="primary"
                            onClick={confirmPost}>
                            Flex
                        </Button>
                    </Modal.Footer>
                </div>
            </StyledModal>
        </>
    );
};

const FormInputStyle = {
    backgroundColor: themes.dark.colors.modalTextInput,
    border: '1px solid #3D3D42',
    color: themes.dark.colors.postText,
    marginBottom: '10px',
}

const FormCheckboxStyle = {
    marginTop: '10px',
    color: '#fff'
}

const modalTitleStyle = {
    fontFamily: "Outfit",
    fontWeight: '300',
    letterSpacing: "0.05rem",
    marginLeft: '10px'
}

const modalTextStyle = {
    fontFamily: "Cabin",
    fontSize: '16px',
}

const modalBackground = {
    backgroundColor: themes.dark.colors.modalBackground,
    borderRadius: '20px',
    width: '100%',
}

const StyledModal = styled(Modal)`
  .modal-content {
    background: transparent;
    width: 100%;

     @media (max-width: 768px) { // For mobile phones
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    }
  }
  .modal-header {
    border-bottom: 0.6px solid #8c8785 !important;
    button {
        margin-left: 0;
    }
  }
  
  .modal-footer {
    border-top: none !important;
  }
`;

export default CreatePostForm;
