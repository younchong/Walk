import { Manhead, Middlepart, Torso, WalkingMan, ManBody, LHand, RHand, LLeg, RLeg, Container, TextBox } from './style';

type Props = {
  text?: string;
}

function LoadingSpinner({ text }: Props) {

  return (
    <Container>
      <WalkingMan>
        <ManBody>
          <Torso>
            <Manhead/>
              <Middlepart />
              <LHand />
              <RHand />
          </Torso>
          <LLeg />
          <RLeg />
        </ManBody>
      </WalkingMan>
      <TextBox>
        {text}
      </TextBox>
    </Container>
  )
}

export { LoadingSpinner };
