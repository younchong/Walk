import { FC, useState, useEffect } from "react";
import { translatePhase } from "../utils/signalUtils";
import { useRecoilValue } from 'recoil';
import updatedTimeAtom from '../recoil/updatedTime/atom';
import styled from '@emotion/styled';

const SignalInfomation = styled.div`
  margin-right: .7rem;
`;

interface Props {
  direction: string,
  phase: string,
  timing: number,
}

export const SignalDetail: FC<Props> = ({direction, phase, timing}) => {
  const [isStopSign, setIsStopSign] = useState<boolean>(translatePhase(phase));
  const [time, setTime] = useState<number | "정보 없음">(timing);
  const updatedTime = useRecoilValue(updatedTimeAtom);

  useEffect(() => {
    const goneTime = Math.floor((Date.now() - updatedTime) / 1000);
    const initialTime = time as number - goneTime;
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev === initialTime + goneTime) return initialTime - 1 > 0 ? initialTime - 1 : 0;
        if (prev > 0) return prev as number - 1;
  
        clearInterval(timer);
        setIsStopSign(!isStopSign);

        return "정보 없음";
      });
    }, 1000);
  }, []);

  return (
    <SignalInfomation>
      <span key={direction + timing}>{direction} {time} {Number.isInteger(time) ? "초" : ""}</span>
      <span key={direction + phase}>{isStopSign ? "🔴" : "🟢"}</span>
    </SignalInfomation>
    )
};

export default SignalDetail;
