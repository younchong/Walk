import { Manhead, Middlepart, Torso, WalkingMan, ManBody, LHand, RHand, LLeg, RLeg } from './style';

function LoadingSpinner() {

  return (
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
  )
}

export { LoadingSpinner };
