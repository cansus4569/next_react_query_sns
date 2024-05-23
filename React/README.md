# React 복습

- meta (구 Facebook) 개발
- 점유율 1위 라이브러리
- 경쟁자 : vue, angular, svelte, preact, solid 등...

## 역사

jQuery > angular > react > vue > svelte

## 왜 나왔을까?

- 페이지 전환없이 앱 같은 느낌을 원함 (AJAX, ex: gmail)

  - 한 페이지에서 다하는 SPA(Single Page Application) 방식의 유행
  - 장점 : 데이터 유지면에서 좋음

- 프론트의 비중이 점점 높아짐 (데이터를 많이 다룸)
  - MVC 등의 개발 방식은 대규모 개발에 적합치 않음 -> 대안 필요

## 현재 모델

FLUX 패턴

- 1way binding
- ACTION -> DISPATCHER -> STORE -> VIEW -> ACTION ...

## 과거의 코드

HTML은 구조, CSS는 디자인, JS는 동작
한 페이지에 혼재 (Main은 HTML)

```html
<!-- 초창기 -->
<html>
  <head>
    <style>
      #next-button {
        border-radius: 50%;
        padding: 9rem 1.5rem;
      }
      .next-button {
        border-radius: 50%;
        padding: 9rem 1.5rem;
      }
    </style>
  </head>
  <body>
    <!-- 버튼이 하나일 경우 -->
    <button id="next-button">다음으로</button>
    <script>
      document.querySelector('#next-button').addEventListener('click', () => {
        console.log('다음으로');
      });
    </script>
    <!-- 버튼이 여러개일 경우 => 너무 많아지면 관리가 안되기 시작함 -->
    <button id="nb-1" class="next-button">다음으로</button>
    <button id="nb-2" class="next-button">다음으로</button>
    <button id="nb-3" class="next-button">다음으로</button>
    <script>
      document
        .querySelector('#nb-1')
        .addEventListener('click', () => console.log('다음으로1'));
      document
        .querySelector('#nb-2')
        .addEventListener('click', () => console.log('다음으로2'));
      document
        .querySelector('#nb-3')
        .addEventListener('click', () => console.log('다음으로3'));
      //document.querySelectorAll('.next-button').forEach((bt, idx) => {
      //    bt.addEventListener('click', () => console.log('다음으로' + idx))
      //})
    </script>
    <!-- 관리가 안되기 시작하니까 HTML을 JS로 생성하기 => 너무 힘듦(가독성) => 변수 겹침 등의 문제 -->
    <script>
      function createNextButton(idx) {
        const button = document.createElement('button');
        button.className = 'next-button';
        button.id = `nb-${idx}`;
        button.textContent = '다음으로';
        button.addEventListener('click', () => console.log('다음으로' + idx));
        document.body.append(button);
      }
      createNextButton(1);
      createNextButton(2);
      createNextButton(3);
    </script>
  </body>
</html>
```

## React 컴포넌트로 전환

- 각자 js와 css를 책임지자
- JSX 문법(Main은 JS)
- JS 실력이 매우 주요

```jsx
import { memo } from react;

interface Props {
    text: string;
    onClick: () => void;
    disabled?: boolean;
}
function NextBtn({text, onClick: onClickP, disabled }: Props) {
    const onClick = () => {
        onClickP();
    }
    return (
        <button
        className="rounded-full bg-urban-glow-green px-[9rem] py-[1.5rem] text-3xl text-bg-black"
        onClick={onClick}
        disabled={disabled}
        >
        {text}
        </button>
    )
}
NextBtn.defaultProps = {
    disabled: false
}
export default memo(NextBtn);
```

## JSX

- 확장자는 .jsx (타입슼트립트는 .tsx)
- 당연히 브라우저가 알아듣지 못함
  - 바벨, 웹팩, vite, swc 등의 툴로 js로 변환해주어야 함
- 이 때 여러 .jsx 파일을 하나의 .js파일로 합쳐주기도 함 (번들링)

## TS ?

- 타입스크립트는 대부분의 기업에서 사용 중
- 꼭 배워야하지만 JS를 어느 정도 익히고 나서 하면 된다.

## React 대원칙

1. 화면에서 바뀌는 것을 상태로 만들자
2. 반복 사용되는 것을 컴포넌트로 만들자
3. 비슷한데 다른 부분을 props로 만들자
4. 화면은 미리 다 만들어두고 보였다 안보였다 한다.
