export function translatePhase(phase: string) {
  if (phase.includes("stop")) return "🔴";
  return "🟢";
}

export function translateDirection(direction: string, timing: {[index: string]: number}) {
  if (direction.includes("nt")) {
    return `북쪽 ${Math.floor(timing["ntPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("et")) {
    return `동쪽 ${Math.floor(timing["etPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("st")) {
    return `남쪽 ${Math.floor(timing["stPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("wt")) {
    return `서쪽 ${Math.floor(timing["wtPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("ne")) {
    return `북동쪽 ${Math.floor(timing["nePdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("nw")) {
    return `북서쪽 ${Math.floor(timing["nwPdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("se")) {
    return `남동쪽 ${Math.floor(timing["sePdsgRmdrCs"] / 10)}초`;
  }

  if (direction.includes("sw")) {
    return `남서쪽 ${Math.floor(timing["swPdsgRmdrCs"] / 10)}초`;
  }

  return "정보 없음";
}
