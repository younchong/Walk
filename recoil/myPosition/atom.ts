import { atom } from "recoil";

const myPositionAtom = atom({
  key: "myPosition",
  default: {lat:33.450701, lng: 126.570667},
});

export default myPositionAtom;
