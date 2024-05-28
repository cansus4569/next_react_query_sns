# 섹션2. 본격 클론 시작!

## 레이아웃 클론하기

![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/4748f1c6-4442-487a-acd8-dc5e2cf6e004)

- flex container 안의 두 요소 가운데 정렬하기
  1. container에 `margin: 0 auto`
  2. container에 `justify-content: center`
  3. 각 flex 요소에 `flex-grow: 1`

부모가 flex인 경우에 부모 요소에 `margin: 0 auto`, `justify-content: center`가 적용되지 않을 때 방법3를 사용할 수 있다.

## useSelectedLayoutSegment로 ActiveLink 만들기

### ActiveLink 란?

다른 페이지로 이동이 가능한 사이드바(Link)를 클릭했을 때
현재 페이지가 active 상태로, 현재 페이지가 아닌 페이지들은 active 하지 않은 상태를 가진 링크를 `ActiveLink`라 부른다.

### 서버 컴포넌트를 클라이언트 컴포넌트로 전환하기

현재 ActiveLink를 만들어주기 위해서는 사용자가 ‘어떤’ 페이지에 있는지 알아야 한다.

이는 서버 컴포넌트에서는 할 수 없기 때문에 클라이언트 컴포넌트로 만들어 주는 작업이 필요하다.

```tsx
// (afterLogin)/layout.tsx
import { ReactNode } from 'react';
import style from '@/app/(afterLogin)/layout.module.css';
import Link from 'next/link';
import Image from 'next/image';
import zLogo from '../../../public/zlogo.png';

export default function AfterLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={style.container}>
      <header className={style.leftSectionWrapper}>
        // ...
        <nav>
          <ul>
            <NavMenu />
          </ul>
        </nav>
      </header>
      <div className={style.rightSectionWrapper}>// ...</div>
      {children}
    </div>
  );
}
```

로그인 이후의 레이아웃 컴포넌트에서 `<NavMenu />` 컴포넌트를 클라이언트 컴포넌트로 변경해주자.

```tsx
// (afterLogin)/_component/NavMenu.tsx
'use client';

export default function NavMenu() {
  return <></>;
}
```

### useSelectedLayoutSegment()

- 참조 : https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment

**useSelectedLayoutSegment()** 는 Nextjs에서 제공하는 훅으로 클라이언트 컴포넌트에서 사용되는 훅이다.

**레이아웃보다 한 수준 아래에 있는 active 경로 세그먼트를 읽을 수 있다.**
따라서 활성된 하위 세그먼트에 따라 스타일을 변경하는 상위 레이아웃 내부의 탭과 같은 탐색 UI에 유용하다.

```tsx
// (afterLogin)/_component/NavMenu.tsx
'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

export default function NavMenu() {
  const segment = useSelectedLayoutSegment();

  console.log(segment);

  return <></>;
}
```

![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/6711bc43-8aba-4096-8a4a-9121ff116148)

만약 위와 같은 폴더 구조를 가지고 있다면, segment는 폴더 이름과 같이 `[username]` `compose` `explore` .. 등등의 값을 가지게 된다.

세그먼트의 구조를 더 상세하게 받고 싶다면 `useSelectedLayoutSegments()` 훅을 사용하면 된다.

```tsx
// compose/tweet 일 때

console.log(useSelectedLayoutSegment()); // 'compose'
console.log(useSelectedLayoutSegments()); // ['compose', 'tweet']
```

#### public 폴더 안에 있는 이미지 경로 가져오기

```tsx
// src/app/(afterLogin)/_component/LogoutButton.tsx
export default function LogoutButton() {
  const me = {
    id: 'nor0',
    nickname: '노르',
    image: '/5Udwvqim.jpg', // '/'를 사용하여 public 폴더 안의 이미지를 가져올 수 있음
  };
}
```

#### onClick과 같은 함수가 서버 컴포넌트에 있으면 오류가 발생할 수 있기 때문에 클라이언트 컴포넌트로 변경해주어야 한다.

![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/c4c578c6-5121-4dc6-a971-08684120ebda)
![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/bcc3db60-9936-4389-9ef7-cf378bd08a94)

