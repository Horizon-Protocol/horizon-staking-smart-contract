pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract ERC20Token1 is ERC20, ERC20Detailed {
    
    constructor () public ERC20Detailed("ERC20", "ERC20T", 18) {
        _mint(msg.sender, 1000000000000000000000000000);
    }
}