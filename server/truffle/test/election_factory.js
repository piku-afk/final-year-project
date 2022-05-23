const ElectionFactory = artifacts.require('ElectionFactory');
const ElectionJSON = require('../build/contracts/Election.json');

// $> truffle test ./test/election_factory.js

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

let instance = null;

contract('ElectionFactory', function (accounts) {
  beforeEach(async () => {
    instance = await ElectionFactory.deployed();
  });

  it('should be deployed', async function () {
    assert.ok(instance.address);
  });

  it('returns address', async () => {
    const electionAddress = await instance.deploy.call(accounts[1]);
    const accountInstance = new web3.eth.Contract(
      ElectionJSON.abi,
      electionAddress
    );
    // .at(
    //   electionAddress
    // );
    const address = accountInstance.methods.getOwner();
    const address2 = accountInstance.methods.owner.call();
    console.log(address);
    console.log(address2);
    // console.log(electionAddress);
    // assert.isTrue(true);
  });
});
