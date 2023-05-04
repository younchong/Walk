import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:active {
    background-color: transparent;
  }
`;

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

type SpinnerProps = {
  isActive: boolean;
}

export const Spinner = styled.div<SpinnerProps>`
  &:before {
    content: "";
    height: 3rem;
    width: 3rem;
    margin: -1.7rem auto auto -1.7rem;
    position: absolute;
    top: calc(50%);
    left: calc(50%);
    border: .3rem solid ;
    border-color: #00B8FF #ccc #ccc;
    border-radius: 100%;
    animation: ${(props) => props.isActive && rotation} .7s linear;
  }
`;

export const Text = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;
