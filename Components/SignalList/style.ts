import styled from '@emotion/styled';
import { ContainerProps, ContainerMarginProps, RangeItemProps } from './type';

export const ListContainer = styled.div<ContainerProps>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  overflow: scroll;
  pointer-events: ${(props) => (props.isActive ? "auto" : "none")};
`;

export const ListMarginTop = styled.div<ContainerMarginProps>`
  height: ${(props) => (props.hasSignals ? "80vh" : "90vh")};
  transition: .5s ease-in-out;
`;

export const List = styled.div`
  border-radius: 1em 1em 0 1em;
  background-color: hsla(0,0%,97%,.85882);
  box-shadow: 0 -2px 12px 0 rgb(0 0 0 / 31%);
  pointer-events: all;
  padding: 1rem .3rem;
  margin: 0 .4rem;
`;

export const ListHeader = styled.header`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: .1rem solid #000;
  padding: .9rem 1.2rem;

  span {
    font-size: 2rem;
    font-weight: 700;
  }
`;

export const RangesBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 80%;
`;

export const RangeItem = styled.span<RangeItemProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 1.5rem;
  color: ${(props) => (props.isClicked ? "#ffffff" : "none")};
  background-color: ${(props) => (props.isClicked ? "#00B8FF" : "none")};
  transition: .5s ease-in-out;

  &:hover{
    cursor: pointer;
  }
`;

export const ListMain = styled.main`
  padding: .5rem 1rem;
`;

export const SignalRow = styled.article`
  display: flex;
  align-items: center;
  height: 5rem;
  border-bottom: .1rem solid rgba(0,0,0,.2);
`;

export const SignalTitle = styled.span`
  margin-right: 1rem;
  font-size: 1.7rem;
  font-weight: 500;
  cursor: pointer;
`;
