import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import SignalList from '../Components/SignalList';
import filterSignals from '../utils/filterSignals';
import getDistance from '../utils/getDistance';
import getSignalData from '../utils/getSignalData';
import placeSignal from '../utils/placeSignal';
import removeSignals from '../utils/removeSignal';
import myPositionState from '../recoil/myPosition/atom';
import mapPositionAtom from '../recoil/mapPosition/atom';
import mapMovingAtom from '../recoil/mapMoving/atom';
import { mapAroundSignalsAtom } from '../recoil/aroundSignals';
import { useQuery } from 'react-query';

const Home: NextPage = () => {
  const myPosition = useRecoilValue(myPositionState);
  const [mapPosition, setMapPosition] = useRecoilState(mapPositionAtom);
  const [isMapMoving, setIsMapMoving] = useRecoilState(mapMovingAtom);
  const [mapAroundSignals, setMapAroundSignals] = useRecoilState(mapAroundSignalsAtom);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [map, setMap] = useState();
  const { data, refetch } = useQuery("mapAroundSignals", async() => {
    const updatedSignals = await getSignalData(mapPosition);

    return updatedSignals;
  });

  useEffect(() => {
    getDistance(myPosition, mapPosition) > 0.5 ?
    setIsMapMoving(true) :
    setIsMapMoving(false);
  }, [mapPosition]);

  useEffect(() => {
    if (!isMapMoving) {
      mapAroundSignals.length && removeSignals(mapAroundSignals);
      setMapAroundSignals([]);

      return;
    }

    refetch();
  }, [isMapMoving, mapPosition]);

  useEffect(() => {
    if (!data || !data.length) return;

    const filteredSignals = filterSignals(data);
    const newPlacedSignals: any[] = [];

    filteredSignals.forEach((position: any) => {
      Object.keys(position.phase).forEach(direction => {
        const point = placeSignal(position, direction, position.phase[direction], map);

        newPlacedSignals.push(point);
      });
    });

    mapAroundSignals.length && removeSignals(mapAroundSignals);
    setMapAroundSignals(newPlacedSignals);
  }, [data]);

  useEffect(() => {
    if (!mapLoaded) return;

    new window.kakao.maps.load(() => {
      const container = document.querySelector("#map");
      const options = {
        center: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
			  level: 2
      };
      const map = new window.kakao.maps.Map(container, options);

      map.panTo(new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng));

      const myIcon = `<div id="me"></div>`;
      const currentOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
          content: myIcon,
          map: map
      });

      currentOverlay.setMap(map);
      setMap(map);

      new window.kakao.maps.event.addListener(map, "dragend", () => {
        const center = map.getCenter();
        const position = {
          lat: center.getLat(),
          lng: center.getLng(),
        };

        setMapPosition(position);
      });
    });
  }, [mapLoaded, myPosition.lat, myPosition.lng]);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_API_KEY}&autoload=false`;
    script.addEventListener("load", () => setMapLoaded(true));

    document.head.append(script);
  }, []);

  return (
    <div>
      <Head>
        <title>Walk</title>
        <meta name="description" content="Walk Efficiently using Traffic light information" />
        <meta name="keyword" content="Walk, Traffic Light" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="map" style={{ width: "100vw", height: "100vh"}}></div>
      <SignalList map={map} />
    </div>
  )
}

export default Home;
