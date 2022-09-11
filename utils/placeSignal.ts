interface phase {
  [index: string]: string
}

interface position {
  title: string;
  latlng: any;
  phase: phase;
}

export default function placeSignal(position: position, direction: string, phase: string, map: any) {
  const earth = 6378.137;
  const pi = Math.PI;
  const m = (1 / ((2 * pi / 360) * earth)) / 1000;
  const cos = Math.cos;
  let latlng

  if (direction.includes("nt")) {
    const newLat = position.latlng.getLat() + (10 * m);
    latlng = new window.kakao.maps.LatLng(newLat, position.latlng.getLng());
  }

  if (direction.includes("et")) {
    const newLng = position.latlng.getLng() + (10 * m) / cos(position.latlng.getLat() * (pi / 180));
    latlng = new window.kakao.maps.LatLng(position.latlng.getLat(), newLng);
  }

  if (direction.includes("st")) {
    const newLat = position.latlng.getLat() + (-10 * m);
    latlng = new window.kakao.maps.LatLng(newLat, position.latlng.getLng());
  }

  if (direction.includes("wt")) {
    const newLng = position.latlng.getLng() + (-10 * m) / cos(position.latlng.getLat() * (pi / 180));
    latlng = new window.kakao.maps.LatLng(position.latlng.getLat(), newLng);
  }

  if (direction.includes("ne")) {
    const newLat = position.latlng.getLat() + (10 * m);
    const newLng = position.latlng.getLng() + (10 * m) / cos(position.latlng.getLat() * (pi / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  if (direction.includes("nw")) {
    const newLat = position.latlng.getLat() + (10 * m);
    const newLng = position.latlng.getLng() + (-10 * m) / cos(position.latlng.getLat() * (pi / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  if (direction.includes("se")) {
    const newLat = position.latlng.getLat() + (-10 * m);
    const newLng = position.latlng.getLng() + (10 * m) / cos(position.latlng.getLat() * (pi / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  if (direction.includes("sw")) {
    const newLat = position.latlng.getLat() + (-10 * m);
    const newLng = position.latlng.getLng() + (-10 * m) / cos(position.latlng.getLat() * (pi / 180));
    latlng = new window.kakao.maps.LatLng(newLat, newLng);
  }

  const content = document.createElement("div");
  content.classList.add("signal");

  if (phase.includes("stop")) content.classList.add("off");

  const point = new window.kakao.maps.CustomOverlay({
    position: latlng,
    content,
    map,
  });

  point.setMap(map);

  return point;
}
