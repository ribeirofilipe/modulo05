import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './Pages/Main/index';
import Repository from './Pages/Repository/index';
import Teste from './Pages/Main/teste';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/repository/:repository" component={Repository} />
        <Route path="/teste" component={Teste} />
      </Switch>
    </BrowserRouter>
  );
}
