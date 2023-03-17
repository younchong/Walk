// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getDistance from '../../utils/getDistance'
import { UpdatedLocation, Location, SignalInformation, SignalPhase, SignalTiming } from './type'
import signalPhaseData from "../../data/phaseMockData.json"
import signalTimingData from "../../data/timingMockData.json"
import mapData from "../../data/mapMockData.json"

const mapStore: UpdatedLocation[] = [];

const getMapData = async () => {
  if (mapStore.length) return mapStore;

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_MAP as string);
  const response: Location[] = await result.json();

  response.forEach((data: Location) => mapStore.push({
    ...data,
    lat: data.mapCtptIntLat / 10000000,
    lng: data.mapCtptIntLot / 10000000,
  }));

  return mapStore;
}

const getAroundLocationList = async (userPosition: UpdatedLocation) => {
  const mapData = await getMapData();
  const aroundLocationList: UpdatedLocation[] = [];

  mapData.forEach((location: UpdatedLocation) => {
    if (getDistance(userPosition, location) <= 2) {
      aroundLocationList.push(location);
    }
  });

  return aroundLocationList as UpdatedLocation[];
}

const getSignalPhaseData = async () => {
  if (process.env.NODE_ENV === "development") {
    const response = signalPhaseData;

    return response as unknown as SignalPhase[];
  }

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_PHASE as string);
  const response: SignalPhase[] = await result.json();

  return response;
}

const getSignalTimingData = async () => {
  if (process.env.NODE_ENV === "development") {
    const response = signalTimingData;

    return response as unknown as SignalTiming[];
  }

  const result = await fetch(process.env.NEXT_PUBLIC_SIGNAL_TIMING as string);
  const response: SignalTiming[] = await result.json();

  return response;
}

const createSignalMap = (informations: SignalPhase[] | SignalTiming[]) => {
  const filteredMap = new Map<string, SignalPhase | SignalTiming>();

  informations.forEach((information: SignalPhase | SignalTiming) => {
    filteredMap.set(information.itstId, information);
  });

  return filteredMap;
}

export default async function getAroundSignalInformation(
  req: NextApiRequest,
  res: NextApiResponse<SignalInformation[]>
) {
  const userPosition = JSON.parse(req.body);
  const [aroundLocationList, signalPhase, signalTiming] = await Promise.all([getAroundLocationList(userPosition), getSignalPhaseData(), getSignalTimingData()]);
  const signalPhaseMap = createSignalMap(signalPhase);
  const signalTimingMap = createSignalMap(signalTiming);
  const aroundSiganlInformation: SignalInformation[] = aroundLocationList.map((location: UpdatedLocation) => {
    const information: SignalInformation = {...location, phase: null, timing: null};
    const locationId = location.itstId;

    information.phase = signalPhaseMap.get(locationId) || null;
    information.timing = (signalTimingMap as Map<string, SignalTiming>).get(locationId) || null;
    
    return information;
  });

  res.status(200).json(aroundSiganlInformation);
}
