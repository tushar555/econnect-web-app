import { Validators } from '@angular/forms';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
export interface PincodeArray {
  Pincode: any,
  City: any,
  Ismetro: boolean
}
export class FilterDetails {
  schemeId: number;
  http: any;
  formControlField = [{
    schemeId: [25],
    name: "LIC",
    fields: {
      NameOfAssured: ['', Validators.compose([Validators.required])],
      Relationship: ['', Validators.compose([Validators.required])],
      PaymentDate: [null],
      PolicyDate: [''],
      PolicyNo: ['', Validators.compose([Validators.required])],
      PolicyAmount: ['', Validators.compose([Validators.required])],
      Premium: ['', Validators.compose([Validators.required])],
      Remarks: ['']
    }
  },
  {
    schemeId: [27],
    name: "ULIP",
    field: {
      NameOfAssured: ['', Validators.compose([Validators.required])],
      Relationship: ['', Validators.compose([Validators.required])],
      PaymentDate: [null],
      PolicyNo: ['', Validators.compose([Validators.required])],
      PolicyAmount: ['', Validators.compose([Validators.required])],
      Premium: ['', Validators.compose([Validators.required])],
      Remarks: [''],
      PolicyDate: ['']
    },
  },
  {
    schemeId: [2],
    name: "HRA",
    field: {
      FromDate: [null, Validators.compose([Validators.required])],

      ToDate: [null, Validators.compose([Validators.required])],

      RentPerMonth: [null, Validators.compose([Validators.required])],

      LandLordName: ['', Validators.compose([Validators.required])],

      // LandLordPanNo: ['', Validators.compose([Validators.required, Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)])],
      LandLordPanNo: [''],

      LandLordPincode: [
        null,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]{6,6}$')])
      ],

      LandLordAddress: ['', Validators.compose([Validators.required])],

      // Validators.pattern('/[A-Z]{5}\d{4}[A-Z]{1}/i')

      Address: ['', Validators.compose([Validators.required])],

      Pincode: [
        null,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]{6,6}$')])
      ],

      City: [
        '',
        Validators.compose([Validators.required])
      ],

      HousingType: ['Rent'],

      IsMetroCity: [{
        value: '',
        disabled: true
      }, Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [28],
    name: "PPF Declaration",
    field: {
      // tslint:disable-next-line: max-line-length

      Relationship: ['', Validators.compose([Validators.required])],
      AccountHolderName: ['', Validators.compose([Validators.required])],

      PaymentDate: [null, Validators.compose([Validators.required])],

      PFAccountNo: [''],

      BankPostOfficeName: [''],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [29],
    name: "NSC Declaration",
    field: {
      AccountHolderName: [''],

      CertificateNo: ['', Validators.compose([Validators.required])],

      DateOfIssue: ['', Validators.compose([Validators.required])],

      Denomination: [''],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [35, 36],
    name: "Child Tuition Fee Declaration",
    field: {
      NameOfInstitution: ['', Validators.compose([Validators.required])],

      ChildName: ['', Validators.compose([Validators.required])],

      DateOfPayment: ['', Validators.compose([Validators.required])],

      ReceiptNo: ['', Validators.compose([Validators.required])],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [31],
    name: "Housing Loan Declaration",
    field: {
      LoanTakenDate: [null],

      NameOfLender: ['', Validators.compose([Validators.required])],

      RepaymentOfPrincipalAmount: [
        '',
        Validators.compose([Validators.required])
      ],

      StampDuty: [''],

      Total: [''],

      Remarks: ['']
    }
  },
  {
    schemeId: [20, 32],
    name: "Notified Mutual Fund Declaration",
    field: {
      DepositerName: [''],

      NameOfMutualFund: ['', Validators.compose([Validators.required])],

      DetailsOfPayment: [''],

      CertificateApplicationNo: [
        '',
        Validators.compose([Validators.required])
      ],

      ChequeNo: [''],

      DateOfPaymentBankDebit: [
        '',
        Validators.compose([Validators.required])
      ],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [37],
    name: "Sukanya Samiriddhi Scheme",
    field: {
      DepositerName: ['', Validators.compose([Validators.required])],

      DaughterName: ['', Validators.compose([Validators.required])],

      CertificateNo: ['', Validators.compose([Validators.required])],

      PaymentDate: [null, Validators.compose([Validators.required])],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [38],
    name: "Post Office Deposit Declaration",
    field: {
      InvestorName: ['', Validators.compose([Validators.required])],

      PostOfficeName: ['', Validators.compose([Validators.required])],

      FDRNo: ['', Validators.compose([Validators.required])],

      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      DateOfBankDebit: [null],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [39],
    name: "Scheduled Bank Fixed Deposit Declaration",
    field: {
      InvestorName: ['', Validators.compose([Validators.required])],

      BankName: ['', Validators.compose([Validators.required])],

      FDRNo: ['', Validators.compose([Validators.required])],

      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      DateOfBankDebit: [null],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [19],
    name: "Certain Pension Fund Declaration",
    field: {
      CompanyName: ['', Validators.compose([Validators.required])],

      EmployeeName: ['', Validators.compose([Validators.required])],

      PaymentDate: [null, Validators.compose([Validators.required])],

      PRANNo: ['', Validators.compose([Validators.required])],

      NPSAmount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [40],
    name: "Interest FirstTime Home Buyer Declaration",
    field: {
      SanctionDate: [null],

      PossessionDate: [null],
      ResiHomeValue: ['', Validators.max(4500000)],

      LoanSanctioned: ['', Validators.max(3500000)],
      InterestPaid: [
        '',
        Validators.compose([Validators.required, Validators.max(50000)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [12, 13],
    name: "Medical Eighty D Declaration",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],
      NameOfAssured: ['', Validators.compose([Validators.required])],
      CompanyName: [''],
      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      PolicyNo: [''],

      PolicyAmount: [null],

      Premium: [
        '',
        Validators.compose([Validators.required, Validators.max(5000)])
      ],

      Age: ['', Validators.compose([Validators.min(1)])],

      Remarks: ['']
    }
  },
  {
    schemeId: [8],
    name: "MedicalEightyDSelfNonSenior",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],
      NameOfAssured: ['', Validators.compose([Validators.required])],
      CompanyName: [''],
      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      PolicyNo: [''],

      PolicyAmount: [null],

      Premium: [
        '',
        Validators.compose([Validators.required, Validators.max(25000)])
      ],

      Age: [
        '',
        Validators.compose([Validators.max(59), Validators.min(1)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [9],
    name: "MedicalEightyDSelfSenior",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],
      NameOfAssured: ['', Validators.compose([Validators.required])],
      CompanyName: [''],
      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      PolicyNo: [''],

      PolicyAmount: [null],

      Premium: [
        '',
        Validators.compose([Validators.required, Validators.max(50000)])
      ],

      Age: ['', Validators.compose([Validators.min(60)])],

      Remarks: ['']
    }
  },
  {
    schemeId: [11],
    name: "MedicalEightyDParentSenior",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],
      NameOfAssured: ['', Validators.compose([Validators.required])],
      CompanyName: [''],
      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      PolicyNo: [''],

      PolicyAmount: [null],

      Premium: [
        '',
        Validators.compose([Validators.required, Validators.max(50000)])
      ],

      Age: ['', Validators.compose([Validators.min(60)])],

      Remarks: ['']
    }
  },
  {
    schemeId: [10],
    name: "MedicalEightyDParentNonSenior",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],
      NameOfAssured: ['', Validators.compose([Validators.required])],
      CompanyName: [''],
      PaymentDate: [null, Validators.compose([Validators.required])],

      ChequeNo: [''],

      PolicyNo: [''],

      PolicyAmount: [null],

      Premium: [
        '',
        Validators.compose([Validators.required, Validators.max(25000)])
      ],

      Age: [
        '',
        Validators.compose([Validators.max(59), Validators.min(1)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [1],
    name: "Taxable Income From Previous Employer'",
    field: {
      SalaryUS17: ['', Validators.compose([Validators.required])],

      ExemptionsUS10: [''],

      ProfessionalTax: [''],

      PF: [''],

      IncomeTaxDeducted: [''],

      MedicalExemption: [''],

      LTAExemptions: [''],

      LTACarriedForward: [''],

      LeaveEncashmentExmp: [''],

      GratuityExemption: [''],

      VRSExemption: [''],

      PerquisiteUS17: [''],

      SurchargeDeducted: [''],

      EduCessDeducted: [''],

      Remarks: ['']
    }
  },
  {
    schemeId: [7],
    name: "Income Other Sources  Declaration",
    field: {
      BusinessProfit: [''],

      LTNormal: [''],

      LTSpecial: [''],

      DividentIncome: [''],

      STGain: [''],

      OtherIncome: [''],

      TDSOnOtherIncome: [''],

      TotalInterestInc: [''],

      NCSInterest: [''],

      SAVBankInterest: [''],

      OtherInterest: [''],

      Remarks: ['']
    }
  },
  {
    schemeId: [16],
    name: "Dependent Disability  Declaration",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],

      DependentName: ['', Validators.compose([Validators.required])],

      HospitalName: ['', Validators.compose([Validators.required])],

      HandicapCertNo: ['', Validators.compose([Validators.required])],

      Amount: [
        '',
        Validators.compose([Validators.required, Validators.max(75000)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [17],
    name: "DependentSeverDisabilityformControlFields",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],

      DependentName: ['', Validators.compose([Validators.required])],

      HospitalName: ['', Validators.compose([Validators.required])],

      HandicapCertNo: ['', Validators.compose([Validators.required])],

      Amount: [
        '',
        Validators.compose([Validators.required, Validators.max(125000)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [21],
    name: "Medical Treatment Declaration senior",
    field: {
      Relation: ['', Validators.compose([Validators.required])],

      PatientName: ['', Validators.compose([Validators.required])],

      Age: [
        '',
        Validators.compose([Validators.required, Validators.min(1)])
      ],

      SufferingFrom: [''],

      ReceiptDate: ['', Validators.compose([Validators.required])],

      Amount: [
        '',
        Validators.compose([Validators.required, Validators.max(100000)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [22],
    name: "MedicalTreatmentNonSenior",
    field: {
      Relation: ['', Validators.compose([Validators.required])],

      PatientName: ['', Validators.compose([Validators.required])],

      Age: [
        '',
        Validators.compose([Validators.required, Validators.min(1)])
      ],

      SufferingFrom: [''],

      ReceiptDate: ['', Validators.compose([Validators.required])],

      Amount: [
        '',
        Validators.compose([Validators.required, Validators.max(40000)])
      ],

      Remarks: ['']
    }
  },
  {
    schemeId: [18],
    name: "Loan for higher education Declaration",
    field: {
      Relationship: ['', Validators.compose([Validators.required])],

      Name: ['', Validators.compose([Validators.required])],

      NameofLender: ['', Validators.compose([Validators.required])],

      Amount: ['', Validators.compose([Validators.required])],

      Remarks: ['']
    }
  },
  {
    schemeId: [6],
    name: "Income from House Property Declaration",
    field: {
      Type: ['', Validators.compose([Validators.required])],

      HouseCoOwner: [false],
      RentReceivedAnnually: [
        '',
        Validators.compose([Validators.required])
      ],

      MunicipalTaxes: [''],

      NetAnnualValue: [''],

      StatutoryDeduction: [''],
      AnnualLettableValueRentAmount: [''],
      InterestBorrowedCapital: [
        '',
        Validators.compose([Validators.required])
      ],

      PreEMIInterestValue: [''],

      NetIncomeHouseProperty: [''],

      LenderType: ['', Validators.compose([Validators.required])],

      LendersName: ['', Validators.compose([Validators.required])],
      LendersPAN: ['', Validators.compose([Validators.required])],
      LendersAddress: [''],
      PossessionDate: [''],

      Remarks: ['']
    }
  }
  ]

  constructor(schemeId, http) {
    this.schemeId = schemeId;
    this.http = http;
  }

  getSchemeDetails(callback) {
    this.http.get('assets/data/form-details.json').subscribe((data: any[])=>{

       const schemeDetails = data.slice();
        const scheme = schemeDetails.find((scheme) => {
          return scheme.schemeId.includes(this.schemeId);
        });
        callback(scheme || null);
      });
  }

  getFormControlFields() {
    const formFields = this.formControlField.find(f => {
      return f.schemeId.includes(this.schemeId);
    });
    return formFields || null;
  }
}

export class CommonArray {
  public static LICmodalHeader = 'LIC Declaration';
  public static LIC = [{
    id: 1,
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    id: 2,
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    id: 3,
    label: 'Premium Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    id: 8,
    label: 'Policy Date',
    name: 'PolicyDate',
    type: 'date',
    isRequired: true
  },
  {
    id: 4,
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isRequired: true
  },
  {
    id: 5,
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    id: 6,
    label: 'Premium paid',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    id: 7,
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static ULIP = [{
    id: 1,
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    id: 2,
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    id: 3,
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    id: 4,
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isRequired: true
  },
  {
    id: 5,
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    id: 6,
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    id: 7,
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static LICformControlFields = {
    NameOfAssured: ['', Validators.compose([Validators.required])],
    Relationship: ['', Validators.compose([Validators.required])],
    PaymentDate: [null, Validators.compose([Validators.required])],
    PolicyDate: ['', Validators.compose([Validators.required])],
    PolicyNo: ['', Validators.compose([Validators.required])],
    PolicyAmount: ['', Validators.compose([Validators.required])],
    Premium: ['', Validators.compose([Validators.required])],
    Remarks: ['']
  };

  public static ULIPformControlFields = {
    NameOfAssured: ['', Validators.compose([Validators.required])],
    Relationship: ['', Validators.compose([Validators.required])],
    PaymentDate: [null],
    PolicyNo: ['', Validators.compose([Validators.required])],
    PolicyAmount: ['', Validators.compose([Validators.required])],
    Premium: ['', Validators.compose([Validators.required])],
    Remarks: [''],
    PolicyDate: ['']
  };

  public static HRAmodalHeader = 'HRA Declaration';
  public static HRA = [{
    id: 1,
    label: 'From Date',
    name: 'FromDate',
    type: 'date',
    isRequired: true
  },
  {
    id: 2,
    label: 'To Date',
    name: 'ToDate',
    type: 'date',
    isRequired: true
  },
  {
    id: 3,
    label: 'Monthly Rent Amount',
    name: 'RentPerMonth',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    id: 4,
    label: 'Landlord Name',
    name: 'LandLordName',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    id: 5,
    label: 'LL PAN No',
    name: 'LandLordPanNo',
    type: 'text',
    isNumber: false,
    maxLength: 10,
    isRequired: false
  },
  {
    id: 6,
    label: 'Landlord Pincode',
    name: 'LandLordPincode',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: true
  },
  {
    id: 7,
    label: 'Landlord Address',
    name: 'LandLordAddress',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    id: 8,
    label: 'Rental Address',
    name: 'Address',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    id: 9,
    label: 'Rental Pincode',
    name: 'Pincode',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: true
  },
  {
    id: 10,
    label: 'Rental City',
    name: 'City',
    type: 'select',
    options: [{
      value: 'Mumbai',
      label: 'Mumbai'
    },
    {
      value: 'Delhi',
      label: 'Delhi'
    },
    {
      value: 'Kolkata',
      label: 'Kolkata'
    },
    {
      value: 'Chennai',
      label: 'Chennai'
    },
    {
      value: 'Other',
      label: 'Other'
    }
    ],
    isRequired: true
  },
  {
    id: 11,
    label: 'Housing Type',
    name: 'HousingType',
    type: 'select',
    isRequired: false,
    options: [{
      value: 'Rent',
      label: 'Rented Accom.'
    },
    {
      value: 'Company_lease_old',
      label: 'Company Leased(Old)'
    },
    {
      value: 'Company_owned_old',
      label: 'Company Owned(Old)'
    },
    {
      value: 'Own',
      label: 'Owned Accom(Old)'
    }
    ]
  },
  {
    id: 12,
    label: 'City Category',
    name: 'IsMetroCity',
    type: 'select',
    isRequired: true,
    options: [{
      value: true,
      label: 'Metro'
    },
    {
      value: false,
      label: 'Non Metro'
    }
    ]
  },
  {
    id: 12,
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static HRAformControlFields = {
    FromDate: [null, Validators.compose([Validators.required])],

    ToDate: [null, Validators.compose([Validators.required])],

    RentPerMonth: [null, Validators.compose([Validators.required])],

    LandLordName: ['', Validators.compose([Validators.required])],

    // LandLordPanNo: ['', Validators.compose([Validators.required, Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)])],
    LandLordPanNo: [''],

    LandLordPincode: [
      null,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]{6,6}$')])
    ],

    LandLordAddress: ['', Validators.compose([Validators.required])],

    // Validators.pattern('/[A-Z]{5}\d{4}[A-Z]{1}/i')

    Address: ['', Validators.compose([Validators.required])],

    Pincode: [
      null,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]{6,6}$')])
    ],

    City: [
      '',
      Validators.compose([Validators.required])
    ],

    HousingType: ['Rent'],

    IsMetroCity: [{
      value: '',
      disabled: true
    }, Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static PPFmodalHeader = 'PPF Declaration';
  public static PPF = [{
    id: 2,
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    id: 1,
    label: 'Account holder name ',
    name: 'AccountHolderName',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    id: 3,
    label: 'Payment Date ',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    id: 4,
    label: 'PF Account No ',
    name: 'PFAccountNo',
    type: 'text',
    isNumber: false,
    maxLength: 17,
    isRequired: false
  },
  {
    id: 5,
    label: 'Financial Intitution Type',
    name: 'BankPostOfficeName',
    type: 'select',
    isNumber: false,
    maxLength: 200,
    isRequired: false,
    editable: '',
    options: [{
      value: 'Bank',
      label: 'Bank'
    },
    {
      value: 'Post Office',
      label: 'PO'
    },
    {
      value: 'Registered Transfer Agent',
      label: 'RTA'
    }
    ]
  },
  {
    id: 6,
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    id: 7,
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static PPFformControlFields = {
    // tslint:disable-next-line: max-line-length

    Relationship: ['', Validators.compose([Validators.required])],
    AccountHolderName: ['', Validators.compose([Validators.required])],

    PaymentDate: [null, Validators.compose([Validators.required])],

    PFAccountNo: [''],

    BankPostOfficeName: [''],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static NSCmodalHeader = 'NSC Declaration';
  public static NSC = [{
    label: 'Account holder name',
    name: 'AccountHolderName',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Certificate No',
    name: 'CertificateNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Date Of Issue',
    name: 'DateOfIssue',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Denomination',
    name: 'Denomination',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static NSCformControlFields = {
    AccountHolderName: [''],

    CertificateNo: ['', Validators.compose([Validators.required])],

    DateOfIssue: ['', Validators.compose([Validators.required])],

    Denomination: [''],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static ChildTuitionFeemodalHeader =
    'Child Tuition Fee Declaration';
  public static ChildTuitionFee = [{
    label: 'Name Of Institution',
    name: 'NameOfInstitution',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Child Name',
    name: 'ChildName',
    type: 'select',

    isRequired: true,
    options: []
  },
  {
    label: 'Date Of Payment',
    name: 'DateOfPayment',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Receipt No',
    name: 'ReceiptNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static ChildTuitionFeeformControlFields = {
    NameOfInstitution: ['', Validators.compose([Validators.required])],

    ChildName: ['', Validators.compose([Validators.required])],

    DateOfPayment: ['', Validators.compose([Validators.required])],

    ReceiptNo: ['', Validators.compose([Validators.required])],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static HousingLoanmodalHeader = 'Housing Loan Declaration';
  public static HousingLoan = [{
    label: 'Possession date',
    name: 'LoanTakenDate',
    type: 'date',
    isRequired: false
  },
  {
    label: 'Name Of Lender',
    name: 'NameOfLender',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },

  {
    label: 'Repayment Of Principal Amount',
    name: 'RepaymentOfPrincipalAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Registration Fees/Stamp Duty',
    name: 'StampDuty',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Total',
    name: 'Total',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static HousingLoanformControlFields = {
    LoanTakenDate: [null],

    NameOfLender: ['', Validators.compose([Validators.required])],

    RepaymentOfPrincipalAmount: [
      '',
      Validators.compose([Validators.required])
    ],

    StampDuty: [''],

    Total: [''],

    Remarks: ['']
  };

  public static NotifiedMutualFundmodalHeader =
    'Mutual Fund Declaration';
  public static NotifiedMutualFund = [{
    label: 'Depositer Name',
    name: 'DepositerName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },
  {
    label: 'Name Of Mutual Fund',
    name: 'NameOfMutualFund',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Details Of Payment',
    name: 'DetailsOfPayment',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Certificate Application No',
    name: 'CertificateApplicationNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Date Of Payment/Debit date',
    name: 'DateOfPaymentBankDebit',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static NotifiedPensionFund = [{
    label: 'Depositer Name',
    name: 'DepositerName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },
  {
    label: 'Name Of Pension Fund',
    name: 'NameOfMutualFund',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Details Of Payment',
    name: 'DetailsOfPayment',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Certificate Application No',
    name: 'CertificateApplicationNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Date Of Payment/Debit date',
    name: 'DateOfPaymentBankDebit',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static NotifiedMutualFundformControlFields = {
    DepositerName: [''],

    NameOfMutualFund: ['', Validators.compose([Validators.required])],

    DetailsOfPayment: [''],

    CertificateApplicationNo: [
      '',
      Validators.compose([Validators.required])
    ],

    ChequeNo: [''],

    DateOfPaymentBankDebit: [
      '',
      Validators.compose([Validators.required])
    ],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static SukanyaSamriddhiSchememodalHeader =
    'Sukanya Samiriddhi Scheme';
  public static SukanyaSamriddhiScheme = [{
    label: 'Depositer Name',
    name: 'DepositerName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },
  {
    label: 'Daughter Name',
    name: 'DaughterName',
    type: 'select',

    isRequired: true,
    options: []
  },

  {
    label: 'Certificate No',
    name: 'CertificateNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static SukanyaSamriddhiSchemeformControlFields = {
    DepositerName: ['', Validators.compose([Validators.required])],

    DaughterName: ['', Validators.compose([Validators.required])],

    CertificateNo: ['', Validators.compose([Validators.required])],

    PaymentDate: [null, Validators.compose([Validators.required])],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static PostOfficeDepositmodalHeader =
    'Post Office Deposit Declaration';
  public static PostOfficeDeposit = [{
    label: 'Investor Name ',
    name: 'InvestorName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },
  {
    label: 'PostOffice Name',
    name: 'PostOfficeName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'FDR No',
    name: 'FDRNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Date Of Bank Debit',
    name: 'DateOfBankDebit',
    type: 'date',
    isRequired: false
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static PostOfficeDepositformControlFields = {
    InvestorName: ['', Validators.compose([Validators.required])],

    PostOfficeName: ['', Validators.compose([Validators.required])],

    FDRNo: ['', Validators.compose([Validators.required])],

    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    DateOfBankDebit: [null],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static ScheduledBankDepositmodalHeader =
    'Scheduled Bank Fixed Deposit Declaration';
  public static ScheduledBankDeposit = [{
    label: 'Investor Name ',
    name: 'InvestorName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },
  {
    label: 'Bank Name',
    name: 'BankName',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'FDR No',
    name: 'FDRNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Date Of Bank Debit',
    name: 'DateOfBankDebit',
    type: 'date',
    isRequired: false
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static ScheduledBankDepositformControlFields = {
    InvestorName: ['', Validators.compose([Validators.required])],

    BankName: ['', Validators.compose([Validators.required])],

    FDRNo: ['', Validators.compose([Validators.required])],

    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    DateOfBankDebit: [null],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static CertainPensionFundsmodalHeader =
    'Certain Pension Fund Declaration';
  public static CertainPensionFunds = [{
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Employee Name',
    name: 'EmployeeName',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'PRAN No',
    name: 'PRANNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'NPS Amount',
    name: 'NPSAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static CertainPensionFundsformControlFields = {
    CompanyName: ['', Validators.compose([Validators.required])],

    EmployeeName: ['', Validators.compose([Validators.required])],

    PaymentDate: [null, Validators.compose([Validators.required])],

    PRANNo: ['', Validators.compose([Validators.required])],

    NPSAmount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static InterestFirstTimeHomeBuyermodalHeader =
    'Interest FirstTime Home Buyer Declaration';
  public static InterestFirstTimeHomeBuyer = [{
    label: 'Sanction Date',
    name: 'SanctionDate',
    type: 'date',
    isRequired: false
  },
  {
    label: 'Possession Date',
    name: 'PossessionDate',
    type: 'date',
    isRequired: false
  },
  {
    label: 'Resi Home Value',
    name: 'ResiHomeValue',
    type: 'text',
    isNumber: true,
    maxValue: '45,00,000',
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Amount of loan sanctioned',
    name: 'LoanSanctioned',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: '35,00,000',
    isRequired: false
  },
  {
    label: 'Interest Paid',
    name: 'InterestPaid',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: '1,50,000',
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static InterestFirstTimeHomeBuyerformControlFields = {
    SanctionDate: [null],

    PossessionDate: [null],
    ResiHomeValue: ['', Validators.max(4500000)],

    LoanSanctioned: ['', Validators.max(3500000)],
    InterestPaid: [
      '',
      Validators.compose([Validators.required, Validators.max(150000)])
    ],

    Remarks: ['']
  };

  public static MedicalEightyDmodalHeader =
    'Medical Eighty D Declaration';
  public static MedicalEightyDSelf = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },

  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: 5000,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    minValue: 1,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];
  public static MedicalEightyDParents = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    }
    ]
  },
  {
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },

  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: 5000,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    minValue: 1,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalEightyDSelfNonSenior = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },

  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: '25,000',
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    maxValue: 60,
    minValue: 1,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalEightyDSelfSenior = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },

  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: 50000,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    minValue: 60,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalEightyDParentSenior = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    }
    ]
  },
  {
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },

  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: 50000,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    minValue: 60,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalEightyDParentNonSenior = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    }
    ]
  },
  {
    label: 'Name Of Assured',
    name: 'NameOfAssured',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Company Name',
    name: 'CompanyName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: false
  },

  {
    label: 'Payment Date',
    name: 'PaymentDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Cheque No',
    name: 'ChequeNo',
    type: 'text',
    isNumber: true,
    maxLength: 6,
    isRequired: false
  },
  {
    label: 'Policy No',
    name: 'PolicyNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Sum Assured',
    name: 'PolicyAmount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Premium Amount',
    name: 'Premium',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: 25000,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    maxValue: 60,
    minValue: 1,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalEightyDformControlFields = {
    Relationship: ['', Validators.compose([Validators.required])],
    NameOfAssured: ['', Validators.compose([Validators.required])],
    CompanyName: [''],
    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    PolicyNo: [''],

    PolicyAmount: [null],

    Premium: [
      '',
      Validators.compose([Validators.required, Validators.max(5000)])
    ],

    Age: ['', Validators.compose([Validators.min(1)])],

    Remarks: ['']
  };

  public static MedicalEightyDformControlFieldsNonSeniorSelf = {
    Relationship: ['', Validators.compose([Validators.required])],
    NameOfAssured: ['', Validators.compose([Validators.required])],
    CompanyName: [''],
    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    PolicyNo: [''],

    PolicyAmount: [null],

    Premium: [
      '',
      Validators.compose([Validators.required, Validators.max(25000)])
    ],

    Age: [
      '',
      Validators.compose([Validators.max(59), Validators.min(1)])
    ],

    Remarks: ['']
  };

  public static MedicalEightyDformControlFieldsSeniorSelf = {
    Relationship: ['', Validators.compose([Validators.required])],
    NameOfAssured: ['', Validators.compose([Validators.required])],
    CompanyName: [''],
    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    PolicyNo: [''],

    PolicyAmount: [null],

    Premium: [
      '',
      Validators.compose([Validators.required, Validators.max(50000)])
    ],

    Age: ['', Validators.compose([Validators.min(60)])],

    Remarks: ['']
  };

  public static MedicalEightyDformControlFieldsSeniorParent = {
    Relationship: ['', Validators.compose([Validators.required])],
    NameOfAssured: ['', Validators.compose([Validators.required])],
    CompanyName: [''],
    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    PolicyNo: [''],

    PolicyAmount: [null],

    Premium: [
      '',
      Validators.compose([Validators.required, Validators.max(50000)])
    ],

    Age: ['', Validators.compose([Validators.min(60)])],

    Remarks: ['']
  };

  public static MedicalEightyDformControlFieldsNonSeniorParent = {
    Relationship: ['', Validators.compose([Validators.required])],
    NameOfAssured: ['', Validators.compose([Validators.required])],
    CompanyName: [''],
    PaymentDate: [null, Validators.compose([Validators.required])],

    ChequeNo: [''],

    PolicyNo: [''],

    PolicyAmount: [null],

    Premium: [
      '',
      Validators.compose([Validators.required, Validators.max(25000)])
    ],

    Age: [
      '',
      Validators.compose([Validators.max(59), Validators.min(1)])
    ],

    Remarks: ['']
  };

  public static PreviousEmployermodalHeader =
    'Taxable Income From Previous Employer';
  public static PreviousEmployer = [{
    label: 'Salary US 17 (1)',
    name: 'SalaryUS17',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Exemptions US 10',
    name: 'ExemptionsUS10',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Professional Tax',
    name: 'ProfessionalTax',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'PF',
    name: 'PF',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Income Tax Deducted',
    name: 'IncomeTaxDeducted',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Medical Exemption',
    name: 'MedicalExemption',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'LTA Exemptions',
    name: 'LTAExemptions',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'LTA Carried Forward',
    name: 'LTACarriedForward',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Leave Encashment Exmp',
    name: 'LeaveEncashmentExmp',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Gratuity Exemption',
    name: 'GratuityExemption',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'VRS Exemption',
    name: 'VRSExemption',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Perquisite US 17 (2)',
    name: 'PerquisiteUS17',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Surcharge Deducted',
    name: 'SurchargeDeducted',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'EduCess Deducted',
    name: 'EduCessDeducted',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static PreviousEmployerformControlFields = {
    SalaryUS17: ['', Validators.compose([Validators.required])],

    ExemptionsUS10: [''],

    ProfessionalTax: [''],

    PF: [''],

    IncomeTaxDeducted: [''],

    MedicalExemption: [''],

    LTAExemptions: [''],

    LTACarriedForward: [''],

    LeaveEncashmentExmp: [''],

    GratuityExemption: [''],

    VRSExemption: [''],

    PerquisiteUS17: [''],

    SurchargeDeducted: [''],

    EduCessDeducted: [''],

    Remarks: ['']
  };

  public static IncomeOtherSourcesmodalHeader =
    'Income Other Sources  Declaration';
  public static IncomeOtherSources = [{
    label: 'Business Profit ',
    name: 'BusinessProfit',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Long Term Normal',
    name: 'LTNormal',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Long Term Special',
    name: 'LTSpecial',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Divident Income',
    name: 'DividentIncome',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Short Term Gain',
    name: 'STGain',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Other Income',
    name: 'OtherIncome',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'TDS On Other Income',
    name: 'TDSOnOtherIncome',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Total Interest Inc',
    name: 'TotalInterestInc',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'NCS Interest',
    name: 'NCSInterest',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Saving Bank Interest',
    name: 'SAVBankInterest',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Other Interest',
    name: 'OtherInterest',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static IncomeOtherSourcesformControlFields = {
    BusinessProfit: [''],

    LTNormal: [''],

    LTSpecial: [''],

    DividentIncome: [''],

    STGain: [''],

    OtherIncome: [''],

    TDSOnOtherIncome: [''],

    TotalInterestInc: [''],

    NCSInterest: [''],

    SAVBankInterest: [''],

    OtherInterest: [''],

    Remarks: ['']
  };

  public static DependentDisabilitymodalHeader =
    'Dependent Disability  Declaration';
  public static DependentDisability = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    },
    {
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    },
    {
      value: 'brother',
      label: 'Brother'
    },
    {
      value: 'sister',
      label: 'Sister'
    }
    ]
  },
  {
    label: 'Dependent Name ',
    name: 'DependentName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },

  {
    label: 'Hospital Name',
    name: 'HospitalName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: false,
    isRequired: true
  },
  {
    label: 'Handicap Certificate No',
    name: 'HandicapCertNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: '75,000',
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static DependentSeverDisability = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    },
    {
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    },
    {
      value: 'brother',
      label: 'Brother'
    },
    {
      value: 'sister',
      label: 'Sister'
    }
    ]
  },
  {
    label: 'Dependent Name ',
    name: 'DependentName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },

  {
    label: 'Hospital Name',
    name: 'HospitalName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: false,
    isRequired: true
  },
  {
    label: 'Handicap Certificate No',
    name: 'HandicapCertNo',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    maxValue: '1,25,000',
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static DependentDisabilityformControlFields = {
    Relationship: ['', Validators.compose([Validators.required])],

    DependentName: ['', Validators.compose([Validators.required])],

    HospitalName: ['', Validators.compose([Validators.required])],

    HandicapCertNo: ['', Validators.compose([Validators.required])],

    Amount: [
      '',
      Validators.compose([Validators.required, Validators.max(75000)])
    ],

    Remarks: ['']
  };

  public static DependentSeverDisabilityformControlFields = {
    Relationship: ['', Validators.compose([Validators.required])],

    DependentName: ['', Validators.compose([Validators.required])],

    HospitalName: ['', Validators.compose([Validators.required])],

    HandicapCertNo: ['', Validators.compose([Validators.required])],

    Amount: [
      '',
      Validators.compose([Validators.required, Validators.max(125000)])
    ],

    Remarks: ['']
  };

  public static MedicalTreatmentmodalHeader =
    'Medical Treatment Declaration';
  public static MedicalTreatmentSenior = [{
    label: 'Relation',
    name: 'Relation',
    isRequired: true,
    type: 'select',
    options: [{
      value: 'self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    },
    {
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    },
    {
      value: 'brother',
      label: 'Brother'
    },
    {
      value: 'sister',
      label: 'Sister'
    }
    ]
  },
  {
    label: 'Patient Name',
    name: 'PatientName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    minValue: 1,
    isRequired: true
  },

  {
    label: 'Suffering From',
    name: 'SufferingFrom',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Receipt Date',
    name: 'ReceiptDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true,
    maxValue: '1,00,000'
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalTreatmentformControlFieldsSenior = {
    Relation: ['', Validators.compose([Validators.required])],

    PatientName: ['', Validators.compose([Validators.required])],

    Age: [
      '',
      Validators.compose([Validators.required, Validators.min(1)])
    ],

    SufferingFrom: [''],

    ReceiptDate: ['', Validators.compose([Validators.required])],

    Amount: [
      '',
      Validators.compose([Validators.required, Validators.max(100000)])
    ],

    Remarks: ['']
  };

  public static MedicalTreatmentNonSenior = [{
    label: 'Relation',
    name: 'Relation',
    isRequired: true,
    type: 'select',
    options: [{
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    },
    {
      value: 'mother',
      label: 'Mother'
    },
    {
      value: 'father',
      label: 'Father'
    },
    {
      value: 'brother',
      label: 'Brother'
    },
    {
      value: 'sister',
      label: 'Sister'
    }
    ]
  },
  {
    label: 'Patient Name',
    name: 'PatientName',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },
  {
    label: 'Age',
    name: 'Age',
    type: 'text',
    isNumber: true,
    maxLength: 3,
    minValue: 1,
    isRequired: true
  },

  {
    label: 'Suffering From',
    name: 'SufferingFrom',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  },
  {
    label: 'Receipt Date',
    name: 'ReceiptDate',
    type: 'date',
    isRequired: true
  },
  {
    label: 'Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true,
    maxValue: '40,000'
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static MedicalTreatmentformControlFieldsNonSenior = {
    Relation: ['', Validators.compose([Validators.required])],

    PatientName: ['', Validators.compose([Validators.required])],

    Age: [
      '',
      Validators.compose([Validators.required, Validators.min(1)])
    ],

    SufferingFrom: [''],

    ReceiptDate: ['', Validators.compose([Validators.required])],

    Amount: [
      '',
      Validators.compose([Validators.required, Validators.max(40000)])
    ],

    Remarks: ['']
  };

  public static LoanHigherEducationmodalHeader =
    'Loan for higher education Declaration';
  public static LoanHigherEducation = [{
    label: 'Relationship',
    name: 'Relationship',
    isRequired: true,
    type: 'select',
    editable: '',
    options: [{
      value: 'Self',
      label: 'Self'
    },
    {
      value: 'child',
      label: 'Child'
    },
    {
      value: 'spouse',
      label: 'Spouse'
    }
    ]
  },
  {
    label: 'Name',
    name: 'Name',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    onlyChar: true,
    isRequired: true
  },
  {
    label: 'Name of Lender',
    name: 'NameofLender',
    type: 'text',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Interest Amount',
    name: 'Amount',
    type: 'text',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static LoanHigherEducationformControlFields = {
    Relationship: ['', Validators.compose([Validators.required])],

    Name: ['', Validators.compose([Validators.required])],

    NameofLender: ['', Validators.compose([Validators.required])],

    Amount: ['', Validators.compose([Validators.required])],

    Remarks: ['']
  };

  public static IncomeHousePropertymodalHeader =
    'Income from House Property Declaration';
  public static IncomeHouseProperty = [{
    label: 'Type',
    name: 'Type',
    type: 'select',
    editable: '',
    options: [{
      value: 'self_property',
      label: 'Self Occupied Property'
    },
    {
      value: 'letout_property',
      label: 'Let Out Property'
    }
    ],
    isRequired: true
  },
  {
    label: 'House Co-Owner',
    name: 'HouseCoOwner',
    title: 'Is House Co-Owner Present?',
    editable: '',
    isRequired: false,
    type: 'select',
    options: [{
      value: true,
      label: 'Yes'
    },
    {
      value: false,
      label: 'No'
    }
    ]
  },
  {
    label: 'Rent Received Annually',
    name: 'RentReceivedAnnually',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },

  {
    label: 'Municipal Taxes',
    name: 'MunicipalTaxes',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Net Annual Value',
    name: 'NetAnnualValue',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Statutory Deduction',
    name: 'StatutoryDeduction',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Annual Lettable Value Rent Amount',
    name: 'AnnualLettableValueRentAmount',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Interest paid on Borrowing',
    name: 'InterestBorrowedCapital',
    type: 'text',
    editable: '',
    isNumber: true,
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Pre EMI Interest Value',
    name: 'PreEMIInterestValue',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Net Income House Property',
    name: 'NetIncomeHouseProperty',
    type: 'text',
    editable: 'self_property',
    isNumber: true,
    maxLength: 10,
    isRequired: false
  },
  {
    label: 'Lender Type',
    name: 'LenderType',
    type: 'select',
    editable: '',
    options: [{
      value: 'FinancialInstitution',
      label: 'Financial Institution'
    },
    {
      value: 'Employer',
      label: 'Employer'
    },
    {
      value: 'Others ',
      label: 'Others'
    }
    ],
    isRequired: true
  },
  {
    label: 'Lender\'s Name',
    name: 'LendersName',
    type: 'text',
    editable: '',
    isNumber: false,
    onlyChar: true,
    maxLength: 200,
    isRequired: true
  },
  {
    label: 'Lender\'s PAN',
    name: 'LendersPAN',
    type: 'text',
    editable: '',
    maxLength: 10,
    isRequired: true
  },
  {
    label: 'Lender\'s Address',
    name: 'LendersAddress',
    type: 'text',
    editable: '',
    isRequired: false
  },
  {
    label: 'Possession Date',
    name: 'PossessionDate',
    type: 'date',
    editable: '',
    isRequired: true
  },

  {
    label: 'Remarks',
    name: 'Remarks',
    type: 'text',
    editable: '',
    isNumber: false,
    maxLength: 200,
    isRequired: false
  }
  ];

  public static IncomeHousePropertyformControlFields = {
    Type: ['', Validators.compose([Validators.required])],

    HouseCoOwner: [false],
    RentReceivedAnnually: [
      '',
      Validators.compose([Validators.required])
    ],

    MunicipalTaxes: [''],

    NetAnnualValue: [''],

    StatutoryDeduction: [''],
    AnnualLettableValueRentAmount: [''],
    InterestBorrowedCapital: [
      '',
      Validators.compose([Validators.required])
    ],

    PreEMIInterestValue: [''],

    NetIncomeHouseProperty: [''],

    LenderType: ['', Validators.compose([Validators.required])],

    LendersName: ['', Validators.compose([Validators.required])],
    LendersPAN: ['', Validators.compose([Validators.required])],
    LendersAddress: [''],
    PossessionDate: [''],

    Remarks: ['']
  };



}