https://www.js-craft.io/blog/client-components-use-client-directive-nextjs-13/#when-to-use-the-use-client-directive-in-nextjs-13

#### onClick과 같은 함수를 사용할 때 서버 컴포넌트라면 왜 오류가 발생할까?

서버 컴포넌트 에서는 사용자에게 즉각적인 피드백을 제공하고 UI를 업데이트 할 수 없다. 즉, 이벤트 리스너를 사용할 수 없다.
그 이유는 서버 컴포넌트와 클라이언트 컴포넌트의 페이지 로드에 있다.

서버 컴포넌트는 서버에서 React에 의해 클라이언트 컴포넌트에 대한 참조를 포함하는 **RSC 페이로드** (React Server Component Payload)라는 특수 데이터 형식으로 렌더링된다. 이후 Nextjs가 RSC 페이로드와 클라이언트 컴포넌트의 JavaScript 지침을 사용하여 HTML을 렌더링한다. 따라서 JavaScript 번들 다운로드 및 구문 분석을 기다릴 필요없이 즉시 페이지 콘텐츠를 볼 수 있다.
이후 **_클라이언트에서 RSC 페이로드는 클라이언트 및 서버 컴포넌트 트리 조정 및 DOM 업데이트에 사용되고, JavaScript 지침을 hydrate에 사용하면서 클라이언트 컴포넌트를 구성한다_**. 해당 UI를 대화형, 즉 상호작용할 수 있게끔 만들기 때문에 서버 컴포넌트에서는 이벤트 리스너를 사용할 수 없는 것이다.
https://nextjs.org/docs/app/building-your-application/rendering/client-components#full-page-load

#### hydrate

hydrate는 이벤트 리스너를 DOM에 연결하여 정적 HTML을 대화형으로 만드는 프로세스이다.

#### SSR 방식과 서버 컴포넌트의 차이

SSR 방식은 서버 컴포넌트와 다른 방식이다. **서버에서 컴포넌트를 렌더링한다는 점에서는 동일하지만 렌더링의 결과값과 동작 방식이 다르다.**

SSR은 Prerendering의 방식으로 서버에서 HTML을 만들어낸다. 이후에 클라이언트로 전달된 JS 번들 파일과 수화되는 과정을 거쳐 React 컴포넌트로 사용된다. 기존의 React 컴포넌트이며 이를 클라이언트 컴포넌트라고 부른다.

서버 컴포넌트는 JSON과 유사한 형태가 만들어진다. 그 자체로 React 컴포넌트이기에 별도의 JS 번들 파일 없이 브라우저에서 컴포넌트로 사용된다. 새로운 컴포넌트이고 React Server Component, RSC라고 부른다.

#### \<img> 와 \<Image> 의 사용처

Nextjs에서는 서버에서 이미지를 최적화하여 클라이언트에 보내주는 `<Image>` 컴포넌트가 존재한다.
그렇다면, Nextjs 프로젝트에서는 기존 HTML 요소인 `<img>` 는 사용되지 않을까?

⇒ public 폴더는 프론트 서버에서 불러오는 정적 요소들이다. 따라서 고정되어 있는 것이기 때문에 한 번만 최적화 하면 되므로 `<Image>` 컴포넌트를 사용하기에 유용하다. 로그아웃 버튼에 사용되는 사용자의 아이콘 같은 경우, 백엔드 서버에서 불러오고 그때그때 로그인 한 사용자에 따라 이미지를 불러오게 된다. 따라서 굳이 프론트 서버인 Nextjs 서버의 리소스를 낭비하여 최적화하는 것이 적합하지 않다.

## 오른쪽 섹션 클로코딩

만약, 클래스명이나 css등 제대로 코드가 적용되지 않는다면 next 서버를 재실행하거나 `.next` 폴더를 삭제하고 다시 서버를 실행하자.

## 홈탭 만들면서 Context API 적용해보기

### 홈페이지 분석하기

#### Tab 컴포넌트

