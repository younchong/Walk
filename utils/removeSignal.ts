// signals는 point map에서 사용하는
const removeSignals = (signals: any[]) => {
  signals.forEach((signal: any) => {
    signal.setMap(null);
  });
}

export default removeSignals;
