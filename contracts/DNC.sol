pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract DNC is StandardToken {
	string public name = 'donationCoin';
	string public symbol = 'DNC';
	uint8 public decimals = 2;
	uint public INITIAL_SUPPLY = 120000;

	function DNC() public {
	  totalSupply_ = INITIAL_SUPPLY;
	  balances[msg.sender] = INITIAL_SUPPLY;
	}
}