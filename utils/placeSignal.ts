import { CreatedSignal } from "./createSignals";

type Props = {
  position: CreatedSignal,
  direction: string,
  phase: string, 
  map: any,
  title: string,
}

export default function placeSignal({ position, direction, phase, map, title }: Props) {
  const EARTH_RADIUS = 6378.137;
  const PI = Math.PI;
  const m = (1 / ((2 * PI / 360) * EARTH_RADIUS)) / 1000;
  const COS = Math.cos;
  let latlng

  if (direction.includes("nt")) {
    const newLat = position.latlng.getLat() + (10 * m);
    latlng = new window.kakao.maps.LatLng(newLat, position.latlng.getLng());
  }

  if (direction.includes("et")) {
    const newLng = position.latlng.getLng() + (10 * m) / COS(position.latlng.getLat() * (PI / 180));
    latlng = new window.kakao.maps.LatLng(position.latlng.getLat(), newLng);
  }

  if (direction.includes("st")) {
    const newLat = position.latlng.getLat() + (-10 * m);
    latlng = new window.kakao.maps.LatLng(newLat, position.latlng.getLng());
  }

  if (direction.includes("wt")) {
    const newLng = position.latlng.getLng() + (-10 * m) / COS(position.latlng.getLat() * (PI / 180));
    latlng = new window.kakao.maps.LatLng(position.latlng.getLat(), newLng);
  }

  if (direction.includes("ne")) {
    const newLat = position.latlng.getLat() + (10 * m);
    const newLng = position.latlng.getLng() + (10 * m) / COS(position.latlng.getLat() * (PI / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  if (direction.includes("nw")) {
    const newLat = position.latlng.getLat() + (10 * m);
    const newLng = position.latlng.getLng() + (-10 * m) / COS(position.latlng.getLat() * (PI / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  if (direction.includes("se")) {
    const newLat = position.latlng.getLat() + (-10 * m);
    const newLng = position.latlng.getLng() + (10 * m) / COS(position.latlng.getLat() * (PI / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  if (direction.includes("sw")) {
    const newLat = position.latlng.getLat() + (-10 * m);
    const newLng = position.latlng.getLng() + (-10 * m) / COS(position.latlng.getLat() * (PI / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  const content = document.createElement("div");
  content.classList.add("signal");
  
  const contentInfo = document.createElement("span");
  contentInfo.textContent = title;
  contentInfo.classList.add("signal-info");

  content.append(contentInfo);

  if (phase.includes("stop")) content.classList.add("off");
  else content.classList.add("on");

  const point = new window.kakao.maps.CustomOverlay({
    position: latlng,
    content,
    map,
  });

  point.setMap(map);

  return point;
}
