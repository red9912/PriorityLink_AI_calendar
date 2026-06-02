/* eslint-disable react/prop-types */
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Customize_Calendar from '../components/Customize_Calendar';

function CalendarPage({user}) {
  return (
    <>
      {user !== null ? (
        <>
          <Container fluid className="App p-0" style={{ flex: "1 0 auto" }}>
            <Customize_Calendar />
          </Container>
        </>
      ) : (
        <>
          <Container fluid className="App p-0" style={{ flex: "1 0 auto" }}>
            <Customize_Calendar />
          </Container>
        </>
      )
      }
    </>
  )
}

export default CalendarPage