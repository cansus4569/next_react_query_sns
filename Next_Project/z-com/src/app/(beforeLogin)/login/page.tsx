'use client';
// import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Main from '../_component/Main';

export default function Login() {
  // 서버에서 리다이렉트를 사용하려면 redirect를 사용해야 한다.
  // redirect('i/flow/login');

  // 클라이언트에서 리다이렉트를 사용하려면 useRouter를 사용해야 한다.
  const router = useRouter();
  router.replace('/i/flow/login');
  return <Main />;
}

// router.push
// localhost:3001 -> localhost:3001/login -> localhost:3001/i/flow/login

// router.replace
// localhost:3001 -> localhost:3001/login -> localhost:3001/i/flow/login

// 둘의 차이는 뒤로가기 액션을 할 때 차이가 난다.
// push는 이전 페이지로 이동할 수 있지만 replace는 이전 페이지로 이동할 수 없다.
