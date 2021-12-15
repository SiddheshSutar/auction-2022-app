import logo from './logo.svg';
import './App.css';
import PlayerCard from './PlayerTemplate';
import TeamButtons from './TeamButtons';
import { store } from './store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <PlayerCard />
        <TeamButtons />
      </div>
    </Provider>
  );
}

export default App;
