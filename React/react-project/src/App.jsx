import { useEffect, useState } from 'react';
import './App.css';
import TodoForm from './Todo/TodoForm';
import TodoItems from './Todo/TodoItems';

// TODO 리스트 만들기
function App() {
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    // 이 컴포넌트가 마운트될 때 실행되는 함수
    return () => {
      // 이 컴포넌트가 언마운트될 때 실행되는 함수
    };
  }, []);

  useEffect(() => {
    //
  }); // 의존성 배열을 빼버리면, 리렌더링될때마다 실행됨

  useEffect(() => {
    // todo가 바뀔 때마다 실행됨
    // {} !== {} (객체는 주소값이 다르기 때문에)
    return () => {
      // todo가 바뀌기 전에 실행됨
    };
  }, [todo]);

  // todo가 a -> b 바뀌면
  // a useEffect -> a cleanup -> b useEffect

  const onSubmit = (newTodo) => {
    // 고차함수 활용한 방식
    const nextTodo = [
      ...todo,
      { title: newTodo, completed: false, id: Date.now() },
    ];
    setTodo(nextTodo); // 불변성
    console.log(todo); // 안 바뀜, 비동기 때문X (batch 때문이다.)
  };

  return (
    <>
      {' '}
      {/* Fragment */}
      <div className="App">TODO</div>
      <div className="App">
        {todo.length === 0 ? (
          <div>
            <div>할 일을 추가해보세요.</div>
            <TodoForm onSubmit={onSubmit} />
          </div>
        ) : (
          <>
            {todo.map((t, i) => (
              <TodoItems key={t.id} index={i} item={t} setTodo={setTodo} />
            ))}
            <TodoForm onSubmit={onSubmit} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
