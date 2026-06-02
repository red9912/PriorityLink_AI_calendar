import React, { useRef, useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Card from 'react-bootstrap/Card';
import MyChatBot from './ChatBot.jsx'
import { RiRobot2Line } from "react-icons/ri";
import { Scheduler, Resource } from 'devextreme-react/scheduler';
import { rrulestr } from 'rrule';
import Toolbar from "devextreme/ui/toolbar";
import { RiChat3Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import API from '../API';

const colors = {
  workColor: "#002d70",
  studyColor: "#005b96",
  FreeTimeColor: "#6497b1",
  AllColor: "#011f4b",
}


function Customize_Calendar() {
  const [data,setData] =useState();
  const [appointmentsData, setAppointmentsData] = useState();
  const [dirty, setDirty] = useState(true);
  const today = new Date();
  const [clickedDate, setClickedDate] = useState(today);
  const [appointments, setAppointments] = useState();
  const [filteredAppointements, setFilteredAppointements] = useState();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [date, setDate] = useState(today)
  useEffect(() => {
    if (dirty) {
      try {
        API.getCommitments()
          .then((a) => {
            console.log(a)
            setSelectedFilter("All")
            setData(a);
            setAppointmentsData(a)
            setAppointments(filterAppointmentsByDate(a, clickedDate))
            setFilteredAppointements(filterAppointmentsByDate(a, clickedDate))
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.error(err);
      }
      setDirty(false);
    }
  }, [dirty]);
  
  return (
    <Container fluid className="m-0">
      <Row className="h-100">
        <Col sm={8} className="bg-light custom-padding vh-100"><LeftSide data={data} appointmentsData={appointmentsData} setSelectedFilter={setSelectedFilter} selectedFilter={selectedFilter} setFilteredAppointements={setFilteredAppointements} filteredAppointements={filteredAppointements} date={date} setDate={setDate} setClickedDate={setClickedDate} clickedDate={clickedDate} appointments={appointments} setAppointments={setAppointments}></LeftSide></Col>
        <Col sm={4} className="bg-light p-3" ><RightSide data={data} setDirty={setDirty} appointmentsData={appointmentsData} setAppointmentsData={setAppointmentsData} setSelectedFilter={setSelectedFilter} selectedFilter={selectedFilter} setFilteredAppointements={setFilteredAppointements} filteredAppointements={filteredAppointements} setAppointments={setAppointments} date={date} setDate={setDate} setClickedDate={setClickedDate} clickedDate={clickedDate} appointments={appointments}></RightSide></Col>
      </Row>
    </Container>
  )
}

function filterAppointmentsByDate(appointments, targetDate) {
  return appointments.filter(appointment => {
    const startDate = new Date(appointment.startDate);
    const recurrenceRule = appointment.recurrenceRule;

    // Se l'appuntamento ha una regola di ricorrenza
    if (recurrenceRule) {
      const rrule = rrulestr(recurrenceRule, { dtstart: startDate });

      // Verifica se la data di inizio dell'appuntamento o una delle date ricorrenti corrisponde alla data di destinazione
      return (
        startDate.getFullYear() === targetDate.getFullYear() &&
        startDate.getMonth() === targetDate.getMonth() &&
        startDate.getDate() === targetDate.getDate()
      ) || rrule.all().some(d => d.getFullYear() === targetDate.getFullYear() && d.getMonth() === targetDate.getMonth() && d.getDate() === targetDate.getDate());
    } else {
      // Se l'appuntamento non ha una regola di ricorrenza, usa la logica esistente
      return (
        startDate.getFullYear() === targetDate.getFullYear() &&
        startDate.getMonth() === targetDate.getMonth() &&
        startDate.getDate() === targetDate.getDate()
      );
    }
  });
}

/*
[
  {
    text: 'Work',
    startDate: new Date('2024-01-01T16:30:00.000Z'),
    endDate: new Date('2024-01-01T18:30:00.000Z'),
    description: "meeting",
    type: 1,
    recurrenceRule: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20251203',
  },
  {
    text: 'Study',
    startDate: new Date('2024-01-27T19:00:00.000Z'),
    endDate: new Date('2024-01-27T20:35:00.000Z'),
    description: "HCI",
    type: 2,
  },
  {
    text: 'Study',
    startDate: new Date('2024-01-27T21:30:00.000Z'),
    endDate: new Date('2024-01-27T22:45:00.000Z'),
    description: "SW1",
    type: 2,
  },
  {
    text: 'Study',
    startDate: new Date('2024-01-28T16:45:00.000Z'),
    endDate: new Date('2024-01-28T18:15:00.000Z'),
    description: "SW2",
    type: 2,
  },
  {
    text: 'Free-Time',
    startDate: new Date('2024-01-08T16:45:00.000Z'),
    endDate: new Date('2024-01-08T18:15:00.000Z'),
    description: "soccer",
    type: 3,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=2',
  },
];
*/


function LeftSide({ data, appointmentsData, filteredAppointements, setSelectedFilter, selectedFilter, setFilteredAppointements, appointments, setAppointments, setClickedDate, setDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('week');
  const views = ['day', 'week', 'workWeek', 'month'];
  const [schedulerKey, setSchedulerKey] = useState(0);

  // Define resource types
  const resourceTypes = [{
    dataSource: [
      { id: 1, text: 'Type 1', color: colors.workColor }, // Set your desired color for Type 1
      { id: 2, text: 'Type 2', color: colors.studyColor }, // Set your desired color for Type 2
      { id: 3, text: 'Type 3', color: colors.FreeTimeColor }, // Set your desired color for Type 2
    ],
    fieldExpr: 'type',
    label: 'Event Type',
  }];

  const handleSchedulerOptionChanged = (e) => {
    if (e.name === 'currentView') {
      // Aggiorna la variabile di stato currentView quando cambia la vista
      setCurrentView(e.value);
    }
  };

  const onAppointmentClick = (e) => {
    e.cancel = false;
  };

  const onCellClick = (e) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const clickedDate = e.cellData.startDate;
    const formattedDate = clickedDate.toLocaleDateString('en-US', options);
    setDate(formattedDate);
    setClickedDate(e.cellData.startDate);
    setAppointments(filterAppointmentsByDate(data, clickedDate));
    console.log(filterAppointmentsByDate(data, clickedDate))
    if(selectedFilter=="All"){
      setFilteredAppointements(filterAppointmentsByDate(data, clickedDate))
    }else{
      setFilteredAppointements(filterAppointmentsByDate(data, clickedDate).filter(appointment => appointment.text === selectedFilter))
    }
  };

  const onContentReady = (e) => {
    let toolbarInstance = Toolbar.getInstance(
      e.element.querySelector(".dx-toolbar")
    );
    if (toolbarInstance.option("items").length === 2) {
      let items = toolbarInstance.option("items");
      toolbarInstance.option("items", [
        items[0],
        {
          widget: "dxButton",
          location: "before",
          options: {
            text: "Today",
            onClick() {
              setCurrentDate(new Date());
              setAppointments(filterAppointmentsByDate(data, new Date()));
              setDate(new Date())
              setSchedulerKey(prevKey => prevKey + 1);
            }
          }
        },
        items[1]
      ]);
    }
  };

  const renderAppointment = (model) => {
    return (
      <React.Fragment>
        <i style={{ fontFamily: 'Gabriela, serif', fontSize: "12px", color: "white" }}>{model.appointmentData.description}</i>
      </React.Fragment>
    );
  }
  const [adaptivityEnabled, setAdaptivityEnabled] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // Imposta adaptivityEnabled a true solo se la larghezza dello schermo è inferiore a 768 pixel (puoi regolare questo valore)
      setAdaptivityEnabled(window.innerWidth < 768);
    };

    // Aggiungi un listener per l'evento di ridimensionamento della finestra
    window.addEventListener('resize', handleResize);

    // Chiamato quando il componente si smonta per rimuovere l'event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ width: '100%', marginTop: "17px", paddingLeft: "17px" }}>
      <Scheduler
        adaptivityEnabled={adaptivityEnabled}
        key={schedulerKey}
        dataSource={appointmentsData}
        views={views}
        defaultCurrentView={currentView}
        defaultCurrentDate={currentDate}
        showAllDayPanel={false}
        height={600}
        startDayHour={5}
        allowEditing={false}
        endDayHour={24}
        onOptionChanged={handleSchedulerOptionChanged}
        useDropDownViewSwitcher={true}
        editing={false}
        onAppointmentClick={onAppointmentClick}
        onCellClick={onCellClick}
        onContentReady={onContentReady}
        appointmentRender={renderAppointment}
      >
        {resourceTypes.map((resource, index) => (
          <Resource
            key={index}
            dataSource={resource.dataSource}
            fieldExpr={resource.fieldExpr}
            label={resource.label}
            useColorAsDefault={true}
          />
        ))}
      </Scheduler>
    </div>
  );
}


const CustomCard = ({ bgColor, label, onClick, isSelected }) => {
  const cardStyle = {
    color: "#ffffff",
    paddingRight: '15px',
    paddingLeft: '15px',
    paddingTop: '5px',
    paddingBottom: '5px',
    margin: '0', // Imposta il margin a 0 inizialmente
    fontFamily: 'Gabriela, serif',
    fontSize: '12px',
    width: "90px",
    height: "30px",
    marginBottom: "10px",
    backgroundColor: bgColor,
    border: isSelected ? '3px solid #ff6e00' : '2px solid transparent',
    cursor: 'pointer',
  };

  const smallScreenStyle = {
    color: "#ffffff",
    paddingRight: '15px',
    paddingLeft: '15px',
    paddingTop: '5px',
    paddingBottom: '5px',
    margin: '0',
    fontFamily: 'Gabriela, serif',
    fontSize: '12px',
    height: "30px",
    width: "88px",
    marginBottom: "10px",
    backgroundColor: bgColor,
    border: isSelected ? '3px solid #ff6e00' : '2px solid transparent',
    cursor: 'pointer',
  };

  return (
    <Col md="auto">
      <Card style={window.innerWidth < 1120 ? smallScreenStyle : cardStyle} onClick={onClick}>
        {label}
      </Card>
    </Col>
  );
};


function RightSide({ data, setDirty,appointmentsData, setAppointmentsData, selectedFilter, setSelectedFilter, setFilteredAppointements, filteredAppointements, setAppointments, appointments, clickedDate, date }) {
  const [chatMessage, setChatMessage] = useState(true);
  const initialMessage = "Hi, I'm your Time Mate. Tap on the green button to modify your plan.";
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [showChatBot, setShowChatBot] = useState(false);
  const [setupMessage, setSetupMessage]=useState("");

  const toggleChatBot = async() => {
    setSetupMessage(await API.rasaParse("Start conversation"));
    setShowChatBot((prev) => !prev);
    setChatMessage(false)
  };

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedMessage(initialMessage.substring(0, index));
      index++;

      if (index > initialMessage.length) {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);
  function handleClose() {
    setChatMessage(false);
  }
  const handleCardClick = (label) => {
    setSelectedFilter(label === selectedFilter ? selectedFilter : label);
    if (label !== 'All') {
      setFilteredAppointements(appointments.filter(appointment => appointment.text === label));
      setAppointmentsData(data.filter(appointment => appointment.text === label))
    } else {
      setFilteredAppointements(appointments);
      setAppointmentsData(data)
    }
  };
  return (
    <>
      <div style={{ width: '100%', padding: '5px', backgroundColor: 'transparent', marginBottom: '10px' }}>
        <div style={{ fontFamily: 'Gabriela, serif' }}>
          <h1 style={{ fontSize: '20px' }}>Filter by:</h1>
        </div>
      </div>
      <div style={{ width: "100%", marginBottom: '8px', textAlign: 'center', display: "flex", justifyContent: "center" }}>
          <Row className='custom-badge'>
            <CustomCard
              bgColor='#01122c'
              label='All'
              onClick={() => handleCardClick('All')}
              isSelected={selectedFilter === 'All'}
            />
            <CustomCard
              bgColor={colors.workColor}
              label='Work'
              onClick={() => handleCardClick('Work')}
              isSelected={selectedFilter === 'Work'}
            />
            <CustomCard
              bgColor={colors.studyColor}
              label='Study'
              onClick={() => handleCardClick('Study')}
              isSelected={selectedFilter === 'Study'}
            />
            <CustomCard
              bgColor={colors.FreeTimeColor}
              label='Free-time'
              onClick={() => handleCardClick('Free-time')}
              isSelected={selectedFilter === 'Free-time'}
            />
          </Row>
        </div>
      <Card style={{ width: '100%', padding: "20px", backgroundColor: "white" }}>
        <div style={{ fontFamily: 'Gabriela, serif' }}><h1 style={{ fontSize: '27px' }}>{new Date().toDateString() === new Date(date).toDateString() ? "Today" : String(date)}</h1></div>
        <ListGroup as="ol">
          {Array.isArray(filteredAppointements) && filteredAppointements.length > 0 ? (
            filteredAppointements.map(appointment => {
              const startDate = new Date(appointment.startDate);
              const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = new Date(appointment.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <ListGroup.Item
                  key={appointment.text + startDate.toISOString()}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{appointment.text}</div>
                    {appointment.description}
                  </div>
                  {appointment.type == 1 ? <YellowDot text={`${startTime}-${endTime}`} /> : appointment.type == 2 ? <BlueDot text={`${startTime}-${endTime}`} /> : appointment.type == 3 ? <GreenDot text={`${startTime}-${endTime}`} /> : <YellowDot text={`${startTime}-${endTime}`} />}
                </ListGroup.Item>
              );
            })
          ) : (
            <p style={{ fontFamily: 'Gabriela, serif', fontSize: "16px", color: "#545454" }}>There are no commitments</p>
          )}
        </ListGroup>
      </Card>
      <div>
        {chatMessage ?
          (<Card
            text='black'
            style={{
              height: "auto",
              width: '250px',
              backgroundColor: 'white',
              position: 'fixed',
              bottom: '20px',
              right: '0',
              marginRight: "20px",
              marginBottom: "20px",
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              borderBottomLeftRadius: "40px",
              borderBottomRightRadius: "0px",
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
            className="mb-2"
          >
            <Card.Header>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <RiRobot2Line style={{ fontSize: '30px', marginLeft: "10px", marginBottom: "5px", color: "#1a73e8" }} />
                  <b> Time Mate</b>
                </div>
                <div>
                  <Button style={{ fontSize: '20px', backgroundColor: "transparent", color: "black", border: "none" }} onClick={handleClose}>
                    <AiOutlineClose />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {displayedMessage}
              </Card.Text>
              <div style={{ display: 'flex', justifyContent: "right" }}>
                <Button
                  variant="success"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                  }}
                  onClick={toggleChatBot}
                >
                  <RiChat3Line style={{ fontSize: '25px', color: '#fff' }} />
                </Button>
              </div>
            </Card.Body>
          </Card>) : showChatBot ? (<div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000, // Imposta un valore più alto del pulsante
            }}
          >
            <MyChatBot setupMessage={setupMessage} setDirty={setDirty} setShowChatBot={setShowChatBot} showChatBot={showChatBot} />
          </div>) : (
            <>
              <Card
                style={{
                  height: "auto",
                  width: 'auto',
                  border: "none",
                  backgroundColor: 'transparent',
                  position: 'fixed',
                  bottom: '20px',
                  right: '0',
                  marginRight: "20px",
                  marginBottom: "20px",
                }}
                className="mb-2"
              >
                <Card.Body>
                  <div style={{ display: 'flex', justifyContent: "right" }}>
                    <Button
                      variant="success"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 999, // Imposta un valore alto per assicurarti che sia sopra gli altri elementi
                      }}
                      onClick={toggleChatBot}
                    >
                      <RiChat3Line style={{ fontSize: '25px', color: '#fff' }} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </>)
        }
      </div>

    </>
  )
}

