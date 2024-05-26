# 섹션1. 기획자와 디자이너가 기획서를 던져주었다.

## Next 프로젝트 시작하기

```
KEY POINT
- 화면을 어떻게 만들 것이냐
- 주소 체계 파악하기
```

### 프로젝트 설치

```sh
$ npx create-next-app
```

### 폴더구조 분석

<strong>pubic 폴더</strong>

- 넥스트 서버에서 누구나 접근할 수 있게 서비스 해준다.
- 모든 사람이 접근할 수 있는 사이트에서 쓰일 이미지 등을 넣는 것이 좋다.

<strong>src 폴더</strong>

- 주로 루트 아래에 src, app이 별도로 있는 것이 원칙이지만 `src/app` 구조는 타입스크립트를 한번에 처리하기에 용이하다.

<strong>app 폴더</strong>

- 주소와 관련된 파일이 들어가 있다.

<strong>next.config.js</strong>

- 넥스트 설정 파일

<strong>tsconfig.json</strong>

- 타입스크립트 설정 파일

```
path alias
경로에 대한 별칭
ex) 기본 상대 경로 import - ../../../components/Header
ex) path alias 사용 - @/components/Header
```

## 브라우저 주소 app 폴더에 반영하기

### 레이아웃

- 여러 페이지에서 공유되는 UI

#### RootLayout

- 최상위 레이아웃을 `RootLayout` 으로 정의할 수 있고, 필수 레이아웃이다.
- `app`의 모든 경로에 적용된다.
- 루트 레이아웃에는 `html` 및 `body` 태그가 포함되어야 한다.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- 레이아웃의 children에는 app폴더 하위에 정의된 page.tsx 컴포넌트가 렌더링된다.

```
app/layout.tsx와 app/home/layout.tsx, app/home/page.tsx가 존재하는 경우

app/layout.tsx에 정의환 RootLayout -> HomeLayout -> HomePage의 계층 구조가 형성된다.
```

### 페이지

- 경로에 대한 고유한 UI
- `src/page.tsx` 는 애플리케이션으이 baseURL 화면에 보여진다.
- `app` 디렉터리 내에 page.js 를 추가하여 해당 경로의 첫 번째 페이지를 만들 수 있다.

### 경로에 맞게 폴더 구성하기

- `baseURL/i/flow/login`, `baseURL/i/flow/signup` 라는 경로가 애플리케이션에 존재한다면,  
  app 폴더 하위에 해당 경로와 동리하게 폴더를 구성하면된다.

```
src
└ app
  └ i
    └ flow
       ├ login
       └ signup
```

#### 다이나믹 라우팅

- 정확한 세그먼트 이름을 모르고 동적 데이터에서 경로를 생성하려는 경우, 동적 세그먼트를 사용할 수 있다.

```
만약 다이나믹 라우팅에 사용되는 폴더명과 다이나믹 라우팅이 아닌 폴더명이 동시에 존재한다면, 다이나믹 라우팅의 폴더명은 최후순위가 된다.

[username] 폴더와 home 폴더가 app 폴더 아래에 존재했을 때 유저명이 'home'일 경우
-> 동적 세그먼트는 최후순위이기 때문에 유저 프로필 페이지가 아닌 home 페이지가 보여지게 된다.
따라서 동적 세그먼트에 사용되는 params들이 다른 라우팅과 겹치지 않도록 하는 것이 제일 좋다.
```

`[폴더명]`

- 동적 세그먼트는 폴더 이름을 대괄호로 묶어 생성할 수 있다.
- 현재 트위터의 경우 username에 따라 userA/status, userB/status, ... 의 경로들을 갖게 된다.
- 따라서 해당 경로에 따른 폴더는 대괄호를 묶어 생성해주면 된다.

```
src
└ app
   └ [username]
        └ status
```

![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/144b2089-82b9-4345-8416-c75283691050)

- 주소창에 username만 있는 경우 해당 유저의 프로필 페이지([username]/page.tsx)가 렌더링 된다.
- `username/status/1` 혹은 `username/status/2` 라는 url이 있는 경우 해당 유저의 각 게시물 페이지 ([username]/status/[id]/page.tsx)가 렌더링 된다.

#### Not Found 페이지

참조 : https://nextjs.org/docs/app/api-reference/file-conventions/not-found
![image](https://github.com/cansus4569/next_react_query_sns/assets/63139527/f4c6bfda-9301-4d58-967a-1d4102fb5dd7)

- app 폴더 내부에서 라우팅에도 해당 되지 않고, layout.tsx나 page.tsx가 아닌 페이지는 not-found.tsx로 이동되게 된다.

## 라우트 그룹

- 일반적으로 `app` 폴더 하위의 폴더는 URL 경로로 매핑된다.
- 하지만 폴더명을 소괄호로 묶어 생성하면 URL 경로 구조에 영향을 주지 않고 그룹화하여 경로를 구성할 수 있다.

ex) app/(afterLogin)/home 의 경우 브라우저 URL에는 /home 으로 보이게 된다.

