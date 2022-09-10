import { atom } from "recoil";

const aroundSignalsAtom = atom({
  key: "aroundSignals",
  default: []
});

const distanceAtom = atom({
  key: "distanceAtom",
  default: 0.5,
});

export { aroundSignalsAtom, distanceAtom };
