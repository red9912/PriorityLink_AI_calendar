/* eslint-disable react/prop-types */
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Customize_Calendar from '../components/Customize_Calendar';
import InitialChatBot from '../components/InitialChatBot';

function SettingPriorityPage({ setPrioritiesSet }) {
    return (
        <Container fluid className="App p-0" style={{height:"100%", flex: "1 0 auto" }}>
            <InitialChatBot setPrioritiesSet={setPrioritiesSet}></InitialChatBot>
        </Container>
    )
}

export default SettingPriorityPage