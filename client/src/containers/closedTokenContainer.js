import React, {Component} from "react";
import HashedClosedAuction from "../contracts/HashedClosedAuction.json";
import DiamondContract from "../contracts/Diamond.json";
import crypto from 'crypto';
import {ethers} from 'ethers';


class TokenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auction_contract: null,
            art_contract: null,
            token_id: null,
            token_bnfcr: null,
            token_end_time: null,
            token_startprice: null,
            token_image: null,
            token_link: null,
            link_for_auction: null,
            token_end_date: null,
        }
    }

    async componentDidMount() {

        const contract = new window.web3.eth.Contract(HashedClosedAuction.abi, this.props.contract_address)
        const accounts = await window.web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        this.setState({auction_contract: contract});
        this.setState({token_id: await contract.methods.token_id().call()});

        this.setState({token_bnfcr: await contract.methods.beneficiary().call()})

        this.setState({token_end_time: await contract.methods.auctionEndTime().call()})

        let maxDate = new Date(this.state.token_end_time * 1000);
        this.setState({token_end_date: String(maxDate)})

        this.setState({token_startprice: await contract.methods.auctionMinimalBidPrice().call()})


        let art_contract = new window.web3.eth.Contract(DiamondContract.abi, DiamondContract.networks["5777"].address)
        this.setState({token_link: await art_contract.methods.tokenURI(this.state.token_id).call()})

        this.setState({link_for_auction: 'https://ipfs.io/ipfs/' + this.state.token_link})
    }


    async deposit(amount, address) {
        const nonce = crypto.randomBytes(32).toString("hex");
        const auction_contract = this.state.auction_contract;
        const bidHash = ethers.utils.keccak256(ethers.utils.solidityPack(['uint256', 'string'], [amount, nonce]));
        console.log("bidhash: ", bidHash);

        try {
            await auction_contract.methods.bid(bidHash).send({from: this.state.account})
            const nonces = {...JSON.parse(localStorage.getItem('nonces'))};
            if (!nonces[this.state.account]) {
                nonces[this.state.account] = {}
            }
            nonces[this.state.account][this.props.contract_address] = nonce;
            localStorage.setItem('nonces', JSON.stringify(nonces))
        } catch (depositError) {
            console.log('Error occurred on deposit attempt: ', depositError)
        }
    }

    async approveBid(amount) {
        var nonce = JSON.parse(localStorage.getItem("nonces"))[this.state.account][this.props.contract_address];
        const auction_contract = this.state.auction_contract;
        try {
            await auction_contract.methods.proveBid(amount, nonce).send({from: this.state.account})
        } catch (e) {
            console.log("Approval failed: ", e)
        }
    }

    async depositButton() {
        this.deposit(this.depositAmount.value, 0);
    }

    async approveButton() {
        this.approveBid(this.depositAmount.value);
    }

    render() {
        return (
            <div key={this.state.key} className="col-sm-12 col-md-12"
                 style={{"textAlign": "left"}}>

                <div className="card" style={{"padding": "15px", "margin": "15px"}}>
                    <div style={{"background": "#277cfd", "display": "none"}}
                         className="card-header d-sm-flexjustify-content-center">
                        <div className="card-title" style={{
                            "box-sizing": "border-box",
                            "text-align": "center",
                            "display": "none"
                        }}>
                            <h3><a href="#" style={{
                                "text-align": "center",
                                "color": "#fff",
                                "display": "none"
                            }} className="display-none">{this.state.token_id}</a>
                            </h3>
                        </div>
                    </div>
                    <div className="row" style={{"padding": "10px"}}>
                        <div className="col-sm-4 col-md-4">
                            <img style={{"width": "100%", "zIndex": "1;"}}
                                 className="scale" src={this.state.link_for_auction}
                                 alt="?????? ?????????? ???????????? ????????"/>
                        </div>

                        <div className="col-sm-8 col-md-8" style={{
                            "text-align": "left",
                            "z-index": "2",
                            "overflow": "hidden"
                        }}>
                            <div className="Bnfcry" style={{"fontSize": "14px"}}>
                                <strong>???????????????????? </strong><span>{this.state.token_bnfcr}</span>
                            </div>
                            <div className="starting" style={{"fontSize": "14px"}}><strong>??????????????????
                                ???????? </strong><span
                                style={{"color": "#b22222"}}>{this.state.token_startprice} bnb</span>
                            </div>
                            <div className="Adress"
                                 style={{"fontSizehttps://reactjs.org/docs/error-decoder.html?invariant=231&args[]=onClick&args[]=object": "14px"}}>
                                <strong>A???????? </strong><span>{this.props.contract_address}</span></div>
                            <div className="endTime" style={{"fontSize": "14px"}}>
                                <strong>?????????????????? </strong><span>{this.state.token_end_date}</span>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                            }}>
                                <div>

                                        <span><input
                                            id='depositAmount'
                                            type='number'
                                            ref={(input) => {
                                                this.depositAmount = input
                                            }}
                                            className="form-control mb-2 mt-2"
                                            placeholder='amount... (in BNB)'
                                            required/>
                                          </span>
                                    <span><button type='submit'
                                                  className='btn btn-primary mb-2'
                                                  onClick={this.depositButton.bind(this)}>?????????????? ????????????</button></span>
                                    <span><button type='button' onClick={this.approveButton.bind(this)}
                                                  className='btn btn-primary mb-2 ml-2'>???????????????? ????????????</button></span>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TokenContainer
