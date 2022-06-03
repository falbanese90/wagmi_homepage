import { ChangeDetectorRef, Component, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as solanaWeb3 from '@solana/web3.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staked, Time } from '../models/staked';
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
  public_display: string = 'Not Connected';
  public_key: string = '';
  staked: boolean = false;
  image_present: boolean = false;
  staked_list: Staked[] = [];
  reward: number = 0;
  stake_date: Time = {
    t: ''
  };
  now_date: Date = new Date();
  date_staked: Date = new Date();
  tokens: number = 0;

  
  constructor(private stakeService: StakingService) {}

  ngOnInit(): void {
    this.now_date = new Date();
  }


  async connect(): Promise<void> {
    try {
      const resp = await window.solana.connect();
      console.log(resp);
      const result = await resp.publicKey.toString()
      this.public_key = result;
      this.public_display = `${result.slice(0,4)}...${result.slice(40)}`;
    } catch (err) {
      console.log(`${err}`);
    }
    this.stakeService.select(this.public_key).subscribe(res => {
      this.staked_list = res;
      if (this.staked_list.length >= 1) {
        this.staked = true;
      }
    })
    await new Promise(r => setTimeout(r, 500));
    if (window.solana.isConnected) {
      this.image_present = true;
    }
    console.log(this.staked)
    this.stakeService.getTime(this.public_key).subscribe(res => {
      this.stake_date = res;
    })
    await new Promise(r => setTimeout(r, 500));
    this.date_staked = new Date(this.stake_date.t)
    this.now_date = new Date();
    const diff = this.now_date.getTime() - this.date_staked.getTime();
    this.tokens = diff / 1000;
    }
  


  async stake() {
    this.stakeService.addStaked(this.public_key);
    await new Promise(r => setTimeout(r, 500));
    this.staked = true;
     this.stakeService.select(this.public_key).subscribe(res => {
      this.staked_list = res;
    });
    this.now_date = new Date();
  }

  unstake() {
    this.stakeService.del(this.public_key).subscribe(() => console.log('Stake ended'));
    this.staked = false;
    this.staked_list = []
    this.now_date = new Date();
    this.tokens = 0;
  }
  
}
