import {Component, Input} from '@angular/core';
import {Wallet} from "../../model/wallet.entity";
import {WalletItemComponent} from "../wallet-item/wallet-item.component";
import {NgForOf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {CreateWalletDialogComponent} from "../create-wallet-dialog/create-wallet-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {BaseService} from "../../../shared/services/base.service.service";
import {AuthenticationService} from "../../../iam/services/authentication.service";

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [
    WalletItemComponent,
    NgForOf,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './wallet-list.component.html',
  styleUrl: './wallet-list.component.css'
})
export class WalletListComponent {
  @Input() wallets!: Wallet[];
  currentUserId: number = 0;
  currentUsername: string = '';

  constructor(private dialog: MatDialog,private baseService: BaseService<Wallet>, private authenticationService: AuthenticationService) {
  }

  OnAddWallet(): void {
    const dialogRef = this.dialog.open(CreateWalletDialogComponent, {
      hasBackdrop: true
    });
    this.authenticationService.currentUserId.subscribe(userId => {
        this.currentUserId = userId;
    })
    this.authenticationService.currentUsername.subscribe(username => {
        this.currentUsername = username
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.baseService.createWallet(
          {
            userId: this.currentUserId,
             name: result.walletName,
            initialBalance: result.initialBalance
          }
        ).subscribe({
          next: (wallet) => {
            this.wallets.push(wallet); // Add the new wallet to the array
          },
          error: (err) => {
            console.error('Error creating wallet:', err);
          }
        });
      }
    });
  }

  private generateUniqueId() {
    return Math.floor(Math.random() * 10000) + 1;
  }
}
