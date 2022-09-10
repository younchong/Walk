interface position {
  lat: number,
  lng: number,
}

export default async function getSignalData(position: position) {
  const data = await fetch("http://localhost:3000/api/signal", {
    method: "POST",
    body: JSON.stringify(position),
  });

  return data.json();
}
