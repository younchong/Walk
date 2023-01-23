import { SetStateAction } from "react";

type ScriptProps = {
  setMapLoaded: (value: SetStateAction<boolean>) => void,
}

export const initScript = ({ setMapLoaded }: ScriptProps) => {
  const script = document.createElement("script");

  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_API_KEY}&autoload=false`;
  script.addEventListener("load", () => setMapLoaded(true));

  document.head.append(script);
}
