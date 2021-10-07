import GuildProfile from './components/GuildProfile'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './styles/styles.css'
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/:region/:realm/:name" 
          render={routeProps => {
            const {region, realm, name} = routeProps.match.params;
            return <GuildProfile region={region} realm={realm} name={name} />
          }}
        />
      </Switch>
    </Router>
  );
}

export default App;
  