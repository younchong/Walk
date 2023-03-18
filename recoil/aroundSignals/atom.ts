import { atom } from "recoil";
import { SignalTypes } from '../../Components/SignalList/type';

const listedSignalsAtom = atom<SignalTypes[]>({
  key: "listedSignals",
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


export { listedSignalsAtom, distanceAtom, mapAroundSignalsAtom };
