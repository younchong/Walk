import { atom } from "recoil";
import { signal } from '../../Components/SignalList';

const aroundSignalsAtom = atom<signal[]>({
  key: "aroundSignals",
  default: [],
  dangerouslyAllowMutability: true,
});

const distanceAtom = atom<number>({
  key: "distanceAtom",
  default: 0.5,
});

const mapAroundSignalsAtom = atom<any[]>({
  key: "mapAroundSignals",
  default: [],
  dangerouslyAllowMutability: true,
});

export { aroundSignalsAtom, distanceAtom, mapAroundSignalsAtom };
