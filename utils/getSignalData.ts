import { SignalInformation } from "../pages/api/type";

type Position = {
  lat: number,
  lng: number,
}

export default async function getSignalData(position: Position): Promise<SignalInformation[] | []> {
  const data = await fetch(window.location.origin + "/api/signal", {
    method: "POST",
    body: JSON.stringify(position),
  });

  return data.ok ? data.json() : [];
}
