import React from 'react';
import styled from 'styled-components';

const Button = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #8b45de;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  cursor: pointer;

  // Hover effects
  transition: all 0.3s ease;
  box-shadow: 0 0 10px #a25afa;

  &:hover {
    transform: scale(1.1);
    background-color: #a25afa;
    box-shadow: 0 0 15px #d7b8fc;
  }
`;

interface ActionPlusProps {
  onClick: () => void;
  id: string;
}

const ActionPlus: React.FC<ActionPlusProps> = ({ onClick, id }) => {
  return <Button id={id} onClick={onClick}>+</Button>;
};

export default ActionPlus;
