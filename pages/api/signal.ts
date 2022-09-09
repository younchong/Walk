// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import signalPhaseData from "../../data/phaseMockData.json"
import signalTimingData from "../../data/timingMockData.json"
import getDistance from '../../utils/getDistance'
import mapData from "../../data/mapMockData.json"

interface position {
  lat: number,
  lng: number,
}

const getMapData = async () => {
  //const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_MAP as string);
  //const response = await result.json();
  const response = mapData; // mockData

  return response;
}

const getSignalPhaseData = async () => {
  //const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_PHASE as string);
  //const response = await result.json();
  const response = signalPhaseData; // mockData

  return response;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const myPosition = await JSON.parse(req.body);
  const mapData = await getMapData(); // 현재 위치에서 주변에 있는 위도 경도 가져옴.
  const signalPhase = await getSignalPhaseData(); // signal phase info

  const aroundSignal = mapData.filter((data: any) => {
    const signalPosition = {
      lat: data.mapCtptIntLat / 10000000,
      lng: data.mapCtptIntLot / 10000000,
    }

    if (getDistance(myPosition, signalPosition) < 150) {
      const phase = signalPhase.find((signal: any) => signal.itstId === data.itstId);
      //if (phase) console.log(phase);
      data.lat = signalPosition.lat;
      data.lng = signalPosition.lng;
      data.phase = phase;

      return data;
    }
  });

  res.status(200).json(aroundSignal);
}
