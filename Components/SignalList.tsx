import styled from '@emotion/styled';
import React, { FC, useEffect, useState } from "react";

interface ContainerProps {
  isActive: boolean;
}

interface ContainerMargin {
  hasSignals: boolean;
}

interface RangeItem {
  isClicked: boolean;
}

const ListContainer = styled.div<ContainerProps>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  overflow: scroll;
  pointer-events: ${(props) => (props.isActive ? "auto" : "none")};
`;

const ListMarginTop = styled.div<ContainerMargin>`
  height: ${(props) => (props.hasSignals ? "70%" : "90%")};
  transition: .5s ease-in-out;
`

const List = styled.div`
  border-radius: 1em 1em 0 1em;
  background-color: hsla(0,0%,97%,.85882);
  box-shadow: 0 -2px 12px 0 rgb(0 0 0 / 31%);
  pointer-events: all;
  padding: 10px 3px;
  margin: 0 4px;
`;

const ListHeader = styled.header`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid #000;
  padding: 9px 12px;

  span {
    font-size: 28px;
    font-weight: 700;
  }
`;

const RangesBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 80%;
`;

const RangeItem = styled.span<RangeItem>`
  padding: 10px;
  border-radius: 15px;
  color: ${(props) => (props.isClicked ? "#ffffff" : "none")};
  background-color: ${(props) => (props.isClicked ? "#00B8FF" : "none")};
  transition: .5s ease-in-out;
`

const ListMain = styled.main`
  padding: 5px 10px;
`;

const ListItem = styled.article`
  display: flex;
  align-items: center;
  height: 55px;
  border-bottom: 1px solid rgba(0,0,0,.2);

  span {
    margin-right: 10px;
  }
`;

interface signal {
  title: string,
  timing: {[index: string]: number},
  phase: {[index: string]: string},
  latlng: {La: number, Ma: number}
}

interface Props {
  signals: signal[]
}

interface ranges {
  [index: string]: boolean
}

export const SignalList: FC<Props> = ({signals}) => {
  const [ranges, setRanges] = useState<ranges>({
    0.5: true,
    1: false,
    1.5: false,
    2: false
  });
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleRange = (e: React.BaseSyntheticEvent) => {
    const id = e.target.id;

    if (!id) return;

    const prevRange = Object.keys(ranges).find(range => ranges[range]);

    setRanges(prev => {
      const updatedRanges = {...prev};
      updatedRanges[prevRange as string] = false;
      updatedRanges[id] = true;

      return updatedRanges;
    });
  }

  return (
    <ListContainer isActive={isActive}>
      <ListMarginTop hasSignals={signals.length ? true : false}/>
      <List onMouseOver={() => {setIsActive(true)}} onMouseOut={() => {setIsActive(false)}} >
        <ListHeader>
          <span>주변 정보</span>
          <RangesBox onClick={handleRange}>
            {Object.keys(ranges).sort((a, b) => Number(a) - Number(b)).map(range => 
            <RangeItem id={range} isClicked={ranges[range]} key={range}>{range}km</RangeItem>
            )}
          </RangesBox>
        </ListHeader>
        <ListMain>
          {
            signals.map((signal, index) => {
              return (
                <ListItem key={signal.title}>
                  <span key={signal.title + "header"}>{signal.title}</span>
                  {Object.keys(signal.phase).map(direction => {
                    return (
                      <div key={direction}>
                        <span key={direction + signal.title + signal.timing}>{translateDirection(direction, signal.timing)}</span>
                        <span key={direction + signal.title + signal.phase[direction]}>{translatePhase(signal.phase[direction])}</span>
                      </div>
                    );
                  })}
                </ListItem>
              )
            })
          }
        </ListMain>
      </List>
    </ListContainer>
  )
}

export default SignalList;

function translateDirection(direction: string, timing: {[index: string]: number}) {
  if (direction.includes("nt")) {
    return `북쪽 ${Math.floor(timing["ntPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("et")) {
    return `동쪽 ${Math.floor(timing["etPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("st")) {
    return `남쪽 ${Math.floor(timing["stPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("wt")) {
    return `서쪽 ${Math.floor(timing["wtPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("ne")) {
    return `북동쪽 ${Math.floor(timing["nePdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("nw")) {
    return `북서쪽 ${Math.floor(timing["nwPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("se")) {
    return `남동쪽 ${Math.floor(timing["sePdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("sw")) {
    return `남서쪽 ${Math.floor(timing["swPdsgRmdrCs"] / 10)}초`;
  }

  return "정보 없음";
}

function translatePhase(phase: string) {
  if (phase.includes("stop")) return "🔴";
  return "🟢";
}
