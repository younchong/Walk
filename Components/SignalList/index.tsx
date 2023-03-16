import React, { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import placeSignal from '../../utils/placeSignal';
import getSignalData from '../../utils/getSignalData';
import { createSignals } from '../../utils/createSignals';
import SignalDetail from '../SignalDetail';
import { analyzeDirectionAndTime } from '../../utils/signalUtils';
import mapPositionAtom from '../../recoil/mapPosition/atom';
import myPositionState from '../../recoil/myPosition/atom';
import updatedTimeAtom from '../../recoil/updatedTime/atom';
import aroundSignalsAtom, { signalWithCalculatedDistance, distanceAtom } from '../../recoil/aroundSignals/index';
import { SignalListProps, RangesType, SignalTypes, AvailableRanges } from './type';
import { List, ListContainer, ListHeader, ListMain, ListMarginTop, RangeItem, RangesBox, SignalRow, SignalTitle } from './style';
import { SignalInformation } from "../../pages/api/type";

export const SignalList: FC<SignalListProps> = ({ map }) => {
  const myPosition = useRecoilValue(myPositionState);
  const aroundSignals = useRecoilValue(signalWithCalculatedDistance);
  const setUpdatedTime = useSetRecoilState(updatedTimeAtom);
  const setAroundSignals = useSetRecoilState<SignalTypes[]>(aroundSignalsAtom);
  const setDistance = useSetRecoilState(distanceAtom);
  const setMapPosition = useSetRecoilState(mapPositionAtom);
  const [refetchIntervalTime, setRefetchIntervalTime] = useState<number | false>(90 * 1000);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [ranges, setRanges] = useState<Map<AvailableRanges, boolean>>(new Map([
    ["0.5", true],
    ["1", false],
    ["1.5", false],
    ["2", false]]));

  const { data, refetch } = useQuery("aroundSignals", async() => {
    const updatedSinal: SignalInformation[] = await getSignalData(myPosition);
    
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

    setDistance(curRange);
    setRanges(() => {
      const updatedRanges = new Map<AvailableRanges, boolean>([
        ["0.5", false],
        ["1", false],
        ["1.5", false],
        ["2", false]]);
      updatedRanges.set(curRange, true);

      return updatedRanges;
    });
  }

  useEffect(() => {
    refetch();
  }, [myPosition]);

  useEffect(() => {
    if (!data?.length) return;

    !refetchIntervalTime && setRefetchIntervalTime(90 * 1000);

    const signalsInfo = createSignals(data);
    // 여기서 거리 정보 추가 현재 위치로부터.
    setAroundSignals(signalsInfo);
    setUpdatedTime(Date.now());
  }, [data]);

  // useEffect(() => {
  //   if (!aroundSignals.length) return;

  //   aroundSignals.forEach((position: SignalTypes) => {
  //     Object.keys(position.phase).forEach(direction => {
  //       const title = position.title;
  //       const phase = position.phase[direction];

  //       // placeSignal({position, direction, phase, map, title});
  //     });
  //   });
  // }, [aroundSignals]);

  return (
    <ListContainer isActive={isActive}>
      <ListMarginTop hasSignals={aroundSignals.length ? true : false}/>
      <List onMouseOver={() => {setIsActive(true)}} onMouseOut={() => {setIsActive(false)}} >
        <ListHeader>
          <span>주변 정보</span>
          <RangesBox onClick={handleRange}>
            {Array.from(ranges, ([key, value]) => ({key, value})).map(({key, value}) => 
            <RangeItem id={key} isClicked={value} key={key}>{key}km</RangeItem>)}
            <span id="me"></span>
          </RangesBox>
        </ListHeader>
        <ListMain>
          {
            aroundSignals.map((signal: SignalTypes, index) => {
              return (
                <SignalRow key={signal.latlng.Ma + signal.latlng.La + index}>
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
