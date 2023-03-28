# 걷다

<img src="./docs/걷다.png" />
보행자에게 주변 신호등 정보와 잔여시간을 제공하는 서비스 입니다.

### 개발 동기

신호등을 기다리면서 주변 신호등 상태와 잔여 시간 정보가 없어서 생긴 불편함을 해결하고자 시작한 프로젝트 입니다.

### 🏃‍♂️ [배포](https://walk.vercel.app/)

### 📚[개발 과정](https://velog.io/@ungun96/걷다)


# 사용 화면
<img  src="./docs/walk around.gif">

### 내 주변 신호 정보 제공

<img  src="./docs/walk map around.gif">

### 지도 중심 2km 반경 신호 정보 제공

<div>
  <img width="49%" src="./docs/hover info close.png">
  <img width="49%" src="./docs/hover info far.png">
</div>


### 위치클릭시 정보제공 및 지도 이동

# 모바일 최적화

<div>
  <img width="30%" src="./docs/홈화면 추가.jpg">
  <img width="30%" src="./docs/PWA저장.jpg">
  <img width="30%" src="./docs/pwa app 사용.gif">
</div>
  
 ### 홈 화면에 추가 버튼을 이용해서 web app으로 사용할 수 있습니다.
 
 <img src="./docs/PWA desktop.png">
 
 ### PWA 적용

# 기술 스택

  ### Next.js 
  * Code splitting
  * Zero Config
  * ~~공공 API 요청만 필요하므로 따로 서버 구축없이 Next 자체 서버로 API 요청, 응답 처리 가능~~ (자체 서버 개발중)
  
  ### Typescript
  * Static Type으로 컴파일 단계 오류 포착 가능
  * IDE에서 정보 표시로 개발 효율 증가
  * API Data Modeling으로 데이터 파악 용이

  ### Recoil 
  * 보일러 플레이트 없이 간결하고 최소 단위로 전역 상태 관리 가능
  
  ### React-Query
  * 서버 요청 및 응답 상황에 따른 데이터 관리에 용이


# 서비스 가능 지역

  <img src="./docs/서비스 가능 지역.png">
  
  ⛔️ 현재 API가 서울의 특정 지역에서만 제공돼서 앱 또한 제한적으로 제공됩니다.

  <img src="./docs/walker loading mapMoving.png">
  
  ⛔️ API가 불안정해서 응답값이 오지 않는 경우도 있습니다.

  ✅ 위 두가지 상황시 리로드 버튼(모달 헤더의 우측)을 눌러서 data를 다시 받아올 수 있습니다.

  ❌ No Data가 지속된다면 시간이 지난 후 사용해주세요.

# 추가 개선 사항

1. 자체 서버에서 신호등 정보를 AI를 통한 계산으로 제공 (공공 API 불안정 제거)
2. 유저의 이동 속도와 신호 시간 계산을 적용한 길찾기 알고리즘 구현으로 유저에게 최적의 루트 제공

#### Current Version 2.0.0
Visit [here](https://github.com/younchong/Walk/blob/main/CHANGELOG.md) for a detailed release notes