const YellowDot = ({ text }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const dotStyle = {
    width: '16px',
    height: '16px',
    backgroundColor: '#011f4b',  // Colore blu
    borderRadius: '50%',  // Rende il div un cerchio
    marginBottom: '4px',  // Spaziatura tra il cerchio e il testo
  };

  const textStyle = {
    fontSize: '15px',  // Dimensione del testo
  };

  return (
    <div style={containerStyle}>
      <div style={dotStyle}></div>
      <div style={textStyle}>{text}</div>
    </div>
  );
};

const GreenDot = ({ text }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const dotStyle = {
    width: '16px',
    height: '16px',
    backgroundColor: colors.FreeTimeColor,  // Colore blu
    borderRadius: '50%',  // Rende il div un cerchio
    marginBottom: '4px',  // Spaziatura tra il cerchio e il testo
  };

  const textStyle = {
    fontSize: '15px',  // Dimensione del testo
  };

  return (
    <div style={containerStyle}>
      <div style={dotStyle}></div>
      <div style={textStyle}>{text}</div>
    </div>
  );
};

const BlueDot = ({ text }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const dotStyle = {
    width: '16px',
    height: '16px',
    backgroundColor: colors.studyColor,  // Colore blu
    borderRadius: '50%',  // Rende il div un cerchio
    marginBottom: '4px',  // Spaziatura tra il cerchio e il testo
  };

  const textStyle = {
    fontSize: '15px',  // Dimensione del testo
  };

  return (
    <div style={containerStyle}>
      <div style={dotStyle}></div>
      <div style={textStyle}>{text}</div>
    </div>
  );
};
export default Customize_Calendar;