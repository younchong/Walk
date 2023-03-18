import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import SignalList from '../Components/SignalList';
import myPositionState from '../recoil/myPosition/atom';
import mapPositionAtom from '../recoil/mapPosition/atom';
import { distanceAtom, mapAroundSignalsAtom } from '../recoil/aroundSignals';
import { initKakaoMap } from '../utils/initKakaoMap';
import { initScript } from '../utils/initScript';
import getDistance from '../utils/getDistance';

const Home: NextPage = () => {
  const [myPosition, setMyPosition] = useRecoilState(myPositionState);
  const [mapPosition, setMapPosition] = useRecoilState(mapPositionAtom);
  const mapAroundSignals = useRecoilValue(mapAroundSignalsAtom);
  const setSelectedDistance = useSetRecoilState(distanceAtom);
  const [isMapMoving, setIsMapMoving] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [map, setMap] = useState();

  useLayoutEffect(() => {
    mapAroundSignals.forEach((signal) => {
      signal.setMap(map);
    });
  }, [mapAroundSignals])

  useEffect(() => {
    if (getDistance(mapPosition, myPosition) > 2) {
      setIsMapMoving(true);
      setSelectedDistance("2");
    } else {
      setIsMapMoving(false);
    }
  }, [mapPosition]);

  useEffect(() => {
    if (!mapLoaded) return;

    initKakaoMap({ myPosition, setMap, setMapPosition });
  }, [mapLoaded, myPosition]);

  useEffect(() => {
    initScript({ setMapLoaded });
    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;
        const myPosition = {
          lat: coord.latitude,
          lng: coord.longitude,
        };

        setMyPosition(myPosition);
        setMapPosition(myPosition);
    }, (err) => {
      alert('위치정보 사용 불가');
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Walk</title>
        <meta name="description" content="Walk Efficiently using Traffic light information" />
        <meta name="keyword" content="Walk, Traffic Light" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/icons/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/icons/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <div id="map" style={{ width: "100vw", height: "100vh"}}></div>
      <SignalList map={map} isMapMoving={isMapMoving} />
    </div>
  )
}

export default Home;
