export function translatePhase(phase: string) {
  if (phase.includes("stop")) return true;
  return false;
}

export function analyzeDirectionAndTime(direction: string, timing: {[index: string]: number}): [string, number] {
  if (direction.includes("nt")) {
    return ["북쪽", Math.floor(timing["ntPdsgRmdrCs"] / 10)];
  }

  if (direction.includes("et")) {
    return ["동쪽", Math.floor(timing["etPdsgRmdrCs"] / 10)];
  }

  if (direction.includes("st")) {
    return ["남쪽", Math.floor(timing["stPdsgRmdrCs"] / 10)];
  }

  if (direction.includes("wt")) {
    return ["서쪽", Math.floor(timing["wtPdsgRmdrCs"] / 10)];
  }

  if (direction.includes("ne")) {
    return ["북동쪽", Math.floor(timing["nePdsgRmdrCs"] / 10)];
  }

  if (direction.includes("nw")) {
    return ["북서쪽", Math.floor(timing["nwPdsgRmdrCs"] / 10)];
  }

  if (direction.includes("se")) {
    return ["남동쪽", Math.floor(timing["sePdsgRmdrCs"] / 10)];
  }

  if (direction.includes("sw")) {
    return ["남서쪽", Math.floor(timing["swPdsgRmdrCs"] / 10)];
  }

  return ["", 0];
}
