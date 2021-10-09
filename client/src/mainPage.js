import React, {Component} from "react";
import Web3 from 'web3';

import "./App.css";
import EnglishAuction from "./contracts/EnglishAuction.json";
import ART_CONTRACT from "./contracts/ART_CONTRACT.json";
import AuctionBox from "./contracts/AuctionBox.json";
import TokenContainer from "./containers/tokenContainer";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            address_auction: '0x0',
            artToken: {},
            auctionbox: {},
            TokenBalance: '0',
            linkForEther: '',
            loading: true,
            DepositEther: '',
            auction_address: [],
        }
    }

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})

        if (true) {
            const artToken = new web3.eth.Contract(ART_CONTRACT.abi, ART_CONTRACT.networks["5777"].address)
            this.setState({artToken})
            const auctionbox = new web3.eth.Contract(AuctionBox.abi, AuctionBox.networks["5777"].address)
            this.setState({auctionbox})
            this.setState({linkForEther: 'https://testnet.bscscan.com/address/' + this.state.account})

            let mould_address = await auctionbox.methods.returnAllAuctions().call()
            this.setState({auction_address: mould_address})

        } else {
            window.alert('Error in connection, contract does not exist in this network')
        }

        this.setState({loading: false})
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

    render() {
        return (<section className="py-12" id="pages">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-12 mt-3 col-lg-12 col-xl-12 text-center">
                        <div className="row justify-content-center">
                            <div className="col-sm-12 col-md-12" style={{"text-align": "center"}}>
                                <h1 style={{
                                    "margin-top": "0px",
                                    "box-sizing": "border-box",
                                    'font-family': "'Arsenal', sans-serif"
                                }}>Активные аукционы</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center" id="myAuctions"
                             style={{"text-align": "center", "box-sizing": "border-box"}}>

                            {this.state.auction_address.map((address, key) => {
                                return <TokenContainer contract_address={address}/>
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </section>);
    }
}

export default MainPage;
