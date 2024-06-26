// The commented-out functions come from this CIP-0008 guide: https://developers.cardano.org/docs/integrate-cardano/user-wallet-authentication/

// The crash comes from the first usage of the cardano-serialization-library, in getStakeAddress(), after clicking the button to run authenticate().
// >>> This one >>> const changeAddress = csl.Address.from_bytes( Buffer.from(changeAddrHex, 'hex') ); 

// As-is, this app runs fine. As soon as I add anything else the browser crashes, I suspect a WASM issue.