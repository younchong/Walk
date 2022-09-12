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
  if (process.env.NODE_ENV === "development") {
    const response = mapData;

    return response;
  }

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_MAP as string);
  const response = await result.json();

  return response;
}

const getSignalPhaseData = async () => {
  if (process.env.NODE_ENV === "development") {
    const response = signalPhaseData;

    return response;
  }

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_PHASE as string);
  const response = await result.json();

  return response;
}

const getSignalTimingData = async () => {
  if (process.env.NODE_ENV === "development") {
    const response = signalTimingData;

    return response;
  }
  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_TIMING as string);
  const response = await result.json();

  return response;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const standardPosition = await JSON.parse(req.body);
  const mapData = await getMapData();
  const signalPhase = await getSignalPhaseData();
  const signalTiming = await getSignalTimingData();

  const aroundSignal = mapData.filter((data: any) => {
    const signalPosition = {
      lat: data.mapCtptIntLat / 10000000,
      lng: data.mapCtptIntLot / 10000000,
    }

    if (getDistance(standardPosition, signalPosition) <= 2) {
      const phase = signalPhase.find((signal: any) => signal.itstId === data.itstId);
      const timing = signalTiming.find((signal: any) => signal.itstId === data.itstId);

      data.lat = signalPosition.lat;
      data.lng = signalPosition.lng;
      data.phase = phase;
      data.timing = timing;

      return data;
    }
  });

  res.status(200).json(aroundSignal);
}
