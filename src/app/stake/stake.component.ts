import { Component, OnInit } from '@angular/core';
import * as solanaWeb3 from '@solana/web3.js';

declare global {
  interface Window {
      solana: any;
  }
}

const isPhantomInstalled: boolean = window.solana && window.solana.isPhantom;

const connect = async (): Promise<String> => {
  {
  try {
    const resp = await window.solana.connect();
    const result = resp.publicKey.toString()
    window.alert(`${result} is connected and blockcahin ready`);
    return result;
} catch (err) {
    return "${err}";
}
  }
}


const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.css']
})
export class StakeComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    connect();

  }

}
