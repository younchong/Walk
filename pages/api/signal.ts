// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import signalPhaseData from "../../data/phaseMockData.json"
import signalTimingData from "../../data/timingMockData.json"
import getDistance from '../../utils/getDistance'
import mapData from "../../data/mapMockData.json"
import { UpdatedLocation, Location, SignalInformation, SignalPhase, SignalTiming } from './type'

const mapStore: UpdatedLocation[] = [];

const getMapData = async () => {
  if (mapStore.length) return mapStore;

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_MAP as string);
  const response = await result.json();

  response.forEach((data: Location) => mapStore.push({
    ...data,
    lat: data.mapCtptIntLat / 10000000,
    lng: data.mapCtptIntLot / 10000000,
  }));

  return mapStore;
}

const getAroundLocationList = async (userPosition: UpdatedLocation) => {
  const mapData = await getMapData();
  const aroundLocationList = mapData.map((location: UpdatedLocation) => {
    if (getDistance(userPosition, location) <= 2) return location;
  });

  return aroundLocationList;
}

const getSignalPhaseData = async () => {
  // if (process.env.NODE_ENV === "development") {
  //   const response = signalPhaseData;

  //   return response;
  // }

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_PHASE as string);
  const response: SignalPhase[] = await result.json();

  return response;
}

const getSignalTimingData = async () => {
  // if (process.env.NODE_ENV === "development") {
  //   const response = signalTimingData;

  //   return response;
  // }

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_TIMING as string);
  const response: SignalTiming[] = await result.json();

  return response;
}

const createSignalMap = (informations: SignalPhase[] | SignalTiming[]) => {
  const filteredMap = new Map();

  informations.forEach((info: SignalPhase | SignalTiming) => {
    filteredMap.set(info.itstId, info);
  });

  return filteredMap;
}

export default async function getAroundSignalInformation(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const userPosition = await JSON.parse(req.body);
  const [aroundLocationList, signalPhase, signalTiming] = await Promise.all([getAroundLocationList(userPosition), getSignalPhaseData(), getSignalTimingData()]);
  const signalPhaseMap = createSignalMap(signalPhase);
  const signalTimingMap = createSignalMap(signalTiming);
  const aroundSiganlInformation = aroundLocationList.map((location?: UpdatedLocation) => {
    const information = {...location, phase: null, timing: null};
    const locationId = location?.itstId;

    information.phase = signalPhaseMap.get(locationId);
    information.timing = signalTimingMap.get(locationId);
    
    return information;
  });

  res.status(200).json(aroundSiganlInformation);
}
