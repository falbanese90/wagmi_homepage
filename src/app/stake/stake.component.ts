import { Component, OnInit } from '@angular/core';
import * as solanaWeb3 from '@solana/web3.js';
import { EventEmitter } from 'stream';
import { Staked } from '../models/staked';
import { StakingService } from '../staking_service/staking.service';

declare global {
  interface Window {
      solana: any;
  }
}
const isPhantomInstalled: boolean = window.solana && window.solana.isPhantom;

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
  public_key: string = 'Not Connected';
  staked: boolean = false;
  image_present: boolean = false;
  staked_list: Staked[] = [];
  
  constructor(private stakeService: StakingService) {}

  ngOnInit(): void {
  }
 
  async connect(): Promise<void> {
    try {
      const resp = await window.solana.connect();
      console.log(resp);
      const result = await resp.publicKey.toString()
      this.public_key = result;
    } catch (err) {
      console.log(`${err}`);
    }
    this.stakeService.select(this.public_key).subscribe(res => {
      this.staked_list = res;
      if (this.staked_list.length >= 1) {
        this.staked = true;
        this.stakeService.getTime(this.public_key).subscribe(res => {
          this.timestamp = res;
        });

        console.log(this.staked)
        console.log(this.timestamp);
      }
      console.log(this.staked)
    })
    if (window.solana.isConnected) {
      this.image_present = true;
    }
    console.log(this.staked)
  }


  stake() {
    this.stakeService.addStaked(this.public_key);
    this.staked = true;
  }
  unstake() {
    this.stakeService.del(this.public_key).subscribe(() => console.log('Stake ended'));
    this.staked = false;
  }

}
