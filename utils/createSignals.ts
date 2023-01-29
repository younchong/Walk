import { SignalInformation, SignalPhase, SignalTiming } from "../pages/api/type";

type SignalPhaseKey = keyof  SignalPhase;
type SignalTimingKey = keyof SignalTiming;

type Phase = {
  [index: string | SignalPhaseKey]: string;
};

type Timing = {
  [index: string | SignalTimingKey]: number
}

type CreatedSignal = {
  title: string,
  latlng: any,
  phase: Phase,
  timing: Timing,
}


export function createSignals(signals: SignalInformation[]): CreatedSignal[] {
  const filteredSignals = signals.map((signal: SignalInformation) => {
    const phase: Phase = {};
    const timing: Timing = {};

    signal.phase && Object.keys(signal.phase).forEach((key) => {
      if (signal.phase && signal.phase[key as SignalPhaseKey] && key.includes("Pdsg")) {
        phase[key as SignalPhaseKey] = signal.phase[key as SignalPhaseKey] as string;
      }
    });

    signal.timing && Object.keys(signal.timing).forEach(key => {
      if (signal.timing && signal.timing[key as SignalTimingKey] && key.includes("Pdsg")) {
        timing[key as SignalTimingKey] = signal.timing[key as SignalTimingKey] as number;
      }
    });

    return {
      title: signal.itstNm,
      latlng: new window.kakao.maps.LatLng(signal.lat, signal.lng),
      phase,
      timing,
    }
  });

  return filteredSignals;
}