현재 탭은 `추천 / 팔로우` 중 으로 나뉘어져 있다. 탭 마다 보이는 포스트가 다르기 때문에 어떤 탭인지에 대한 상태값을 가지고 있어야 한다. **_따라서 추천 탭과 팔로우 중 탭은 클라이언트 컴포넌트라는 걸 유추해볼 수 있다._**

홈 페이지를 분석해보면 아래에 <Tab /> 컴포넌트와 <Post/> 컴포넌트가 병렬적으로 존재하고 있다. 사용자가 어떤 탭에 위치하냐에 따라 보여지는 게시글이 달라져야 하기 때문에 **_서로 탭의 상태를 공유_** 하고 있어야 한다. 이를 여러가지 방법으로 해결할 수 있지만, 제일 간단한 Context를 사용해서 해결해보자.
![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/c5a1612f-9bce-4f4f-b774-3a79ca48a987)

### Context API 적용하기

#### TabProvider 정의

Context API를 사용하기 위한 Provider를 정의한다.

현재 Tab의 상태를 전역으로 공유해야 하기 때문에 Tab에 대한 Provider로 정의하는 것.

```tsx
'use client';

import { ReactNode, createContext, useState } from 'react';

export const TabContext = createContext({
  tab: 'rec',
  setTab: (value: 'rec' | 'fol') => {},
});

type Props = { children: ReactNode };

export default function TabProvider({ children }: Props) {
  const [tab, setTab] = useState('rec');

  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
}
```

#### TabProvider 적용

상태를 공유하기 위해선 부모 컴포넌트에서 Provider를 적용해야하기 때문에 Home 페이지 컴포넌트에 Provider를 적용해준다.

```tsx
import Post from '../_component/Post';
import PostForm from './_component/PostForm';
import Tab from './_component/Tab';
import TabProvider from './_component/TabProvider';
import style from './home.module.css';

export default function Home() {
  return (
    <main className={style.main}>
      <TabProvider>
        <Tab />
        <PostForm />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </TabProvider>
    </main>
  );
}
```

## PostForm 만들기 (타이핑 외우기)

Form의 경우 대부분 이벤트 리스너가 많기 때문에 **클라이언트 컴포넌트** 라고 생각하면 좋다.
TypeScript에서 useRef를 사용할 때는 null을 디폴트 값으로 반드시 넣어야 한다.
Server Actions 기능을 사용하여 데이터를 요청하는 방법도 있지만, 아직 실험적인 기능이라 강의에서는 다루지 않을 예정

- https://codingapple.com/unit/nextjs-server-actions/

## 게시글 만들며 dayjs 사용해보기

- dayjs.fromNow()
  - 현재 시간으로부터 상대 시간 문자열을 반환한다.
  - 매개변수에 true를 전달하면 접미사 없는 값을 얻을 수 있다.
  - 메소드를 사용하기 위해서는 RelativeTime 플러그인이 필요하다.
  ```tsx
  import relativeTime from 'dayjs/plugin/relativeTime';
  ```
  - dayjs 플러그인 적용하기
  ```tsx
  import 'dayjs/locale/ko';
  dayjs.locale('ko'); // 한글 플러그인 설정
  dayjs.extend(relativeTime); // relativeTime 플러그인 설정
  ```

https://day.js.org/docs/en/display/from-now

## classnames로 클래스 합성하기 (npmtrends로 라이브러리 고르기)

### classnaems 라이브러리

classnames 라이브러리를 사용하면 여러 클래스를 추가하거나, 조건부로 클래스명을 줄 수 있다.
css modules를 사용할 때 상태에 따른 클래스명을 부여해야할 경우 유용하게 쓸 수 있다.

#### 사용 예시

```tsx
import cx from "classnames";

// 조건부 클래스명을 주는 방법은 여러가지가 존재한다.
<div className={cx(style.commentButton, { [style.commented]: commented })}>
<div className={cx(style.repostButton, reposted && style.reposted)}>
<div className={cx([style.heartButton, liked && style.liked])}>
```

npm trends 사이트를 통해 현재 사용하고 있는 라이브러리와 비슷한 경쟁 라이브러리를 비교해본 후,
사용 빈도 수가 많은 것을 선택하는 것이 좋다. (안정성)
