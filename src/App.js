import logo from './logo.svg';
import './App.css';
import PlayerCard from './PlayerTemplate';
import TeamButtons from './TeamButtons';
import { store } from './store'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

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
