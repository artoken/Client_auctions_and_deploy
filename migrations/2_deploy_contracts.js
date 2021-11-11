var Diamond = artifacts.require("./Diamond.sol");
var AuctionBox = artifacts.require("./AuctionBox.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Diamond);
  await deployer.deploy(AuctionBox);
  //token = await Token.deployed();
  //await token.passMinterRole(dBank.address);
};
