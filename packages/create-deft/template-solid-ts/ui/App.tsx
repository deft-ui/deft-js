import {createEffect, createSignal} from "solid-js";
import {Button, Container} from "deft-solid";

const App = () => {
    const [getCount, setCount] = createSignal(0);
    const add = () => setCount(getCount() + 1);
    createEffect(() => {
        console.log('count is change:', getCount());
    });

    return <Container style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 20,
    }}>
        <div>
            {" counter : " + getCount()}
        </div>
        <Button style={{
            borderRadius: 4,
            padding: '2 10',
        }} hoverStyle={{
            backgroundColor: '#4b4e4f',
        }} onClick={add}>
            Increment
        </Button>
    </Container>
};

export default App;
