const removeSignals = (signals: any[]) => {
  signals.forEach((signal: any) => {
    signal.setMap(null);
  });
}

export default removeSignals;
