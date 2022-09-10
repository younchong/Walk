import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import SignalList from '../Components/SignalList';
import placeSignal from '../utils/placeSignal';

interface position {
  lat: number,
  lng: number,
}

interface phase {
  [index: string]: string
}

interface timing {
  [index: string]: number
}

interface signal {
  title: string,
  timing: {[index: string]: number},
  phase: {[index: string]: string},
  latlng: {La: number, Ma: number}
}

const Home: NextPage = () => {
  const [mapLoaded, setMapLoaded] = useState<Boolean>(false);
  const [map, setMap] = useState();
  const [myPosition, setMyPosition] = useState<position>({lat:33.450701, lng: 126.570667});
  const [aroundPositions, setAroundPositions] = useState<position[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<signal[]>([]);

  useEffect(() => {
    if (!aroundPositions.length) return;

    const positions = aroundPositions.map((position: any) => {
      const phase: phase = {};
      const timing: timing = {};

      position.phase && Object.keys(position.phase).forEach(key => {
        if (position.phase[key] && key.includes("Pdsg")) {
          phase[key] = position.phase[key];
        }
      });

      position.timing && Object.keys(position.timing).forEach(key => {
        if (position.timing[key] && key.includes("Pdsg")) {
          timing[key] = position.timing[key];
        }
      });

      return {
        title: position.itstNm,
        latlng: new window.kakao.maps.LatLng(position.lat, position.lng),
        phase,
        timing,
      }
    });

    positions.forEach(position => {
      Object.keys(position.phase).forEach(direction => {
        placeSignal(position, direction, position.phase[direction], map);
      });
    });

    setFilteredSignals(positions);
  }, [aroundPositions]);

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:3000/api/signal", {
        method: "POST",
        body: JSON.stringify(myPosition),
      });
      const response = await data.json();

      setAroundPositions(response);
    }

    getData();
  }, [myPosition]);
  
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

      const gpsContent = `<div id="pulse"></div>`;
      const currentOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
          content: gpsContent,
          map: map
      });
      currentOverlay.setMap(map);
      setMap(map);
    });

  }, [mapLoaded, myPosition.lat, myPosition.lng]);

  return (
    <div>
      <Head>
        <title>Walk</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="map" style={{ width: "100vw", height: "100vh"}}></div>
      <SignalList signals={filteredSignals} />
    </div>
  )
}

export default Home
