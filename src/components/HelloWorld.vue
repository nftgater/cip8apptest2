<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <button id="login-btn">Do Shit</button>
  </div>
</template>

<script lang="ts">
import { Buffer } from "buffer";
let csl, wallet;

async function loadCsl(){
    csl = await import("@emurgo/cardano-serialization-lib-browser");
};
loadCsl();

/*
// NOTES: 
// The commented-out functions come from this CIP-0008 guide: https://developers.cardano.org/docs/integrate-cardano/user-wallet-authentication/

// The crash comes from the first usage of the cardano-serialization-library, in getStakeAddress(), after clicking the button to run authenticate().
// >>> This one >>> ``` const changeAddress = csl.Address.from_bytes( Buffer.from(changeAddrHex, 'hex') ); ```

// As-is, this app runs fine. As soon as I add the functions below 


window.addEventListener("load", () => {
    const loginBtn = document.querySelector("#login-btn");
    loginBtn.addEventListener("click", authenticate);
})

async function authenticate(){
    if (!csl) await loadCsl(); // make sure CSL is loaded before doing anything else.

    wallet = await window.cardano.nami.enable(); // was: typhoncip30

    const [stakeAddrHex, stakeAddrBech32] = await getStakeAddress();
    const messageUtf = `account: ${stakeAddrBech32}`;
    const messageHex = Buffer.from(messageUtf).toString("hex");    
    const sigData = await wallet.signData(stakeAddrHex, messageHex);
    const result = await submitToBackend(sigData);
    alert(result.message);
}


async function getStakeAddress(){
    const networkId = await wallet.getNetworkId();
    const changeAddrHex = await wallet.getChangeAddress();
    
    // derive the stake address from the change address to be sure we are getting
    // the stake address of the currently active account.
    const changeAddress = csl.Address.from_bytes( Buffer.from(changeAddrHex, 'hex') );
    const stakeCredential = csl.BaseAddress.from_address(changeAddress).stake_cred();
    const stakeAddress = csl.RewardAddress.new(networkId, stakeCredential).to_address();

    return [stakeAddress.to_hex(), stakeAddress.to_bech32()];
}

// Not even worried about this part right now.
async function submitToBackend(sigData){
    const result = await fetch(`http://localhost:8081/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sigData),
    });
    return result.json();
}
*/
export default {
	data() {
		return {
      csl: null,
    }
  },
  methods: {},
  mounted() {

  }
}


</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
