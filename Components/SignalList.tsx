import styled from '@emotion/styled';
import React, { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { aroundSignalsAtom, distanceAtom } from '../recoil/aroundSignals/atom';
import placeSignal from '../utils/placeSignal';
import signalWithCalculatedDistance from '../recoil/aroundSignals/withCalculated';
import myPositionState from '../recoil/myPosition/atom';
import mapPositionAtom from '../recoil/mapPosition/atom';
import { useQuery } from 'react-query';
import getSignalData from '../utils/getSignalData';
import filterSignals from '../utils/filterSignals';
import removeSignals from '../utils/removeSignal';
import SignalDetail from './SignalDetail';
import { analyzeDirectionAndTime } from '../utils/signalUtils';
import updatedTimeAtom from '../recoil/updatedTime/atom';

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

  &:hover{
    cursor: pointer;
  }
`;

const ListMain = styled.main`
  padding: 5px 10px;
`;

const SignalRow = styled.article`
  display: flex;
  align-items: center;
  height: 55px;
  border-bottom: 1px solid rgba(0,0,0,.2);

  span {
    margin-right: 10px;
  }
`;

const SignalTitle = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

export interface signal {
  title: string,
  timing: {[index: string]: number},
  phase: {[index: string]: string},
  latlng: {La: number, Ma: number}
}

interface Props {
  map: any
}

interface ranges {
  [index: string]: boolean
}

export const SignalList: FC<Props> = ({ map }) => {
  const myPosition = useRecoilValue(myPositionState);
  const aroundSignals = useRecoilValue(signalWithCalculatedDistance);
  const setUpdatedTime = useSetRecoilState(updatedTimeAtom);
  const setAroundSignals = useSetRecoilState(aroundSignalsAtom);
  const setDistance = useSetRecoilState(distanceAtom);
  const setMapPosition = useSetRecoilState(mapPositionAtom);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [ranges, setRanges] = useState<ranges>({
    0.5: true,
    1: false,
    1.5: false,
    2: false
  });

  const { data } = useQuery( "aroundSignals", async() => {
    const updatedSinal = await getSignalData(myPosition);
    
    return updatedSinal;
  },
  {
    refetchInterval: 90 * 1000,
  }
  );

  useEffect(() => {
    if (!data || !data.length) return;

    // const oldPlacedSignals: any[] = [];

    // aroundSignals.forEach((position: any) => {
    //   Object.keys(position.phase).forEach(direction => {
    //     const point = placeSignal(position, direction, position.phase[direction], map);

    //     oldPlacedSignals.push(point);
    //   });
    // });
    // removeSignals(oldPlacedSignals);
    // 신호 변경됐을 때, 초록빛, 빨강 빛 겹치는 현상 지워주려고 했는데, 효과 없음

    const filteredSignals = filterSignals(data);
    setAroundSignals(filteredSignals as any);
    setUpdatedTime(Date.now());
  }, [data]);

  const handleRange = (e: React.BaseSyntheticEvent) => {
    const curRange = e.target.id;

    if (!curRange) return;
    if (curRange === "me") {
      const position = {
        lat: myPosition.lat,
        lng: myPosition.lng,
      };

      map.panTo(new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng));
      setMapPosition(position);
      return;
    }

    const prevRange = Object.keys(ranges).find(range => ranges[range]);

    setDistance(curRange);
    setRanges(prev => {
      const updatedRanges = {...prev};
      updatedRanges[prevRange as string] = false;
      updatedRanges[curRange] = true;

      return updatedRanges;
    });
  }

  useEffect(() => {
    if (!aroundSignals.length) return;

    aroundSignals.forEach((position: any) => {
      Object.keys(position.phase).forEach(direction => {
        placeSignal(position, direction, position.phase[direction], map);
      });
    });
  }, [aroundSignals]);

  return (
    <ListContainer isActive={isActive}>
      <ListMarginTop hasSignals={aroundSignals.length ? true : false}/>
      <List onMouseOver={() => {setIsActive(true)}} onMouseOut={() => {setIsActive(false)}} >
        <ListHeader>
          <span>주변 정보</span>
          <RangesBox onClick={handleRange}>
            {Object.keys(ranges).sort((a, b) => Number(a) - Number(b)).map(range => 
            <RangeItem id={range} isClicked={ranges[range]} key={range}>{range}km</RangeItem>
            )}
            <span id="me"></span>
          </RangesBox>
        </ListHeader>
        <ListMain>
          {
            aroundSignals.map((signal: signal) => {
              return (
                <SignalRow key={signal.latlng.Ma + signal.latlng.La}>
                  <SignalTitle key={signal.title}>{signal.title}</SignalTitle>
                  {Object.keys(signal.phase).map(direction => {
                    const [dir, time] = analyzeDirectionAndTime(direction, signal.timing);

                    return (
                        <SignalDetail direction={dir} phase={signal.phase[direction]} timing={time} key={direction}/>
                    );
                  })}
                </SignalRow>
              )
            })
          }
        </ListMain>
      </List>
    </ListContainer>
  )
}

export default SignalList;
