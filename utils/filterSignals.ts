interface phase {
  [index: string]: string
}

interface timing {
  [index: string]: number
}

interface signal {
  itstNm: string,
  lat: number, 
  lng: number, 
  phase: phase, 
  timing: timing
}

export default function filterSignals(signals: signal[]) {
  const filteredSignals = signals.map((position: signal) => {
    const phase: phase = {};
    const timing: timing = {};

    position.phase && Object.keys(position.phase).forEach(key => {
      if (position.phase[key] && key.includes("Pdsg")) {
        phase[key] = position.phase[key];
      }
    });

    position.timing && Object.keys(position.timing).forEach(key => {
      if (position.timing[key] && key.includes("Pdsg")) {
        timing[key] = position.timing[key];
      }
    });

    return {
      title: position.itstNm,
      latlng: new window.kakao.maps.LatLng(position.lat, position.lng),
      phase,
      timing,
    }
  });

  return filteredSignals;
}
