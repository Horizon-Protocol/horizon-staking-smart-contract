const { expectRevert, expectEvent, constants, BN } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { italic } = require('ansi-colors');
const { expect } = require('chai');

const ERC20tk1 = artifacts.require('../contracts/token/ERC20Token1');
const ERC20tk2 = artifacts.require("../contracts/token/ERC20Token2");
const StakingRewards = artifacts.require('../contracts/StakingRewards');

contract('staking', (accounts) => {

    before(async function () {

        console.log("staking initializing...");

        this.ERC20tk1 = await ERC20tk1.new();
        console.log("this.ERC20tk1.address........... = ", this.ERC20tk1.address);

        this.ERC20tk2 =await ERC20tk2.new({ from: accounts[1], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 });
        console.log("this.ERC20tk2.address............. = ",this.ERC20tk2.address);

        this.StakingRewards = await StakingRewards.new(accounts[0],accounts[0],this.ERC20tk1.address,this.ERC20tk2.address,{ from: accounts[0], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
        console.log("this.StakingRewards.address............. = ",this.StakingRewards.address);

    });

    describe('test stakingrewards', async function () {
        it('token1 total supply', async function () {
            let value = 0;
            await this.ERC20tk1.totalSupply().then(v => {
                value = v;
            })
            console.log("total supply:"+value);
        });

        it('token1 balanceOf:',async function() {
            let balance = 0;
            await this.ERC20tk1.balanceOf(accounts[0]).then(v=>{
                balance = v;
            })
            console.log("balanceOf is " + balance);
        });
    });


    describe('test ERC20tk2', async function () {
        it('ERC20tk2 total supply', async function () {
            let value = 0;
            await this.ERC20tk2.totalSupply().then(v => {
                value = v;
            })
            console.log("total supply:"+value);
        });

        it('ERC20tk2 balanceOf:',async function() {
            let balance = 0;
            await this.ERC20tk2.balanceOf(accounts[1]).then(v=>{
                balance = v;
            })
            console.log("balanceOf is " + balance);
        });

        it('test ERC20tk2 Transfer', async function(){
            const {logs} = await this.ERC20tk2.transfer(accounts[0],
                new web3.utils.BN('10000000000000000000'),
                { from: accounts[1], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 });
                // console.log(logs);
            expectEvent.inLogs(logs, 'Transfer', {
                from:accounts[1],
                to:accounts[0],
                value:new web3.utils.BN('10000000000000000000')
            });
        });

        it('test ERC20tk2 Transfer', async function(){
            const {logs} = await this.ERC20tk2.transfer(accounts[2],
                new web3.utils.BN('10000000000000000000000'),
                { from: accounts[1], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 });
            expectEvent.inLogs(logs, 'Transfer', {
                from:accounts[1],
                to:accounts[2],
                value:new web3.utils.BN('10000000000000000000000')
            });
        });

        it('ERC20tk2 balanceOf:',async function() {
            let balance = 0;
            await this.ERC20tk2.balanceOf(accounts[1]).then(v=>{
                balance = v;
            })
            console.log("accounts[1] balanceOf is " + balance);

            await this.ERC20tk2.balanceOf(accounts[0]).then(v=>{
                balance = v;
            })
            console.log("accounts[0]balanceOf is " + balance);

            await this.ERC20tk2.balanceOf(accounts[2]).then(v=>{
                balance = v;
            })
            console.log("accounts[2]balanceOf is " + balance);
        });

        it('before notifyReword',async function(){
            let ten_k_rewards= new web3.utils.BN('10000000000000000000000');
            const {logs} = await this.ERC20tk1.transfer(this.StakingRewards.address,
                ten_k_rewards,
                { from: accounts[0], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 });
            expectEvent.inLogs(logs, 'Transfer', {
                from:accounts[0],
                to:this.StakingRewards.address,
                value:ten_k_rewards
            });
        });

        it('notifyReward',async function(){
            
            let amt = new web3.utils.BN('10000000000000000000000')
            const {logs2}  = await this.StakingRewards.notifyRewardAmount(amt,
                { from: accounts[0], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
            // expectEvent.inLogs(logs2, 'RewardAdded', {
            //     reward:amt
            // });
        });

        it('mystaking accounts[2] approve',async function(){

            let amt = new web3.utils.BN('100000000000000000000000')
            //1. approve
            const{logs} = await this.ERC20tk2.approve(this.StakingRewards.address,amt,
                { from: accounts[2], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
            // console.log(logs);
            expectEvent.inLogs(logs, 'Approval', {
                owner:accounts[2],
                spender:this.StakingRewards.address,
                value:amt
            });
           
        });

        it('mystaking accounts[1] approve',async function(){

            let amt = new web3.utils.BN('100000000000000000000000')
            //1. approve
            const{logs} = await this.ERC20tk2.approve(this.StakingRewards.address,amt,
                { from: accounts[1], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
            // console.log(logs);
            expectEvent.inLogs(logs, 'Approval', {
                owner:accounts[1],
                spender:this.StakingRewards.address,
                value:amt
            });
           
        });



        it('mystaking stake',async function(){
            let amt = new web3.utils.BN('100000000000000000000')

            const {logs}  = await this.StakingRewards.stake(amt, 
                { from: accounts[2], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
                expectEvent.inLogs(logs, 'Staked', {
                    user:accounts[2],
                    amount:amt
                });

            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
            await timeout(20000);    
        })

        it('mystaking stake',async function(){
            let amt = new web3.utils.BN('200000000000000000000')

            const {logs}  = await this.StakingRewards.stake(amt, 
                { from: accounts[2], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
                expectEvent.inLogs(logs, 'Staked', {
                    user:accounts[2],
                    amount:amt
                });

            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
            await timeout(20000);    
        })

        it('mystaking totalsupply',async function(){
            let amt = '300000000000000000000'
            let t = 0;
            await this.StakingRewards.totalSupply().then(v=>{
                t = v;
            })

            console.log("totalsupply:"+web3.utils.hexToNumberString(t));
            assert.equal(web3.utils.hexToNumberString(t),amt,"totalsupply failed");
        });

        it('mystaking balanceOf',async function(){
            let amt = '300000000000000000000'
            let t = 0;
            await this.StakingRewards.balanceOf(accounts[2]).then(v=>{
                t = v;
            })

            console.log("balanceOf[ accounts[2]:"+web3.utils.hexToNumberString(t));
            assert.equal(web3.utils.hexToNumberString(t),amt,"get balanceOf failed");
        });

        it('mystaking lastTimeRewardApplicable',async function(){
            let t = 0;
            await this.StakingRewards.lastTimeRewardApplicable().then(v=>{
                t = v;
            })
            console.log("lastTimeRewardApplicable:"+web3.utils.hexToNumberString(t));

        });


        it('mystaking withdrawableAmount',async function(){
            let t = 0;
            await this.StakingRewards.withdrawableAmount(accounts[2]).then(v=>{
                t = v;
            })
            console.log("withdrawableAmount:"+web3.utils.hexToNumberString(t));
        });

        it('mystaking rewardPerToken',async function(){
            let t = 0;
            await this.StakingRewards.rewardPerToken().then(v=>{
                t = v;
            })
            console.log("rewardPerToken:"+web3.utils.hexToNumberString(t));
        });

        it('mystaking earned',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[2]).then(v=>{
                t = v;
            })
            console.log("account2 earned:"+web3.utils.hexToNumberString(t));
           
        });

        it('mystaking stake',async function(){
            let amt = new web3.utils.BN('100000000000000000000')

            const {logs}  = await this.StakingRewards.stake(amt, 
                { from: accounts[1], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
                expectEvent.inLogs(logs, 'Staked', {
                    user:accounts[1],
                    amount:amt
                });

            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
            await timeout(20000);    
        })

        it('mystaking earned',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[1]).then(v=>{
                t = v;
            })
            console.log("account1 earned:"+web3.utils.hexToNumberString(t));
           
        });


        it('mystaking earned',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[2]).then(v=>{
                t = v;
            })
            console.log("account2 earned:"+web3.utils.hexToNumberString(t));
           
        });


        it('before notifyReword round 2',async function(){
            let ten_k_rewards= new web3.utils.BN('10000000000000000000000');
            const {logs} = await this.ERC20tk1.transfer(this.StakingRewards.address,
                ten_k_rewards,
                { from: accounts[0], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 });
            expectEvent.inLogs(logs, 'Transfer', {
                from:accounts[0],
                to:this.StakingRewards.address,
                value:ten_k_rewards
            });
        });

        it('notifyReward round 2',async function(){
            
            let amt = new web3.utils.BN('10000000000000000000000')
            const {logs2}  = await this.StakingRewards.notifyRewardAmount(amt,
                { from: accounts[0], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
            // expectEvent.inLogs(logs2, 'RewardAdded', {
            //     reward:amt
            // });
        });

        it('mystaking earned @round2',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[1]).then(v=>{
                t = v;
            })
            console.log("account1 earned:"+web3.utils.hexToNumberString(t));
           
        });


        it('mystaking earned @round2',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[2]).then(v=>{
                t = v;
            })
            console.log("account2 earned:"+web3.utils.hexToNumberString(t));
           
        });

        it('mystaking stake',async function(){
            let amt = new web3.utils.BN('200000000000000000000')

            const {logs}  = await this.StakingRewards.stake(amt, 
                { from: accounts[2], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
                expectEvent.inLogs(logs, 'Staked', {
                    user:accounts[2],
                    amount:amt
                });

            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
            await timeout(20000);    
        })

        it('mystaking stake',async function(){
            let amt = new web3.utils.BN('200000000000000000000')

            const {logs}  = await this.StakingRewards.stake(amt, 
                { from: accounts[2], value: web3.utils.toWei('0', 'ether'), gas: 200000000, gasPrice: 50 })
                expectEvent.inLogs(logs, 'Staked', {
                    user:accounts[2],
                    amount:amt
                });

            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
            await timeout(20000);    
        })
        it('mystaking earned @round2',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[1]).then(v=>{
                t = v;
            })
            console.log("account1 earned:"+web3.utils.hexToNumberString(t));
           
        });


        it('mystaking earned @round2',async function(){
            let t = 0;
            await this.StakingRewards.earned(accounts[2]).then(v=>{
                t = v;
            })
            console.log("account2 earned:"+web3.utils.hexToNumberString(t));
           
        });

    });

})