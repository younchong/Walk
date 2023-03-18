import { atom } from "recoil";
import { AvailableRanges, SignalTypes } from '../../Components/SignalList/type';

const listedSignalsAtom = atom<SignalTypes[]>({
  key: "listedSignals",
  default: [],
  dangerouslyAllowMutability: true,
});

const distanceAtom = atom<AvailableRanges>({
  key: "distanceAtom",
  default: "0.5",
});

const mapAroundSignalsAtom = atom<any[]>({
  key: "mapAroundSignals",
  default: [],
  dangerouslyAllowMutability: true,
});


export { listedSignalsAtom, distanceAtom, mapAroundSignalsAtom };
