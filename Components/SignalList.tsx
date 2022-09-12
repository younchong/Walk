import styled from '@emotion/styled';
import React, { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import placeSignal from '../utils/placeSignal';
import getSignalData from '../utils/getSignalData';
import filterSignals from '../utils/filterSignals';
import SignalDetail from './SignalDetail';
import { analyzeDirectionAndTime } from '../utils/signalUtils';
import mapPositionAtom from '../recoil/mapPosition/atom';
import myPositionState from '../recoil/myPosition/atom';
import updatedTimeAtom from '../recoil/updatedTime/atom';
import aroundSignalsAtom, { signalWithCalculatedDistance, distanceAtom } from '../recoil/aroundSignals/index';

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
`;

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
  const [myPosition, setMyPosition] = useRecoilState(myPositionState);
  const aroundSignals = useRecoilValue(signalWithCalculatedDistance);
  const setUpdatedTime = useSetRecoilState(updatedTimeAtom);
  const setAroundSignals = useSetRecoilState<signal[]>(aroundSignalsAtom);
  const setDistance = useSetRecoilState(distanceAtom);
  const setMapPosition = useSetRecoilState(mapPositionAtom);
  const [refetchIntervalTime, setRefetchIntervalTime] = useState<number | false>(90 * 1000);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [ranges, setRanges] = useState<ranges>({
    0.5: true,
    1: false,
    1.5: false,
    2: false
  });

  const { data, refetch } = useQuery( "aroundSignals", async() => {
    const updatedSinal = await getSignalData(myPosition);
    
    return updatedSinal;
    },
    {
      refetchInterval: refetchIntervalTime,
      onSuccess: ( data ) => {
        if (!data.length) setRefetchIntervalTime(false);
      },
    }
  );

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
    refetch();
  }, [myPosition]);

  useEffect(() => {
    if (!data || !data.length) return;

    !refetchIntervalTime && setRefetchIntervalTime(90 * 1000);

    const filteredSignals = filterSignals(data);
    setAroundSignals(filteredSignals);
    setUpdatedTime(Date.now());
  }, [data]);

  useEffect(() => {
    if (!aroundSignals.length) return;

    aroundSignals.forEach((position: signal) => {
      Object.keys(position.phase).forEach(direction => {
        placeSignal(position, direction, position.phase[direction], map);
      });
    });
  }, [aroundSignals]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (process.env.NODE_ENV === "development") {
        const newPosition = {
          lat: 37.57814842135318,
          lng: 126.88837721721241,
        } 
        // dmc position
        setMyPosition(newPosition)
      } else {
        const coord = position.coords;
        const newPosition = {
          lat: coord.latitude,
          lng: coord.longitude,
        };

        setMyPosition(newPosition);
      }
    }, (err) => {
      console.log(err);
    });
  }, []);

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
