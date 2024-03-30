import React, { useState, useEfffect} from "react";
import { Row, Col } from 'react-bootstrap';

const CommentList = ({ comments }) => {

    return (
        <>
            {comments && comments.map(comment => (
                <Row className="align-items-center my-2">
                    <Col xs={4} sm={4} md={3} className="text-truncate">
                        <strong>{comment.username}:</strong>
                    </Col>
                    <Col xs={8} sm={8} md={9} className="text-break">
                        {comment.comment_text}
                    </Col>
                </Row>
            ))}
        </>
    )
};

export default CommentList;
