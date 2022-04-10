const Auth = artifacts.require('Auth');
const AccountJSON = require('../build/contracts/Account.json');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
let instance = null;

contract('Auth', function (accounts) {
  beforeEach(async () => {
    instance = await Auth.deployed();
  });

  it('should be deployed', async function () {
    assert.ok(instance.address);
  });

  it('should create and verify the account', async () => {
    // Step 1: Create new account (Sign Up Page)
    const signUpNonce = 'Piyush';
    const message = (nonce) => Buffer.from(`Hello ${nonce}`);
    await instance.signUp(Buffer.from(signUpNonce), 'Piku');

    // Step 2: Login into the new account (Login Page)
    // Step 2.a:  Get the address of Contract Account and create a web3 instance using it
    const contractAddress = await instance.getAccountAddress();
    const accountInstance = new web3.eth.Contract(
      AccountJSON.abi,
      contractAddress
    );

    // Step 2.b: Get the nonce from the contract
    // messageHex to be fetched from backend
    const accountNonce = await accountInstance.methods.getNonce().call();
    const loginNonce = web3.utils.hexToUtf8(accountNonce);
    console.log(loginNonce);
    const messageHex = '0x' + message(loginNonce).toString('hex');
    console.log(messageHex);
    const signature = await web3.eth.sign(messageHex, accounts[0]);
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    const v = web3.utils.hexToNumber('0x' + signature.slice(130, 132)) + 27;

    // Step 2.c: Sign Message (to be done in frontend)
    const prefix = Buffer.from('\x19Ethereum Signed Message:\n');
    const hashForVerification = web3.utils.sha3(
      Buffer.concat([
        prefix,
        Buffer.from(String(message(loginNonce).length)),
        message(loginNonce),
      ])
    );
    const result = await accountInstance.methods
      .verify(hashForVerification, v, r, s)
      .call();

    assert.equal(signUpNonce, loginNonce);
    assert.isTrue(result);
  });
});
