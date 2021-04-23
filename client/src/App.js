import React, { Component } from "react";
import Web3 from 'web3';
import ART_CONTRACT from './contracts/ART_CONTRACT.json'
import AuctionBox from './contracts/AuctionBox.json'
import EnglishAuction from './contracts/EnglishAuction.json'

import Navbar from './Navbar'
import "./App.css";
class App extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({addressshort: accounts[0].substr(0, 6)+' ... '+accounts[0].substr(accounts[0].length-4, accounts[0].length)})
    console.log(accounts)

    if (true) {
      const artToken = new web3.eth.Contract(ART_CONTRACT.abi, '0x28A27786C12D801d1E70c92ab26392aDB9b85937')
      this.setState({artToken})
      const auctionbox = new web3.eth.Contract(AuctionBox.abi, '0xf11bB3DcE3FF244AD22969cDC03060Ac43D4600a')
      this.setState({auctionbox})
      this.setState({linkforether: 'https://testnet.bscscan.com/address/'+this.state.account})

      this.setState({ address_auction: '0x91F4BfC72c41D6C5506e470aE444cCEF63B02DAA' })

      let mould_address = await auctionbox.methods.returnAllAuctions().call()
      this.setState({auction_address: mould_address})

      var i, id_internal, auctionEndTime, highestBidder, highestBid, startPrice, beneficiary, link, tokenid, link_for_auction //min_limit, max_limit
      var massiv_id = []
      var massiv_auctionEndTime = []
      var massiv_highestBidder = []
      var massiv_highestBid = []
      var massiv_startPrice = []
      var massiv_beneficiary = []
      var massiv_links = []
      var massiv_min_limits = []
      var massiv_max_limits = []
      

      for (i=0; i<mould_address.length; i++) {
        var address = mould_address[i]
        const auction_contract = new web3.eth.Contract(EnglishAuction.abi, address)
        id_internal = await auction_contract.methods.token_id().call()
        massiv_id.push(id_internal)
        
        beneficiary = await auction_contract.methods.beneficiary().call()
        massiv_beneficiary.push(beneficiary)

        auctionEndTime = await auction_contract.methods.auctionEndTime().call()
        var datemax = new Date(auctionEndTime*1000);
        massiv_auctionEndTime.push(String(datemax))

        highestBidder = await auction_contract.methods.highestBidder().call()
        massiv_highestBidder.push(highestBidder)

        highestBid = await auction_contract.methods.highestBid().call()
        massiv_highestBid.push(highestBid)

        startPrice = await auction_contract.methods.startPrice().call()
        massiv_startPrice.push(startPrice)

        tokenid = await auction_contract.methods.token_id().call()
        link = await artToken.methods.get_link_by_token_id(tokenid).call()
        link_for_auction = 'https://ipfs.io/ipfs/' + link
        massiv_links.push(link_for_auction)

        let massiv = await auction_contract.methods.bid_range().call()
        massiv_min_limits.push(massiv[0])
        massiv_max_limits.push(massiv[1])
      }
      this.setState({tokens_ids: massiv_id})
      this.setState({tokens_bnfcr: massiv_beneficiary})
      this.setState({tokens_end_times: massiv_auctionEndTime})
      this.setState({tokens_highbidders: massiv_highestBidder})
      this.setState({tokens_highbid: massiv_highestBid})
      this.setState({tokens_startprices: massiv_startPrice})
      this.setState({tokens_images: massiv_links})
      this.setState({tokens_min_limits: massiv_min_limits})
      this.setState({tokens_max_limits: massiv_max_limits})

    } else {
      window.alert('Error in connection, contract does not exist in this network')
    }

    this.setState({loading: false})
  }



  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Please install Metamask")
    }

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      address_auction: '0x0',
      artToken: {},
      auctionbox: {},
      TokenBalance: '0',
      linkforether: '',
      loading: true,
      isDeposited: 'false',
      DepositStart: 0,
      DepositStartdate: '',
      DepositEther: '',
      auction_address: [],
      tokens_ids: [],
      tokens_bnfcr: [],
      tokens_end_times: [],
      tokens_highbidders: [],
      tokens_highbid: [],
      tokens_startprices: [],
      tokens_images: [],
      tokens_min_limits: [],
      tokens_max_limits: [],

    }
  }

  async deposit(amount, address) {
    console.log(amount)
    const web3 = window.web3
    const auction_contract = new web3.eth.Contract(EnglishAuction.abi, address)
    let to_return = await auction_contract.methods.get_latest_bid(this.state.account).call()
    
    let amount_to_return = to_return.toString()
    console.log(amount_to_return)


    if (amount_to_return === 0) {
      try{
        await auction_contract.methods.bid().send({value: amount.toString(), from: this.state.account})
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
    else {
      try{
        console.log(amount)
        amount = amount*(10**18)
        console.log(amount)
        let minus_delta = amount -amount_to_return
        console.log(minus_delta)
        await auction_contract.methods.bid().send({value: minus_delta, from: this.state.account})
      } catch (e) {
        console.log('Error, here: ', e)
      }
    }
    
    
  }
  
  render() {
    return (
      
      <div className = "content">

        <Navbar account={this.state.account} linkforether={this.state.linkforether} short={this.state.addressshort}/>
        
        <section className="py-12" id="pages">
			    <div className="container">
				    <div className="row justify-content-center">
					    <div className="col-12 col-md-12 mt-3 col-lg-12 col-xl-12 text-center">
              <div className="row justify-content-center" >
                  <div className="col-sm-12 col-md-12" style={{"text-align":"center"}}>
                    <h1 style={{"margin-top": "0px", "box-sizing": "border-box", 'font-family': "'Arsenal', sans-serif"}}>Активные аукционы</h1>
                  </div>
                </div>
               
                  <div className="row justify-content-center" id="myAuctions" style={{"text-align": "center",	"box-sizing": "border-box"}}>

                      { this.state.auction_address.map((address, key) => {
                        return(
                          <div key={key} className="col-sm-12 col-md-12" style={{"textAlign": "left"}}>

                            <div className="card" style={{"padding": "15px", "margin": "15px"}}>
                              <div style={{"background": "#277cfd","display":"none"}} className="card-header d-sm-flexjustify-content-center" onMouseOver="this.style.background='#B22222'" onMouseOut="this.style.background='#277cfd'" >
                                <div className="card-title" style={{"box-sizing": "border-box", "text-align": "center","display":"none"}}> 
                                  <h3><a href="*" style={{"text-align": "center", "color":"#fff","display":"none"}} className="display-none">{this.state.tokens_ids[key]}</a></h3> 
                                </div>
                              </div>
                              <div className="row" style={{"padding": "10px"}} >
                                <div className="col-sm-4 col-md-4" >
                                <img style={{"width": "100%", "zIndex": "1;"}} className="scale" src={this.state.tokens_images[key]} alt="Тут Токен должен жить"/>
                                </div>
                              
                              <div className="col-sm-8 col-md-8" style={{"text-align": "left", "z-index": "2", "overflow": "hidden"}}>
                                  <div className="Bnfcry" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Бенифициар </strong><span>{this.state.tokens_bnfcr[key]}</span></div>
                                  <div className="starting"style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Начальная цена </strong><span style={{"color":"#B22222"}}>{this.state.tokens_startprices[key]/10**18} bnb</span></div>
                                  <div className="Adress" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Aдрес </strong><span>{address}</span></div>
                                  <div className="endTime" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Окончание </strong><span>{this.state.tokens_end_times[key]}</span></div>
                                  <div className="highBidder" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Highest bidder </strong><span>{this.state.tokens_highbidders[key]}</span></div>
                                  <div className="highBidd" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Highest bid </strong><span>{this.state.tokens_highbid[key]/10**18} bnb</span></div>
                                  <div className="highBidd" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Минимальная ставка </strong><span>{this.state.tokens_min_limits[key]/10**18} bnb</span></div>
                                  <div className="highBidd" style={{"fontSize":"14px"}} onmouseover="this.style.color='#B22222'" onmouseout="this.style.color='#000'"><strong>Максимальная ставка </strong><span>{this.state.tokens_max_limits[key]/10**18} bnb</span></div>
                                  <form onSubmit={(e) => {
                                      e.preventDefault()
                                      let amount = this.depositAmount.value
                                      //amount = amount * 10**18 //convert to wei
                                      this.deposit(amount, address)
                                    }}>
                                      <div >
                                    
                                        <span><input
                                          id='depositAmount'
                                          step="0.001"
                                          type='number'
                                          ref={(input) => { this.depositAmount = input }}
                                          className="form-control mb-2 mt-2"
                                          placeholder='amount... (in BNB)'
                                          required />
                                          </span>
                                          <span><button type='submit' className='btn btn-primary mb-2'>Сделать ставку</button></span>
                                      </div>
                                      
                                </form>

                            </div>
                            </div>
                            </div>
                          </div>
                            

                          
                          
                        )
                      })}

                </div>  
        </div>      
      </div>
      </div>
      </section>
      </div>
    );
  }
}
export default App;
