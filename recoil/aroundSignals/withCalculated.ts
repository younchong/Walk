import { selector } from "recoil";
import { aroundSignalsAtom, distanceAtom } from "./atom";
import myPositionState from '../myPosition/atom';
import getDistance from '../../utils/getDistance';
import { SignalTypes } from '../../Components/SignalList/type';

const signalWithCalculatedDistance = selector({
  key: "calcultedDistanceSignals",
  get: ({ get }) => {
    const myPosition = get(myPositionState);
    const signals = get(aroundSignalsAtom);
    const distance = get(distanceAtom);

    return signals.filter((signal: SignalTypes) => {
      const signalPosition = {
        lat: signal.latlng.Ma,
        lng: signal.latlng.La
      };

      if (getDistance(myPosition, signalPosition) <= distance) return signal;
    });
  },
});

export default signalWithCalculatedDistance;
