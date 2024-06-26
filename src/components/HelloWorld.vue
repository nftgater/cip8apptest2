<template>
  <div class="greetings">
    <h1 class="green">CIP-008 Implementation</h1>
    <p>A Vue3 port of this <a href="https://developers.cardano.org/docs/integrate-cardano/user-wallet-authentication/" target="_blank">CIP-0008 implementation guide</a> on message signing for user authentication.</p>
    <button id="login-btn" @click="authenticate">Connect Nami</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Buffer } from "buffer";
import * as CardanoSerializationLib from '@emurgo/cardano-serialization-lib-browser';

// Declare variables
let wallet: any;

export default defineComponent({
  data() {
    return {
      csl: null as typeof CardanoSerializationLib | null,
    };
  },
  methods: {
    async loadCsl() {
      this.csl = await import("@emurgo/cardano-serialization-lib-browser");
    },
    async authenticate() {
      console.log("in authenticate()");

      if (!this.csl) await this.loadCsl();

      
      wallet = await (window as any).cardano.nami.enable(); // was: typhoncip30
      console.log(`Debug: wallet: ${wallet}`)

      const [stakeAddrHex, stakeAddrBech32] = await this.getStakeAddress();

      const messageUtf = `account: ${stakeAddrBech32}`;
      console.log(`Debug: messageUtf: ${messageUtf}`)

      const messageHex = Buffer.from(messageUtf).toString("hex");
      const sigData = await wallet.signData(stakeAddrHex, messageHex);
      console.log(`debug: sigData: ${sigData}`)

      alert(`Your stake address is ${stakeAddrBech32}. In a real-world application, the frontend would send your sigData to an API backend to verify a wallet.`)

      const result = await this.submitToBackend(sigData);
      console.log("debug: result: ")
      console.log(result)
      

      return;
    },

    // NOTES: 
    // The commented-out functions come from this CIP-0008 guide: https://developers.cardano.org/docs/integrate-cardano/user-wallet-authentication/
    // The crash comes from the first usage of the cardano-serialization-library, in getStakeAddress(), after clicking the button to run authenticate().
    // >>> This one >>> ``` const changeAddress = csl.Address.from_bytes( Buffer.from(changeAddrHex, 'hex') ); ```

    // As-is, this app runs fine. As soon as I add anything else the browser crashes, I suspect a WASM issue.

    async getStakeAddress() {
      console.log("In getStakeAddress")

      const networkId = await wallet.getNetworkId();
      const changeAddrHex = await wallet.getChangeAddress();

      // derive the stake address from the change address to be sure we are getting
      // the stake address of the currently active account.
      const changeAddress = this.csl!.Address.from_bytes(Buffer.from(changeAddrHex, 'hex'));
      console.log(`debug: changeAddress: ${changeAddress}`)

      let baseAddress = this.csl!.BaseAddress.from_address(changeAddress)
      if (!baseAddress) {
        throw new Error("Invalid base address");
      }
      const stakeCredential = baseAddress.stake_cred();
      if (!stakeCredential) {
        throw new Error("Invalid stake credential");
      }
      
      const stakeAddress = this.csl!.RewardAddress.new(networkId, stakeCredential).to_address();
      console.log(`debug: stakeAddress: ${stakeAddress}`)



      return [stakeAddress.to_hex(), stakeAddress.to_bech32()];
    },

    // Not even worried about this part right now.
    async submitToBackend(sigData: any) {
      console.log("In submitToBackend")

      /*
      const result = await fetch(`http://localhost:8081/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sigData),
      });
      return result.json();
      */
     return;
    }
  },
  mounted() {
    /* event listener is redundant with the '@click'
    window.addEventListener("load", () => {
      const loginBtn = document.querySelector("#login-btn");
      if (loginBtn) {
        loginBtn.addEventListener("click", this.authenticate);
      }
    });
    */
  }
});
</script>

<style scoped>
button {
  border-radius: 15px;
  border: 1px solid black;
  background-color: darkgreen;
  color: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.8);
  line-height: 1em;
  margin: 1em;
  font-size: 1.5em;
  font-family: monospace;
  padding: 5px;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings {
  text-align: center;
  padding: 2em;
  border: 1px solid yellow;
  border-radius: 10px;
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
