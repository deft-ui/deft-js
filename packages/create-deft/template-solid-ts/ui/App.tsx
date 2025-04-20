import "./App.css"
import {createEffect, createSignal} from "solid-js";
import {Button, Container} from "deft-solid";

const App = () => {
    const [getCount, setCount] = createSignal(0);
    const add = () => setCount(getCount() + 1);
    createEffect(() => {
        console.log('count is change:', getCount());
    });

    return <Container className="app">
        <div>
            {" counter : " + getCount()}
        </div>
        <Button onClick={add}>Increment</Button>
    </Container>
};

export default App;
