import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const WalkingMan = styled.div`
  width: 30px;
	height: 20px;
	text-align: center;
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
	margin-top: 25px;
	margin-left: -5px;
`;

export const Middlepart = styled.p`
  background: #000;
	height: 20px;
	width: 5px;
	position: absolute;
	margin-top: 38px;
	margin-left: -5px;
	border-radius: 100%;
  transform: scale(2.2,1.3) skewY(-30deg);
  -webkit-transform: scale(2.2,1.3) skewY(-30deg);
  -moz-transform: scale(2.2,1.3) skewY(-30deg);	
`;

const ManBodyMoving = keyframes`
  0% {margin-left:0%;}
  100% {margin-left:200%;}
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
  margin-left:350px;
  animation: ${ManBodyMoving} 3s infinite slidein alternate;
  -webkit-animation: ${ManBodyMoving} 3s infinite ease-in;
  -moz-animation: ${ManBodyMoving} 3s infinite ease-in;
`;

export const LHand = styled.p`
  margin-top: 38px;
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
  margin-top: 38px;
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
  margin-top: 60px;
	margin-left: -5px;
	height: 25px;
	width: 3px;
	background: #000;
	float:left;

  transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    animation: movement2 0.5s alternate infinite ease-out;
    -webkit-animation: movement2 0.5s alternate infinite ease-out;
    -moz-animation: movement2 0.5s alternate infinite ease-out;

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
  margin-top: 60px;
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
