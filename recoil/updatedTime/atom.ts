import { atom } from "recoil";

const updatedTimeAtom = atom({
  key: "updatedTime",
  default: Date.now(),
});

export default updatedTimeAtom;
