import React, {Component} from "react";
import DiamondContract from '../contracts/Diamond.json'
import EnglishAuction from '../contracts/EnglishAuction.json'

import "../App.css";

class ComPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            artToken: {},
            auctionbox: {},
            TokenBalance: '0',
            linkforether: '',
            loading: true,
            isDeposited: 'false',
            DepositStart: 0,
            DepositStartdate: '',
            DepositEther: '',


        }
    }

    async componentWillMount() {
        await this.loadBlockchainData()
    }
    async componentDidMount() {
        var keywords = ["TRANSFERFROM", "ALLOW", "WITHDRAW", "OWNER", "INFO"];
        keywords.forEach((item, index) => {
            document.getElementById(item+"_success").style.display = 'none';
            document.getElementById(item+"_danger").style.display = 'none';
        })
    }

    async loadBlockchainData() {
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        this.setState({addressshort: accounts[0].substr(0, 6) + ' ... ' + accounts[0].substr(accounts[0].length - 4, accounts[0].length)})
        console.log(accounts)

        if (true) {
            const artToken = new web3.eth.Contract(DiamondContract.abi, DiamondContract.networks["5777"].address)
            this.setState({artToken})
            this.setState({linkforether: 'https://testnet.bscscan.com/address/' + this.state.account})


        } else {
            window.alert('Error in connection, contract does not exist in this network')
        }

        this.setState({loading: false})
    }


    async ownerOf(shareId) {
        if (this.state.auctionbox !== 'undefined') {
            console.log(shareId)
            try {
                let owner = await this.state.artToken.methods.ownerOf(shareId).call({from: this.state.account})
                document.getElementById("OWNER_success").style.display = 'block';
                document.getElementById("OWNER_success").innerText = "Адрес владельца: "+owner;
                document.getElementById("OWNER_danger").style.display = 'none';
            } catch (e) {
                console.log('Error, get ownerOf: ', e)
                document.getElementById("OWNER_danger").style.display = 'block';
                document.getElementById("OWNER_danger").innerText = e;
                document.getElementById("OWNER_success").style.display = 'none';
            }
        }
    }

    async allow(to, shareid) {

        try {
            console.log(to)
            console.log("this is state", this.state.account)
            console.log(this.state.artToken)
            await this.state.artToken.methods.approve(to, shareid).send({from: this.state.account})
            document.getElementById("ALLOW_success").style.display = 'block';
            document.getElementById("ALLOW_success").innerText = "Разрешение успешно передано";
            document.getElementById("ALLOW_danger").style.display = 'none';
        } catch (e) {
            console.log('Error, allow: ', e)
            document.getElementById("ALLOW_danger").style.display = 'block';
            document.getElementById("ALLOW_danger").innerText = e;
            document.getElementById("ALLOW_success").style.display = 'none';
        }

    }

    async get_art(token_id) {
        if (this.state.auctionbox !== 'undefined') {
            try {
                let art = await this.state.artToken.methods.getArtToken(token_id).call()
                console.log(art)
                document.getElementById("INFO_success").style.display = 'block';
                document.getElementById("INFO_success").innerText = "Информация о токене:\n"+"Owner: " + art[1] + "\nСущность: " + art[2] + "\nНазвание: " + art[3] + "\nАвтор: " + art[4];
                document.getElementById("INFO_danger").style.display = 'none';
            } catch (e) {
                console.log('Error, get_art: ', e)
                document.getElementById("INFO_danger").style.display = 'block';
                document.getElementById("INFO_danger").innerText = e;
                document.getElementById("INFO_success").style.display = 'none';
            }
        }
    }

    async transfer_from(from, to, shareid) {
        console.log('this is to', to)
        console.log('this is from', from)
        if (this.state.auctionbox !== 'undefined') {
            try {
                await this.state.artToken.methods.safeTransferFrom(from, to, shareid).send({from: this.state.account})
                document.getElementById("TRANSFERFROM_success").style.display = 'block';
                document.getElementById("TRANSFERFROM_success").innerText = "Транзакция успешно завершена";
                document.getElementById("TRANSFERFROM_danger").style.display = 'none';
            } catch (e) {
                console.log('Error, transfer_from: ', e)
                document.getElementById("TRANSFERFROM_danger").style.display = 'block';
                document.getElementById("TRANSFERFROM_danger").innerText = e;
                document.getElementById("TRANSFERFROM_success").style.display = 'none';
            }
        }
    }

    async withdraw(address) {
        const web3 = window.web3
        const auction_contract = new web3.eth.Contract(EnglishAuction.abi, address)
        if (this.state.auctionbox !== 'undefined') {
            try {
                await auction_contract.methods.withdraw().send({from: this.state.account})
                document.getElementById("WITHDRAW_success").style.display = 'block';
                document.getElementById("WITHDRAW_success").innerText = "Транзакция успешно завершена";
                document.getElementById("WITHDRAW_danger").style.display = 'none';
            } catch (e) {
                console.log('Error, withdraw: ', e)
                document.getElementById("WITHDRAW_danger").style.display = 'block';
                document.getElementById("WITHDRAW_danger").innerText = e;
                document.getElementById("WITHDRAW_success").style.display = 'none';
            }
        }
    }


    render() {
        return (

                <section class="py-12" id="pages">
                    <div class="container">
                        <div className="container-fluid">
                            <div class="row" style={{"padding": "10px", "text-align": "center"}}>
                                <div className="col-12" style={{" text-align": "left"}}>

                                    <div class="card" style={{"padding": "15px", "margin": "15px"}}>
                                        <div id="ALLOW_danger" className="alert alert-danger"></div>
                                        <div id="ALLOW_success" className="alert alert-success"></div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            let to = this.TO_ALLOW.value
                                            let shareid = this.shareID_ALLOW.value
                                            this.allow(to, shareid)
                                        }}>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <button type='submit' style={{
                                                    "border-radius": "50px",
                                                    "margin-left": "0px",
                                                    "margin-right": "0px",
                                                    "margin-top": "0px",
                                                    "background-color": "#B22222",
                                                    "border": "solid 1px #B22222"
                                                }} className='btn btn-primary mb-2'><i class="far fa-check-circle"></i>
                                                </button>
                                                <h3 style={{"border-radius": "50px", "margin": "10px"}}>
                                                    <strong> Передать токен на аукцион</strong></h3>
                                            </div>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <div class="col-sm-10 col-md-10">
                                                    <div className='form-group mr-sm-2' style={{"max-width": "80%"}}>
                                                        <input
                                                            id='TO_ALLOW'
                                                            type='string'
                                                            ref={(input) => {
                                                                this.TO_ALLOW = input
                                                            }}
                                                            className="form-control mt-2"
                                                            placeholder='Адрес аукциона или доверенного лица'
                                                            required/>
                                                        <input
                                                            id='shareID_ALLOW'
                                                            type='unit'
                                                            ref={(input) => {
                                                                this.shareID_ALLOW = input
                                                            }}
                                                            className="form-control  mt-2"
                                                            placeholder='Идентификатор токена'
                                                            required/>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-12" style={{" text-align": "left"}}>
                                    <div class="card" style={{"padding": "15px", "margin": "15px"}}>
                                        <div id="OWNER_danger" className="alert alert-danger"></div>
                                        <div id="OWNER_success" className="alert alert-success"></div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            let shareID = this.shareID_Owner.value
                                            this.ownerOf(shareID)
                                        }}>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <button type='submit' style={{
                                                    "border-radius": "50px",
                                                    "margin-left": "0px",
                                                    "margin-right": "0px",
                                                    "margin-top": "0px",
                                                    "background-color": "#B22222",
                                                    "border": "solid 1px #B22222"
                                                }} className='btn btn-primary mb-2'><i class="fas fa-user"></i></button>
                                                <h3 style={{"border-radius": "50px", "margin": "10px"}}>
                                                    <strong> Узнать владельца токена</strong></h3>
                                            </div>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <div class="col-sm-10 col-md-10">
                                                    <div className='form-group mr-sm-2' style={{"max-width": "80%"}}>
                                                        <input
                                                            id='shareID_Owner'
                                                            type='unit'
                                                            ref={(input) => {
                                                                this.shareID_Owner = input
                                                            }}
                                                            className="form-control mt-2"
                                                            placeholder='Идентификатор токена'
                                                            required/>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-12" style={{" text-align": "left"}}>

                                    <div class="card" style={{"padding": "15px", "margin": "15px"}}>
                                        <div id="INFO_danger" className="alert alert-danger"></div>
                                        <div id="INFO_success" className="alert alert-success"></div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            let token_id = this.tokenID.value

                                            this.get_art(token_id)
                                        }}>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <button type='submit' style={{
                                                    "border-radius": "50px",
                                                    "margin-left": "0px",
                                                    "margin-right": "0px",
                                                    "margin-top": "0px",
                                                    "background-color": "#B22222",
                                                    "border": "solid 1px #B22222"
                                                }} className='btn btn-primary mb-2'><i class="fas fa-search"></i>
                                                </button>
                                                <h3 style={{"border-radius": "50px", "margin": "10px"}}>
                                                    <strong> Информация о токене по id</strong></h3>
                                            </div>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <div class="col-sm-10 col-md-10">
                                                    <div className='form-group mr-sm-2' style={{"max-width": "80%"}}>
                                                        <input
                                                            id='tokenID'
                                                            type='string'
                                                            ref={(input) => {
                                                                this.tokenID = input
                                                            }}
                                                            className="form-control mt-2"
                                                            placeholder='Идентификатор токена'
                                                            required/>
                                                    </div>
                                                </div>


                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-12" style={{" text-align": "left"}}>

                                    <div class="card" style={{"padding": "15px", "margin": "15px"}}>
                                        <div id="TRANSFERFROM_danger" className="alert alert-danger"></div>
                                        <div id="TRANSFERFROM_success" className="alert alert-success"></div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            let from = this.from_transfer.value
                                            let to = this.TO_TRANSFER.value
                                            let shareid = this.shareID.value
                                            this.transfer_from(from, to, shareid)
                                        }}>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <button type='submit' style={{
                                                    "border-radius": "50px",
                                                    "margin-left": "0px",
                                                    "margin-right": "0px",
                                                    "margin-top": "0px",
                                                    "background-color": "#B22222",
                                                    "border": "solid 1px #B22222"
                                                }} className='btn btn-primary mb-2'><i class="fas fa-exchange-alt"></i>
                                                </button>
                                                <h3 style={{"border-radius": "50px", "margin": "10px"}}>
                                                    <strong> Отправить токен от третьего лица</strong></h3>
                                            </div>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <div class="col-sm-10 col-md-10">
                                                    <div className='form-group mr-sm-2' style={{"max-width": "80%"}}>
                                                        <input
                                                            id='from_transfer'
                                                            type='string'
                                                            ref={(input) => {
                                                                this.from_transfer = input
                                                            }}
                                                            className="form-control mt-2"
                                                            placeholder='Адрес владельца'
                                                            required/>
                                                        <input
                                                            id='TO_TRANSFER'
                                                            type='string'
                                                            ref={(input) => {
                                                                this.TO_TRANSFER = input
                                                            }}
                                                            className="form-control mt-2"
                                                            placeholder='Адрес получателя'
                                                            required/>
                                                        <input
                                                            id='shareID'
                                                            type='unit'
                                                            ref={(input) => {
                                                                this.shareID = input
                                                            }}
                                                            className="form-control form-control-md col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12  mt-2"
                                                            placeholder='Идентификатор токена'
                                                            required/>
                                                    </div>
                                                </div>


                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-12" style={{" text-align": "left"}}>

                                    <div class="card" style={{"padding": "15px", "margin": "15px"}}>
                                        <div id="WITHDRAW_danger" className="alert alert-danger"></div>
                                        <div id="WITHDRAW_success" className="alert alert-success"></div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            let address_contract = this.ADDRESS_CONTRACT.value
                                            this.withdraw(address_contract)
                                        }}>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <button type='submit' style={{
                                                    "border-radius": "50px",
                                                    "margin-top": "10px",
                                                    "background-color": "#B22222",
                                                    "border": "solid 1px #B22222"
                                                }} className='btn btn-primary mb-2'><i class="fab fa-elementor"></i>
                                                </button>
                                                <h3 style={{"border-radius": "50px", "margin": "10px"}}>
                                                    <strong>Вернуть деньги с проигранного аукциона</strong></h3>
                                            </div>
                                            <div class="row" style={{"padding": "10px"}}>
                                                <div class="col-sm-10 col-md-10">
                                                    <div className='form-group mr-sm-2' style={{"max-width": "80%"}}>
                                                        <input
                                                            id='ADDRESS_CONTRACT'
                                                            type='string'
                                                            ref={(input) => {
                                                                this.ADDRESS_CONTRACT = input
                                                            }}
                                                            className="form-control mt-2"
                                                            placeholder='Адрес аукциона'
                                                            required/>
                                                    </div>
                                                </div>


                                            </div>
                                        </form>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </section>
        );
    }
}

export default ComPage;
