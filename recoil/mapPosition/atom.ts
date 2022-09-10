import { atom } from "recoil";

const mapPositionAtom = atom({
  key: "mapPosition",
  default: {lat:33.450701, lng: 126.570667},
});

export default mapPositionAtom;
