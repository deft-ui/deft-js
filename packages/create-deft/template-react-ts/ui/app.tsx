import "./app.css"
import {Container} from "deft-react";

export function App() {
    return <Container className="main">
        <Container style={{fontSize: 20}}>
            Welcome to Your Deft App
        </Container>
        <Container style={{color: '#D00'}}>
            Edit ui/app.tsx and save to reload
        </Container>
    </Container>
}
