import React, {Component} from "react";
import Web3 from 'web3';
import Auctions from './components/auctions'
import ComPage from './components/comPage'
import About from './components/About'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ClosedAuctionsPage from "./components/closedAuctionsPage"
import { Provider } from 'react-redux';

import Navbar from './components/Navbar'
import "./App.css";

class App extends Component {


    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            address_auction: '0x0',
            artToken: {},
            auctionbox: {},
            TokenBalance: '0',
            linkForEther: '',
            loading: true,
        }
    }

    async componentWillMount() {
        // await this.loadWeb3()
        // await this.loadBlockchainData()
    }
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("Please install Metamask")
        }

    }

    async loadBlockchainData() {
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        this.setState({addressShort: accounts[0].substr(0, 6) + ' ... ' + accounts[0].substr(accounts[0].length - 4, accounts[0].length)})
        console.log(accounts)
    }

    render() {
        return (
                <Router>
                    <div className="content">
                        <Navbar account={this.state.account} linkForEther={this.state.linkForEther}
                                short={this.state.addressShort}/>
                        <Switch>
                            <Route exact path="/comPage">
                                <ComPage/>
                            </Route>
                            <Route exact path="/closed">
                                <ClosedAuctionsPage/>
                            </Route>
                            <Route exact path="/auctions">
                                <Auctions/>
                            </Route>
                            <Route exact path="/">
                                <About/>
                            </Route>
                        </Switch>
                    </div>
                </Router>
        );
    }
}

export default App;