`(폴더명)`
폴더 이름을 소괄호로 묶어 생성할 수 있다.

```
라우트 그룹의 경우 별도의 layout을 가질 수 있다.
따라서 그룹별 레이아웃을 다르게 설정할 수 있다는 장점이 있다.
```

```
대부분 그룹화를 하는 기준은 레이아웃에 있었다.
```

## template.tsx, Link, Image, redirect

### template.tsx

- 레이아웃의 경우 애플리케이션 내에서 페이지 이동 시 리렌더링이 되지 않는다.
- 페이지 이동 시에는 '페이지'만 리렌더링 되는데, 만약 레이아웃도 리렌더링이 되게 하고 싶다면 `template.tsx`를 사용하면 된다.
  - 리렌더링 보다는 새롭게 마운트 된다는 의미가 더 적절하다.

```
템플릿
레이아웃과 유사하지만, 사용자가 템플릿을 공유하는 경로 사이를 탐색할 때 구성 요소의 새 인스턴스가 마운트되고
DOM 요소가 다시 생성되며 상태가 유지되지 않고 다시 동기화 하ㅓㄴ다.

useEffect (ex. 페이지 보기 로깅) 및 useState (ex. 페이지별 피드백 양식)에 의존하는 기능의 경우 템플릿이 더 적합하다.

템플릿과 레이아웃은 같이 사용되지 않는다.
```

```
Next.js 공식 문서의 Template 예제에 따르면 레이아웃과 자식요소 사이에 렌더링 된다는 예제가 나와있다.
```

https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates

### Link

`<Link>`는 HTML의 `<a>`를 확장한 리액트 컴포넌트이다.
prefetching 및 클라이언트 측 탐색을 제공하며, `<a>` 사용시에는 새로고침이 발생하지만, `<Link>`의 경우 새로고침이 되지 않는다.

```
prefetching
사용자가 경로를 방문하기 전에 백그라운드에서 경로를 미리 로드하는 방법이다.
경로가 사용자의 뷰포트에 표시되면 자동으로 가져오며 페이지가 처음 로드될 때 또는 스크롤을 통해 표시될 때 발생한다.

`<Link>`의 prop으로 활성화 여부를 설정할 수 있으며, 기본값은 true이다.
Dev 모드에서는 활성화 되지 않고 Production에서만 활성화 된다.
```

### Image

`<img>`가 아닌 `<Image>`를 사용하게 되면 import 한 이미지를 Next에서 자동으로 최적화해준다.

```
Next에서는 이미지를 상대 경로/절대 경로로 import 해서 사용할 수 있다.
```

### redirect

`redirect` 함수는 다른 URL로 유저를 리다이렉트 시킬 수 있다.

```jsx
redirect(path, type);
```

기본적으로 `use server`를 사용한 서버 액션에서는 type은 `push`가 기본 값이며 **_브라우저 기록 스택에 리다이렉트 되는 URL이 추가되고_**,
그 외의 경우에는 `replace` 타입이 기본값이므로 **_브라우저 기록 스택의 현재 URL을 대체_** 한다.

## CSS Module을 선택한 이유

### 자주 사용되는 CSS

- tailwind
- Styled Components or Emotion
- sass
- css module
- vanilla extract

#### tailwind

- 호불호가 심하며, 가독성이 좋지 않다.
- tailwind 가곡성은 `tailwind variants` 으로 어느정도 해결할 수 있다.
  - https://www.tailwind-variants.org

#### Styled Components / Emotion

- Emotion의 경우 Next13 에서 잘 동작하지 않는다.
- Styled Components는 서버 컴포넌트에서 SSR쪽에 문제가 발생할 수 있다.

#### vanilla extract

- Windows와 문제가 발생한다.
- 2023.11.9 해결된것으로 보인다.

#### css 새로운 단위 `dvw`, `dvh`

- 기존에는 뷰포트 단위로 너비나 높이 값을 주고 싶을 때 `vw` `vh`를 사용했다.
- 이는 100vh로 설정했을 때, 모바일에서 주소 표시줄 영역에 의해 화면이 잘리거나 주소 표시줄이 없이지는 경우가 발생했다.
- 따라서 `-webkit-fill-available`을 height값에 적용하는 방법이 있는데, 이 방법은 ios에만 적용되고 안드로이드에는 적용되지 않는 문제가 있어 권장되지 않는다.

