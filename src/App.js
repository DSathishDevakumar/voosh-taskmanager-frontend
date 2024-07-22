import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TaskBoard from './components/Taskboard/taskboard';
import SignIn from './components/Authentication/signin';
import SignUp from './components/Authentication/signup';
import ProfilePage from './components/Authentication/profile';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const token = localStorage.getItem("vooshtoken");

  return (
    <Router>
      <Switch>
        {token ? (
          <>
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/tasks" component={TaskBoard} />
            <Route exact path="/" component={TaskBoard} />
            <Redirect to="/" />
          </>
        ) : (
          <>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/" component={SignIn} />
            <Redirect to="/signin" />
          </>
        )}
      </Switch>
    </Router>
  );
};

export default App;
