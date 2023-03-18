import React, { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import placeSignal from '../../utils/placeSignal';
import getSignalData from '../../utils/getSignalData';
import { createSignals, CreatedSignal } from '../../utils/createSignals';
import SignalDetail from '../SignalDetail';
import { analyzeDirectionAndTime } from '../../utils/signalUtils';
import mapPositionAtom from '../../recoil/mapPosition/atom';
import myPositionState from '../../recoil/myPosition/atom';
import { listedSignalsAtom, distanceAtom, mapAroundSignalsAtom } from '../../recoil/aroundSignals/index';
import { SignalListProps, SignalTypes, AvailableRanges } from './type';
import { List, ListContainer, ListHeader, ListMain, ListMarginTop, RangeItem, RangesBox, SignalRow, SignalTitle } from './style';
import { SignalInformation } from "../../pages/api/type";
import removeSignals from "../../utils/removeSignal";
import getDistance from "../../utils/getDistance";

export const SignalList: FC<SignalListProps> = ({ map, isMapMoving }) => {
  const myPosition = useRecoilValue(myPositionState);
  const [listedSignals, setListedSignals] = useRecoilState<SignalTypes[]>(listedSignalsAtom);
  const setMapAroundSignals = useSetRecoilState(mapAroundSignalsAtom);
  const [selectedDistance, setSelectedDistance] = useRecoilState(distanceAtom);
  const [mapPostion, setMapPosition] = useRecoilState(mapPositionAtom);
  const [refetchIntervalTime, setRefetchIntervalTime] = useState<number | false>(90 * 1000);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [updatedTime, setUpdatedTime] = useState(Date.now());
  const [calculatedSignals, setCalculatedSignals] = useState(listedSignals);
  const [ranges, setRanges] = useState<Map<AvailableRanges, boolean>>(new Map([
    ["0.5", true],
    ["1", false],
    ["1.5", false],
    ["2", false]]));

  const { data, refetch, isLoading } = useQuery("listedSignals", async() => {
    const updatedSinal: SignalInformation[] = await getSignalData(isMapMoving ? mapPostion : myPosition);
    
    return updatedSinal;
    },
    {
      refetchInterval: refetchIntervalTime,
      onSuccess: ( data ) => {
        if (!data.length) setRefetchIntervalTime(false);
      },
    }
  );

  const clickList = (e: React.BaseSyntheticEvent) => {
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

    setSelectedDistance(curRange);
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
  }, [myPosition, mapPostion]);

  useEffect(() => {
    const updatedSignals = listedSignals.filter((signal) => {
      const updatedSignal: SignalTypes & {distance: number} = {...signal, distance: 3};
      const signalPosition = {
        lat: signal.latlng.Ma,
        lng: signal.latlng.La
      };
      const position = isMapMoving ? mapPostion : myPosition;
      const distance = getDistance(position, signalPosition);
      updatedSignal.distance = distance;

      if (distance <= Number(selectedDistance)) return updatedSignal;
    });

    (updatedSignals as (SignalTypes & {distance: number})[]).sort((a, b) => a.distance - b.distance);
    setCalculatedSignals(updatedSignals);
  }, [listedSignals, selectedDistance]);

  useEffect(() => {
    if (!data?.length) return;

    !refetchIntervalTime && setRefetchIntervalTime(90 * 1000);

    const signalsInfo = createSignals(data);
    const newPlacedSignals: any[] = []; // kakao Map point

    signalsInfo.forEach((position: CreatedSignal) => {
      Object.keys(position.phase).forEach(direction => {
        const title = position.title;
        const phase = position.phase[direction];
        const point = placeSignal({position, direction, phase, title});

        newPlacedSignals.push(point);
      });
    });

    setListedSignals(signalsInfo);
    setMapAroundSignals(prev =>{
      if (prev.length) removeSignals(prev);
      
      return newPlacedSignals;
    });
    setUpdatedTime(Date.now());
  }, [data]);

  return (
    <ListContainer isActive={isActive}>
      <ListMarginTop hasSignals={calculatedSignals.length ? true : false}/>
      <List onMouseOver={() => {setIsActive(true)}} onMouseOut={() => {setIsActive(false)}} onClick={clickList}>
        <ListHeader>
          <span>주변 정보</span>
          {isMapMoving && <span id="me"></span>}
          {!isMapMoving && 
          <RangesBox>
            {Array.from(ranges, ([key, value]) => ({key, value})).map(({key, value}) => 
              <RangeItem id={key} isClicked={value} key={key}>{key}km</RangeItem>)}
            <span id="me"></span>
          </RangesBox>}
        </ListHeader>
        <ListMain>
          {isLoading ?
            <SignalRow> Loading...</SignalRow> :
            calculatedSignals.map((signal: SignalTypes, index) => {
              if (!Object.keys(signal.phase).length) return null;

              return (
                <SignalRow key={signal.latlng.Ma + signal.latlng.La + index} onClick={() => {
                  const moveLatLng = new window.kakao.maps.LatLng(signal.latlng.Ma, signal.latlng.La);   
                  map.panTo(moveLatLng);
                }}>
                  <SignalTitle key={signal.title}>{signal.title}</SignalTitle>
                  {Object.keys(signal.phase).map(direction => {
                    const [dir, time] = analyzeDirectionAndTime(direction, signal.timing);

                    return (
                      <SignalDetail updatedTime={updatedTime} direction={dir} phase={signal.phase[direction]} timing={time} key={direction}/>
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
