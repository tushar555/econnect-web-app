import { Component, OnInit, NgZone } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LocalStorageService, LocalStorage } from 'ngx-store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { log } from 'util';
import { Router } from '@angular/router';
import { Constant } from "../../services/constant";

declare var jquery: any;
declare var $;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  localUserData: any;
  rating: any;
  questionList: any;
  inputArea = [];
  radioGroup = [];
  starRateArray = [];
  abcd: any = {};
  feedBackForm;
  private tempArray: any = [];
  constructor(public spinnerSerive: Ng4LoadingSpinnerService, public local: LocalStorageService, public _service: CommonService, public zone: NgZone, public route: Router) {
    this._service.titleMessageSource.next("Feedback");  
    this._service.getUserDetail().then((data)=>{
      this.localUserData = data;
      this.getQuestionList();
      this.initializeStarArray();
    });
  }

  ngOnInit() {
   
  }

  getQuestionList(): any {
    let link = Constant.GetFeedbackQuestions
    this.spinnerSerive.show();
    //console.log(this.localUserData['TokenId']);
    let tokenid = this.localUserData['TokenId'];
    // console.log(this.local.get('username')['TokenId']);
    // let tokenid = this.local.get('username')['TokenId']
    this._service.postService(link, {'tokenid': tokenid}).then((data: any) => {
      

      this.questionList = data.FeedbackQuestions;
      this.initializeFormArray();
      this.spinnerSerive.hide();
      // for(let i = 0; i < data.FeedbackQuestions.length; i++)
      // {
      //   let name = data.FeedbackQuestions[i].QuestionId;
      //   this.feedBackForm = new FormGroup({
      //     'formControl' : new FormControlName('')
      //   });
      // }
    })
  }

  initializeFormArray() {
    this.questionList.forEach((item) => {
      if (item.QuestionType === 'Yes-No') {
        /*this.radioGroup.push(
          item.QuestionId
        );*/
      } else if (item.QuestionType === 'Open-ended') {

      } else if (item.QuestionType === '5-Rating') {

      }
    })
   // console.log(this.radioGroup);
  }
  initializeStarArray() {
    this.starRateArray = [
      {
        value: false
      },
      {
        value: false
      },
      {
        value: false
      },
      {
        value: false
      },
      {
        value: false
      }
    ];
  }
  starRating(rating) {
    this.zone.run(() => {
      this.rating = rating;
     // console.log('Rating', this.rating);

      this.initializeStarArray();

      for (let i = this.rating; i >= 0; i--) {
        this.starRateArray[i].value = true;
      }
    });

  }

  onSubmit() {
    //console.log('this.inputArea.length', this.inputArea)
    //console.log('tthis.radioGroup.length', this.radioGroup.length)
    let checkNull = obj => obj === '';

    if ((this.inputArea.length === 9 && this.radioGroup.length === 5) && !this.inputArea.some(checkNull)) {
      let FeedbackAnswers = [];
     // console.log(this.radioGroup);
      this.inputArea.forEach((item, i) => {
        FeedbackAnswers.push({
          'QuestionID': i,
          'Answer': item
        });
      })
      this.radioGroup.forEach((item, i) => {
        FeedbackAnswers.push({
          'QuestionID': i,
          'Answer': item
        });
      })
      FeedbackAnswers.push({
        'QuestionID': 7,
        'Answer': this.rating + 1
      })
      let data = {
        // 'TokenID': this.local.get('username').TokenId,
        'TokenID': this.localUserData.TokenId,
        'FeedbackAnswers': FeedbackAnswers
      }
      // console.log('DATA', JSON.stringify(data));
      this.spinnerSerive.show();
      let link = Constant.SubmitFeedback;
      this._service.postService(link, data).then((data) => {
        //console.log('DATATAT', data);
        this.spinnerSerive.hide();

        if (data === 'Success') {

          $("#successMessage").modal({
            backdrop: 'static',
            keyboard: false
          });
        //  this._service.showSnackbar({ "status": 'We received your feedback!!' })
          // f.resetForm();
          //this.getQuestionList();
          //this.initializeStarArray();
        } else {
          this._service.showSnackbar({ "status": 'Error! Please try after some time' })
        }

      })
    } else {
      this._service.showSnackbar({ "status": 'Please fill all fields!' })
    }
  }

  gotoPage(){
    this.route.navigate(['/dashboard']);

  }
}
