import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {NgbCalendar, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {ConnexionService} from "../services/connexion.service";
import {ContractService} from "../services/contract.service";
import * as html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-html-contract',
  templateUrl: './html-contract.component.html',
  styleUrls: ['./html-contract.component.css']
})
export class HtmlContractComponent implements OnInit {
  private idContract: number;
  public errorMessage: string = "";
  public returnError = false;
  public contract: any = null;
  public parent: any = null;
  public babysitter: any = null;
  public loading: boolean = false;

  constructor(private route: ActivatedRoute, private authService: ConnexionService, private router: Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
              private contratService: ContractService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.loading = true;
      if (params['id']) {
        this.idContract = params['id'];
        await this.initContractById();
        await this.getUserById(this.contract["idParent"], true);
        await this.getUserById(this.contract["idBabysitter"], false);
      }
      console.log(this.parent);
      this.loading = false;
    });
  }

  async getUserById(id: number, isParent: boolean) {
    await this.authService.getUserById(id).then(
      (data: any) => {
        if (isParent) {
          this.parent = data.response;
        } else {
          this.babysitter = data.response;
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      }
    );
  }

  async initContractById() {
    await this.contratService.getById(this.idContract).then(
      (data: any) => {
        if (data.response) {
          this.contract = data.response;
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      }
    );

  }

  download() {
    let element = document.getElementById('table');
    let opt = {
      margin: 1,
      filename: 'contract' + this.contract.id + '.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    };
// New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }

}
