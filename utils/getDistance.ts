interface position {
  lat: number,
  lng: number,
}

export default function getDistance(myPosition: position, signalPosition: position) {
  const degToRad = (deg: number) => deg * (Math.PI / 180);

  const Radius = 6371;
  const lat = degToRad(myPosition.lat - signalPosition.lat);
  const lon = degToRad(myPosition.lng- signalPosition.lng);
  const a = Math.sin(lat/2) * Math.sin(lat/2) + Math.cos(degToRad(myPosition.lat)) * Math.cos(signalPosition.lat) * Math.sin(lon/2) * Math.sin(lon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = Radius * c; // Distance in km

  return d;
}
