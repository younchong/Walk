export type ContainerProps = {
  isActive: boolean;
}

export type ContainerMarginProps = {
  hasSignals: boolean;
}

export type RangeItemProps = {
  isClicked: boolean;
}

export type SignalTypes = {
  title: string,
  timing: {[index: string]: number},
  phase: {[index: string]: string},
  latlng: {La: number, Ma: number}
}

export type SignalListProps = {
  map: any
}

export type AvailableRanges = "0.5" | "1" | "1.5" | "2";

export type RangesType = {
  [range in AvailableRanges]: boolean;
}
