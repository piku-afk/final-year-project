const Auth = artifacts.require('Auth');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
let instance = null;

contract.skip('Auth 2', function (accounts) {
  beforeEach(async () => {
    instance = await Auth.deployed();
  });

  it('should be deployed', async function () {
    assert.ok(instance.address);
  });

  it('should verify address', async () => {
    // console.log('Account: ', accounts[0]);
    const message = Buffer.from('hello world ! Piyush');
    const originalSig = await web3.eth.sign(
      '0x' + message.toString('hex'),
      accounts[0]
    );
    // const message = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C';
    // console.log('message: ', message);
    const prefix = Buffer.from('\x19Ethereum Signed Message:\n');
    const hash = web3.utils.sha3(
      Buffer.concat([prefix, Buffer.from(String(message.length)), message])
    );
    // console.log('hash: ', hash);
    // const signature =
    //   '0xc5e1ee5dd2e62aa333fb8eaa196012fc7439dae65bd69b92c96490d3c102c3244741b5b5ef4f855bffac4071a2519b12b2381df8e1c351f4b8a86bce23fbdd2b1c';

    const sig = originalSig.slice(2);
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = web3.utils.hexToNumber('0x' + sig.slice(128, 130)) + 27;

    // console.log('original sig: ', originalSig);
    // console.log('sig: ', sig);
    // console.log('r: ', r);
    // console.log('s: ', s);
    // console.log('v: ', v);
    // const temp = '0x' + hash;

    const result = await instance.verify.call(hash, v, r, s);
    // console.log('result: ', result);
    assert.equal(accounts[0], result);
  });

  // it('should verify address', async () => {
  //   console.log('Account: ', accounts[0]);
  //   const message = 'hello world ! Piyush';
  //   // const message = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C';
  //   // console.log('message: ', message);
  //   const prefix = '\x19Ethereum Signed Message:\n' + message.length;
  //   const hash = web3.utils.sha3(prefix + message);
  //   console.log('hash: ', hash);
  //   // const signature =
  //   //   '0xc5e1ee5dd2e62aa333fb8eaa196012fc7439dae65bd69b92c96490d3c102c3244741b5b5ef4f855bffac4071a2519b12b2381df8e1c351f4b8a86bce23fbdd2b1c';

  //   const originalSig = await web3.eth.sign(hash, accounts[0]);
  //   const sig = originalSig.slice(2);
  //   const r = `0x${sig.slice(0, 64)}`;
  //   const s = `0x${sig.slice(64, 128)}`;
  //   const v = web3.utils.hexToNumber('0x' + sig.slice(128, 130)) + 27;

  //   console.log('original sig: ', originalSig);
  //   console.log('sig: ', sig);
  //   console.log('r: ', r);
  //   console.log('s: ', s);
  //   console.log('v: ', v);
  //   // const temp = '0x' + hash;

  //   const result = await instance.verify.call(hash, v, r, s);
  //   console.log('result: ', result);
  //   // assert.isTrue(true);
  // });
});
