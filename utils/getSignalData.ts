interface position {
  lat: number,
  lng: number,
}

export default async function getSignalData(position: position) {
  const data = await fetch(window.location.origin + "/api/signal", {
    method: "POST",
    body: JSON.stringify(position),
  });

  return data.ok ? data.json() : [];
}
