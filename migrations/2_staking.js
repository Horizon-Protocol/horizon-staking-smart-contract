const staking = artifacts.require("StakingRewards");


module.exports = function (deployer,network,accounts) {
  deployer.deploy(staking,'0x64aC4907B29aA25f4Df91356fAC4772F16A4803e','0x64aC4907B29aA25f4Df91356fAC4772F16A4803e','0xe2fff5156e4148441607e12d082314f38d2612ff','0xE2Fff5156e4148441607e12D082314F38d2612fF');
};
