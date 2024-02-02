import './App.css';
import { useState , useEffect, useRef} from 'react';
/*eslint-disable */

function App() {
  const [input,setInput] = useState("");
  const [history,setHistory] = useState("봇: 어떻게 도와드릴까요?\n\n");
  const categories = ['정치','경제', '사회', '세계','IT/과학'];
  const [hotIssues, setHotIssues] = useState(['총선','쌍특검법 거부권','태영 건설','금리 인하','대장동']);
  const chatHistoryRef = useRef(null);
  const helpRef = useRef(1);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history]);

  const inputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = () => {
    setHistory((prevState)=>{
      return prevState+"사용자: "+input+"\n\n";
    });
    fetchJSON(input);
  };

  const categorySearch = (category) => {
    setHistory((prevState)=>{
      return prevState+"사용자: 최근 "+category+" 분야 뉴스 알려줘.\n\n";
    });
    fetchJSON("최근 "+category+" 분야 뉴스 알려줘.");
  };

  const issueSearch = (issue) => {
    setHistory((prevState)=>{
      return prevState+"사용자: "+issue+ " 관련 대표적인 기사 알려줘.\n\n";
    });
    fetchJSON(issue+"관련 대표적인 기사 알려줘");
  };

  const fetchJSON = (input) => {
    console.log(input);
    fetch('/api/chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'user_input': input })
    })
    .then(response => response.json())
    .then(data => {
      setHistory((prevState)=>{
        return prevState+"봇: "+data.bot_output+"\n\n";
      });
      console.log(data);
    });
    setInput("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">📰 News Explorer</h1>
        <nav className="categories">
          {categories.map((category,idx)=>{
            return <a onClick={()=>{categorySearch(category)}}>
              {category}
            </a>
          })}
        </nav>
      </header>
      <main className="body">
        <aside className="sideBar">
          <h2>Hot Issues</h2>
          <hr/>
          <ul>
            {hotIssues.map((hotIssue,idx)=>{
              return <li>
                <a onClick={()=>{issueSearch(hotIssue)}}>
                  {hotIssue}
                </a>
            </li>
            })}
          </ul>
          
          <div ref={helpRef} className="help-modal">
            <div className="modal-content">
              <p>This is a simple help modal.</p>
              <p>도움말을 추가하십시오!</p>
              <button className="close-button" onClick={()=>{helpRef.current.style.display='none'}}>Close</button>
            </div>
          </div>
          <button onClick={()=>{helpRef.current.style.display='flex'}}> Help  🙋 </button>
        </aside>
        <section className="main">
          <h2> 채팅 창</h2>
          <div className="chat-window">
            <div ref={chatHistoryRef} style = {{whiteSpace: 'pre-line',}}>{history}</div>
            <div className="chatting-box">
              <input placeholder="메세지를 입력하세요..." value ={input} onChange={inputChange}/>
              <button className="send-button" onClick={sendMessage}>보내기</button>
            </div>
          </div>
          <div className = "commands">
            <h2>가능한 명령어</h2>
            <div className="command-list">
              <div>
                <p>관련 기사 (유사 bias score)</p>
                <button onClick={()=>{setInput(input+" 유사 기사 알려줘")}}>유사 뉴스</button>
              </div>
              <div>
                <p>관련 기사 (반대 bias score)</p>
                <button onClick={()=>{setInput(input+" 상반되는 기사 알려줘")}}>반대 뉴스</button>
              </div>
              <div>
                <p>Bias score 계산</p>
                <button onClick={()=>{setInput(input+"의 편향 정도를 알려줘")}}> Bias Score</button>
              </div>
              <div>
                <p>중립 요약</p>
                <button onClick={()=>{setInput(input+" 중립 기사로 요약해줘")}}>중립 요약</button>
              </div>
              <div>
                <p>채팅 창 초기화</p>
                <button onClick={()=>{setHistory("봇: 어떻게 도와드릴까요?\n\n")}}>초기화</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
