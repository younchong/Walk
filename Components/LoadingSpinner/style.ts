import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TextBox = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

export const WalkingMan = styled.div`
  position: absolute;
  width: 100%;
	height: 20px;
`;

export const Torso = styled.div`
  float:left;
	position: absolute;
`;

export const Manhead = styled.p`
  width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #000;
	position: absolute;
	margin-top: 0px;
	margin-left: -5px;
`;

export const Middlepart = styled.p`
  background: #000;
	height: 20px;
	width: 5px;
	position: absolute;
	margin-top: 13px;
	margin-left: -5px;
	border-radius: 100%;
  transform: scale(2.2,1.3) skewY(-30deg);
  -webkit-transform: scale(2.2,1.3) skewY(-30deg);
  -moz-transform: scale(2.2,1.3) skewY(-30deg);	
`;

const ManBodyMoving = keyframes`
  0% {
    margin-left: 10%;
    transform: scaleX(1);
  }
  50% {
    margin-left: 90%;
    transform: scaleX(1);
  }
  51% {
    transform: scaleX(-1);
  }
  100% {
    margin-left: 10%;
    transform: scaleX(-1);
  }
`;

const movement1 = keyframes`
  0% {
		transform:rotate(-30deg);
	}
	100% {
		transform:rotate(30deg);
	}
`;

const movement2 = keyframes`
  0% {
		transform:rotate(30deg);
	}
	100% {
		transform:rotate(-30deg);
	}
`;


export const ManBody = styled.div`
  width: 10px;
  animation:  ${ManBodyMoving} 12s infinite ease-in-out;
  -webkit-animation: ${ManBodyMoving} 12s infinite ease-out;
  -moz-animation: ${ManBodyMoving} 12s infinite ease-out;
`;

export const LHand = styled.p`
  margin-top: 13px;
	margin-left: -5px;
	height: 25px;
	width: 3px;
	background: #000;
	float:left;

  transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    animation: ${movement1} 0.5s alternate infinite ease-out;
    -webkit-animation: ${movement1} 0.5s alternate infinite ease-out;
    -moz-animation: ${movement1} 0.5s alternate infinite ease-out;

  &:after {
    content: '';
    width: 8px;
    height: 5px;
    border-radius: 50%;
    background: #000;
    position: absolute;
    margin-top: 23px;
    margin-left: -3px;
  }
`;

export const RHand = styled.p`
  margin-top: 13px;
	margin-left: -5px;
	height: 25px;
	width: 3px;
	background: #000;
	float:left;

  transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    animation: ${movement2} 0.5s alternate infinite ease-out;
    -webkit-animation: ${movement2} 0.5s alternate infinite ease-out;
    -moz-animation: ${movement2} 0.5s alternate infinite ease-out;

  &:after {
  content: '';
  width: 8px;
  height: 5px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  margin-top: 23px;
  margin-left: -3px;
  }
`;

export const LLeg = styled.p`
  margin-top: 35px;
	margin-left: -5px;
	height: 25px;
	width: 3px;
	background: #000;
	float:left;

  transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    animation: ${movement2} 0.5s alternate infinite ease-out;
    -webkit-animation: ${movement2} 0.5s alternate infinite ease-out;
    -moz-animation: ${movement2} 0.5s alternate infinite ease-out;

  &:after {
    content: '';
    width: 8px;
    height: 5px;
    background: #000;
    display: inline-block;
    position: absolute;
    margin-top: 23px;
  }
`;

export const RLeg = styled.p`
  margin-top: 35px;
	margin-left: -5px;
	height: 25px;
	width: 3px;
	background: #000;
	float:left;

  transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    animation: ${movement1} 0.5s alternate infinite ease-out;
    -webkit-animation: ${movement1} 0.5s alternate infinite ease-out;
    -moz-animation: ${movement1} 0.5s alternate infinite ease-out;

  &:after {
    content: '';
    width: 8px;
    height: 5px;
    background: #000;
    display: inline-block;
    position: absolute;
    margin-top: 23px;
  }
`;
