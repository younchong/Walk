import { useEffect, useState, useCallback } from "react";
import { Container, Spinner, Text } from "./style";

type Props = {
  refetch: () => void;
}

function RefetchBtn({ refetch }: Props) {
  const [refetchTime, setRefetchTime] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);

  const MemoOnClickRefetch = useCallback(() => {
    refetch();
    setIsActive(true);
    setRefetchTime(60);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  }, [isActive]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefetchTime(prev => {
        if (!prev) {
          refetch();
          setIsActive(true);

          return 60;
        }

        return prev - 1});
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <Container onClick={MemoOnClickRefetch}>
      <Spinner isActive={isActive}>
        <Text>{refetchTime}</Text>
      </Spinner>
    </Container>
    
  )
}

export { RefetchBtn };
