import { atom } from "recoil";

const myPositionState = atom({
  key: "myPosition",
  default: {lat: 37.666504, lng: 126.7500495},
});

export default myPositionState;
