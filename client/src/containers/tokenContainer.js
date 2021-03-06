import React, {Component} from "react";
import EnglishAuction from "../contracts/EnglishAuction.json";
import DiamondContract from "../contracts/Diamond.json";

class TokenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auction_contract: null,
            art_contract: null,
            token_id: null,
            token_bnfcr: null,
            token_end_time: null,
            token_highbidder: null,
            token_highbid: null,
            token_startprice: null,
            token_image: null,
            token_min_limit: null,
            token_max_limit: null,
            token_link: null,
            link_for_auction: null,
            token_end_date: null,
        }
    }

    async componentDidMount() {
        const contract = new window.web3.eth.Contract(EnglishAuction.abi, this.props.contract_address)
        const accounts = await window.web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        this.setState({auction_contract: contract});
        this.setState({token_id: await contract.methods.token_id().call()});

        this.setState({token_bnfcr: await contract.methods.beneficiary().call()})

        this.setState({token_end_time: await contract.methods.auctionEndTime().call()})
        let maxDate = new Date(this.state.token_end_time * 1000);
        this.setState({token_end_date: String(maxDate)})

        this.setState({token_highbidder: await contract.methods.highestBidder().call()})

        this.setState({token_highbid: await contract.methods.highestBid().call()})

        this.setState({token_startprice: await contract.methods.startPrice().call()})

        let art_contract = new window.web3.eth.Contract(DiamondContract.abi, DiamondContract.networks["5777"].address)
        this.setState({token_link: await art_contract.methods.tokenURI(this.state.token_id).call()})
        this.setState({link_for_auction: 'https://ipfs.io/ipfs/' + this.state.token_link})

        let massiv = await contract.methods.bid_range().call()
        console.log(this.props.contract_address, ": ", massiv)
        this.setState({token_min_limit: massiv[0]});
        this.setState({token_max_limit: massiv[1]});
    }


    async deposit(amount, address) {
        console.log(amount)
        const auction_contract = this.state.auction_contract;
        let to_return = await auction_contract.methods.get_latest_bid(this.state.account).call()


        console.log(to_return)

        if (to_return === 0) {
            try {
                amount = amount*(10**18)
                await auction_contract.methods.bid().send({value: amount.toString(), from: this.state.account})
            } catch (e) {
                console.log('Error, deposit: ', e)
            }
        } else {
            try {
                console.log(amount)
                amount = amount * (10 ** 18)
                console.log(amount)
                let minus_delta = amount - to_return
                console.log(minus_delta)
                await auction_contract.methods.bid().send({value: minus_delta, from: this.state.account})
            } catch (e) {
                console.log('Error, here: ', e)
            }
        }
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
                            <div className="starting" style={{"fontSize": "14px"}}>
                                <strong>??????????????????
                                ???????? </strong><span
                                style={{"color": "#b22222"}}>{this.state.token_startprice / 10 ** 18} bnb</span>
                            </div>
                            <div className="Adress" style={{"fontSize": "14px"}}>
                                <strong>A???????? </strong><span>{this.props.contract_address}</span></div>
                            <div className="endTime" style={{"fontSize": "14px"}}>
                                <strong>?????????????????? </strong><span>{this.state.token_end_date}</span>
                            </div>
                            <div className="highBidder" style={{"fontSize": "14px"}}><strong>Highest
                                bidder </strong><span>{this.state.token_highbidder}</span>
                            </div>
                            <div className="highBidd" style={{"fontSize": "14px"}}><strong>Highest
                                bid </strong><span>{this.state.token_highbid / 10 ** 18} bnb</span>
                            </div>
                            <div className="highBidd" style={{"fontSize": "14px"}}><strong>??????????????????????
                                ???????????? </strong><span>{this.state.token_min_limit / 10 ** 18} bnb</span>
                            </div>
                            <div className="highBidd" style={{"fontSize": "14px"}}><strong>????????????????????????
                                ???????????? </strong><span>{this.state.token_max_limit / 10 ** 18} bnb</span>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                let amount = this.depositAmount.value
                                //amount = amount * 10**18 //convert to wei
                                this.deposit(amount, this.props.contract_address)
                            }}>
                                <div>

                                        <span><input
                                            id='depositAmount'
                                            step="0.001"
                                            type='number'
                                            ref={(input) => {
                                                this.depositAmount = input
                                            }}
                                            className="form-control mb-2 mt-2"
                                            placeholder='amount... (in BNB)'
                                            required/>
                                          </span>
                                    <span><button type='submit'
                                                  className='btn btn-primary mb-2'>?????????????? ????????????</button></span>
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
