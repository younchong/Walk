import { Dispatch, SetStateAction } from "react";
import { SetterOrUpdater } from "recoil";
import { debounce } from './debounce';

type MapPositionType = {
  lat: number;
  lng: number;
}

type MapProps = {
  myPosition: MapPositionType,
  setMap: Dispatch<SetStateAction<undefined>>,
  setMapPosition: SetterOrUpdater<MapPositionType>
}

export const initKakaoMap = ({ myPosition, setMap, setMapPosition }: MapProps) => {
  new window.kakao.maps.load(() => {
    const container = document.querySelector("#map");
    const options = {
      center: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
      level: 2
    };
    const map = new window.kakao.maps.Map(container, options);

    map.panTo(new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng));

    const myIcon = `<div id="me"></div>`;
    const currentOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
        content: myIcon,
        map: map
    });

    currentOverlay.setMap(map);
    setMap(map);

    const debouncedSetMapPosition = debounce(() => {
      const center = map.getCenter();
      const position = {
        lat: center.getLat(),
        lng: center.getLng(),
      };

      setMapPosition(position);
    }, 1000);

    new window.kakao.maps.event.addListener(map, "idle", debouncedSetMapPosition);
  });
}
