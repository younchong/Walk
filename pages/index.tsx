import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import SignalList from '../Components/SignalList';
import { CreatedSignal, createSignals } from '../utils/createSignals';
import getSignalData from '../utils/getSignalData';
import placeSignal from '../utils/placeSignal';
import removeSignals from '../utils/removeSignal';
import myPositionState from '../recoil/myPosition/atom';
import mapPositionAtom from '../recoil/mapPosition/atom';
import mapMovingAtom from '../recoil/mapMoving/atom';
import { mapAroundSignalsAtom } from '../recoil/aroundSignals';
import { initKakaoMap } from '../utils/initKakaoMap';
import { initScript } from '../utils/initScript';

const Home: NextPage = () => {
  const [myPosition, setMyPosition] = useRecoilState(myPositionState);
  const [mapPosition, setMapPosition] = useRecoilState(mapPositionAtom);
  const [mapAroundSignals, setMapAroundSignals] = useRecoilState(mapAroundSignalsAtom);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [map, setMap] = useState();
  const { data, refetch } = useQuery("mapAroundSignals", async() => {
    const updatedSignals = await getSignalData(mapPosition);

    return updatedSignals;
  });

  useEffect(() => {
    if (!data?.length) return;

    const signalsInfo = createSignals(data);
    const newPlacedSignals: any[] = []; // kakao Map point

    signalsInfo.forEach((position: CreatedSignal) => {
      Object.keys(position.phase).forEach(direction => {
        const title = position.title;
        const phase = position.phase[direction];
        const point = placeSignal({position, direction, phase, map, title});

        newPlacedSignals.push(point);
      });
    });

    mapAroundSignals.length && removeSignals(mapAroundSignals);
    setMapAroundSignals(newPlacedSignals);
  }, [data]);

  useEffect(() => {
    if (!mapLoaded) return;

    initKakaoMap({ myPosition, setMap, setMapPosition, refetch });
    refetch();
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
      <SignalList map={map} />
    </div>
  )
}

export default Home;
