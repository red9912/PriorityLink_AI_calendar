import React, { useState } from 'react';
import Header from './components/Header';
import './App.css';
import { Container, Row } from 'react-bootstrap';
import CalendarPage from './pages/CalendarPage';
import SettingPriorityPage from './pages/SettingPriorityPage';

function App() {
  const [prioritiesSet, setPrioritiesSet] = useState(false);
  return (
    <Container fluid className="p-0" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{height:"60px"}}>
        <Header prioritiesSet={prioritiesSet} />
      </div>
      <div style={{flex: 1, overflow: "auto"}}>
        {prioritiesSet ? <CalendarPage></CalendarPage> : <SettingPriorityPage setPrioritiesSet={setPrioritiesSet}></SettingPriorityPage>}
      </div>
    </Container>
  );
}

export default App;
