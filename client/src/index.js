import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import { Router, Switch, Route } from 'react-router-dom';
import history from "./history"
import './index.css';

render(
    <Router history = {history} >
     <Switch>
         <Route exact path='/' component = {App}/>
         <Route path='/blocks' component={Blocks}/>
         <Route path='/conduct-transaction' component={ConductTransaction}/>
         <Route path='/transaction-pool' component={TransactionPool}/>
     </Switch>
    </Router>,
    document.getElementById('root')
);