```css
div {
  height: 100vh;
  height: -webkit-fill-available;
}
```

- `dvh`는 주소 표시줄이 스크롤을 통해 축소가 되건, 노출이 되고 있건 상관없이 현재 보여지는 뷰포트 높이를 **_동적_** 으로 가져와 이 문제를 해결할 수 있다.
  ![CleanShot 2024-05-26 at 23 01 44](https://github.com/cansus4569/next_react_query_sns/assets/63139527/b77323d5-70d6-4fd6-ad65-b03c18fc36b6)

## 패러렐 라우트

### 패러렐 라우트 (Parallel Route)

Parallel은 **_병렬_** 이라는 의미를 가지고 있다.
즉, Parallel Route는 병렬 라우트로 해석할 수 있고, **_병렬 라우팅을 사용하면 동일한 레이아웃에서 하나 이상의 페이지를 동시에 또는 조건부로 렌더링할 수 있다._**
![CleanShot 2024-05-26 at 23 09 06](https://github.com/cansus4569/next_react_query_sns/assets/63139527/af50b558-85d2-4ea5-9bc5-79aaa165a2f3)
병렬 라우팅을 사용하면 경로가 독립적으로 스트리밍 될 때, 각 경로에 대해 독립적인 오류 및 로드 상태를 정의할 수 있다.

![CleanShot 2024-05-26 at 23 09 45](https://github.com/cansus4569/next_react_query_sns/assets/63139527/14713cd1-afdb-4bb0-871d-57af3a000177)

#### 구현하고자 하는 것

- `app/page.tsx`가 바탕이 되고, `i/flow/login/page.tsx`가 모달 형식으로 띄워지는 화면
- 이는 위에서 설명한 '패러렐 라우트' (+ 인터셉팅 라우트)로 구현할 수 있다.
  https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals

```
기존 모달과의 차이점
기존 모달과의 차이점은 주소가 바뀌냐 안 바뀌느냐의 차이다.
패러렐 라우트는 동시에 띄워진 페이지의 주소가 각각 다르고, 기존 모달은 주소 변경없이 모달이 동작한다.
```

#### 페러렐 라우트 사용하기

패러렐 라우트는 명명된 **_슬롯_** 을 사용하여 생성된다.

`@folder`
생성된 슬롯은 경로 세그먼트가 아니기 떄문에 URL 구조에 영향을 주지 않는다.
![CleanShot 2024-05-26 at 23 13 19](https://github.com/cansus4569/next_react_query_sns/assets/63139527/f6b852e9-ddd3-430b-9471-97a08156cec6)

```tsx
export default function Layout(props: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.team}
      {props.analytics}
    </>
  );
}
```

위와 같은 형태로 슬롯을 생성했다면 예시와 같이 app/layout.tsx 에서 @analytics의 페이지와 @team 페이지, children을 병렬로 렌더링 할 수 있다.

```
children prop은 폴더에 매핑할 필요가 없는 암시적 슬롯이다.
즉, app/page.tsx와 app/@children/page.tsx 는 동일하다.
```

```
다른 계층 구조를 갖고 있는 페이지는 병렬로 렌더링 할 수 없다.
app/page.tsx와 app/(beforeLogin)/@modal/page.tsx 는 병렬로 렌더링 할 수 없다는 의미이다.
따라서 병렬로 렌더링 하기 위해서는 슬롯과 다른 슬롯(혹은 페이지)가 같은 계층 구조를 가져야 한다.
```

![CleanShot 2024-05-26 at 23 16 45](https://github.com/cansus4569/next_react_query_sns/assets/63139527/1283df68-1774-48dd-b2e1-43fc1569b9e7)

```tsx
// app/(beforeLogin)/layout.tsx
import { ReactNode } from 'react';

type Props = { children: ReactNode; modal: ReactNode };

export default function Layout({ children, modal }: Props) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}

// 주소가 localhost:3001일 때는 children->page.tsx, modal->@modal/default.tsx
// 주소가 localhost:3001/i/flow/login 때는 chldren->i/flow/login/page.tsx, modal->@modal/i/flow/login/page.tsx
```

같은 상위 폴더(beforeLogin) 아래에 `@modal` 슬롯과 `layout.tsx`가 같이 있다면 별다른 import 없이 `modal`을 props로 가져와 패러렐 라우트를 구성할 수 있다.

위 코드에서 `page.tsx`는 `layout.tsx`의 `{children}`에 렌더링되고, `@modal`은 `{modal}`에 렌더링 된다.

## 클라이언트 컴포넌트로 전환하기

## default.tsx

## 인터셉팅 라우트

## private folder (\_폴더)

## 로그인 모달에서 발생하는 문제 해결하기 (router.replace)
