import { atom } from "recoil";

const mapPositionAtom = atom({
  key: "mapPosition",
  default: {lat: 37.666504, lng: 126.7500495},
});

export default mapPositionAtom;
