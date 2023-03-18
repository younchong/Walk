import { selector } from "recoil";
import { listedSignalsAtom, distanceAtom } from "./atom";
import myPositionState from '../myPosition/atom';
import getDistance from '../../utils/getDistance';
import { SignalTypes } from '../../Components/SignalList/type';
import mapMovingAtom from '../mapMoving/atom';
import mapPositionAtom from '../mapPosition/atom';

const signalWithCalculatedDistance = selector({
  key: "calcultedDistanceSignals",
  get: ({ get }) => {
    const position = get(mapMovingAtom) ? get(mapPositionAtom) : get(myPositionState);
    const signals = get(listedSignalsAtom);
    const distance = get(distanceAtom);

    return signals.filter((signal: SignalTypes) => {
      const signalPosition = {
        lat: signal.latlng.Ma,
        lng: signal.latlng.La
      };

      if (getDistance(position, signalPosition) <= distance) return signal;
    });
  },
});

export default signalWithCalculatedDistance;
