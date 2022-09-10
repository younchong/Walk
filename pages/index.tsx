import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil';
import SignalList from '../Components/SignalList';
import myPositionState from '../recoil/myPosition/atom';
import { aroundSignalsAtom } from '../recoil/aroundSignals/atom';
import filterSignals from '../utils/filterSignals';

const Home: NextPage = () => {
  const [myPosition, setMyPosition] = useRecoilState(myPositionState);
  const setAroundSignals = useSetRecoilState(aroundSignalsAtom);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [map, setMap] = useState();

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:3000/api/signal", {
        method: "POST",
        body: JSON.stringify(myPosition),
      });
      const response = await data.json();

      if (!response.length) return;

      const filteredSignals = filterSignals(response);

      setAroundSignals(filteredSignals as any);
    }

    getData();
  }, [myPosition]);
  
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

      const gpsContent = `<div id="me"></div>`;
      const currentOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
          content: gpsContent,
          map: map
      });

      currentOverlay.setMap(map);
      setMap(map);
    });
  }, [mapLoaded, myPosition.lat, myPosition.lng]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const cord = pos.coords;
      const newPosition = {
        lat: cord.latitude,
        lng: cord.longitude,
      }

      setMyPosition(newPosition);
    }, (err) => {
      console.log(err);
    });
  }, []);

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
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="map" style={{ width: "100vw", height: "100vh"}}></div>
      <SignalList map={map} />
    </div>
  )
}

export default Home
