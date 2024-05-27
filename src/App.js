import React, { useState } from 'react';
import './App.css';

function App() {

  const [mod, setMod] = useState([false, {
    title : null,
    memo : null,
    status : null
  }]);

  const [undo, setUndo] = useState([]);

  const [progress, setProgress] = useState([]);

  const [done, setDone] = useState([]);

  const [start , setStart] = useState({
    id : null,
    title : null,
    memo : null,
    status : null
  });

  const [end, setEnd] = useState('');

  const handleDragStart = (e) => {
    const [status, id] = e.target.id.split('-');
    if (status === 'undo') {
      setStart({ ...undo.find(item => item.id === parseInt(id)) });
    } else if (status === 'progress') {
      setStart({ ...progress.find(item => item.id === parseInt(id)) });
    } else {
      setStart({ ...done.find(item => item.id === parseInt(id)) });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); // 기본 동작 방지

    const zone = end.split('-')[0];
    // 드래그 한 요소가 진행상황이 변하지 않는 곳에 드래그 드롭 된 경우
    if(zone===start.status){
      console.log('진행상황에 변화가 없습니다.');
      return ;
    }

    const addData = {...start};

    const [removeState,removeIndex] = [start.status,start.id];

    if(end==='progress-zone'){
      addData.id = parseInt(progress.length+1);
      addData.status = 'progress'
      setProgress((prev) => ([...prev,addData]));
    }

    if(removeState==='undo'){
      setUndo((prev) => {

        let result = prev.filter((item) => item.id !== removeIndex);
        result = result.map((item,idx) => ({...item,id:idx+1}));
        return [...result];
      });
    }
  };

  // 드래그 중 어떤 요소에 드래그 오버 된 경우
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 동작 방지
    const zone = e.target.id;
    setEnd(zone);
  };

  const addUndo = () => {
    const addData = {id:undo.length+1,title:'새로운 계획',memo:'메모를 작성해주세요', status : 'undo'};

    setUndo(prev => ([...prev,addData]));
  }

  const toggleMod = (e) => {

    const [status , id] = e.target.id.split('-');

    let data = {}

    if(status==='undo'){
      data = {...undo[id-1]}
    }

    setMod(prev => [!prev[0], {...data}]);
  }

  return (
    <>
      <ul>
        {undo?.map((i) => (<li 
          key={i.id}
          id={`${i.status}-${i.id}`}
          name={i.status} 
          draggable
          onClick={toggleMod}
          onDragStart={handleDragStart}>
            {i.title}
        </li>))}
      </ul>

      <button onClick={addUndo}>눌러서 추가하기</button>


        <h2>progress-zone</h2>
      <ul
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ border: '1px solid black', minHeight: '100px' }}
        id='progress-zone'
      >
        {progress.map((i) => (<li key={i.id} id={`${i.status}-${i.id}`} name={i.status} draggable onDragStart={handleDragStart}>{i.title}</li>))}
      </ul>

      <button onClick={()=>(console.log(progress))}>클릭 시 progress 보여짐</button>
      <button onClick={()=>(console.log(undo))}>클릭 시 undo 보여짐</button>

      {mod[0]&&
      <>
        <p>{mod[1].title}</p>
        <p>{mod[1].status}</p>
        <p>{mod[1].memo}</p>
      </>
      }
    </>
  );
}

export default App;