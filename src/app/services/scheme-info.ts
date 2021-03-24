export class SchemeInformation {
  public static schemeInfoArray = [
    {
      id: 1,
      schemeName: "Payment towards Life Insurance Policy",
      schemID: [25],
      description: [
        {
          desc_id: 1,
          desc: `Life Insurance Premium for self, spouse & children (child may be dependent/independent, male/female, minor/major or married/unmarried)`
        },
        {
          desc_id: 2,
          desc: `Premium deduction subject to a maximum of 20% of sum assured for policies taken on or before 31.03.2012/10% of sum assured for policies taken on or after 01.04.2012`
        }
      ]
    },
    {
      id: 2,
      schemeName: "Contribution to ULIP",
      schemID: [27],
      description: [
        {
          desc_id: 1,
          desc: `Amount contributed in the Unit Linked insurance plan also qualifies for deduction under this section.`
        },
        {
          desc_id: 2,
          desc: `Deduction is available for investment made for self, life of spouse or any child(child may be dependent/ independent,
                 male / female, minor / major or married / unmarried).`
        }
      ]
    },
    {
      id: 3,
      schemeName: "Contribution to Public Provident Fund",
      schemID: [28],
      description: [
        {
          desc_id: 1,
          desc: `Amount contributed towards 15 year public provident fund qualifies for deduction under this section.`
        },
        {
          desc_id: 2,
          desc: `Deduction is available for investment made for self, life of spouse or any child (child may be
                 dependent/independent).`
        },
        {
          desc_id: 3,
          desc: `In case payment is made by cheque, the date of encashment of cheque is
                 treated as the date of deposit.`
        }
      ]
    },
    {
      id: 5,
      schemeName: "National Savings Certificate",
      schemID: [29],
      description: [
        {
          desc_id: 1,
          desc: `Amount invested in National Saving Certificates qualifies for deduction`
        },
        {
          desc_id: 2,
          desc: `Deduction is eligible only if the NSC is taken in employee’s own name`
        }
      ]
    },
    {
      id: 6,
      schemeName: "Repayment of Housing Loan",
      schemID: [31],
      description: [
        {
          desc_id: 1,
          desc: `Repayment  during the financial year, of the Principal amount of loan qualifies for deduction `
        },
        {
          desc_id: 2,
          desc: `Registration and stamp duty charges paid towards purchase of House property also qualify for the deduction`
        },
        {
          desc_id: 3,
          desc: `Loan can be taken for purchase/construction of a new residential house property`
        },
        {
          desc_id: 4,
          desc: `Loan can be taken from financial institution/employer/others`
        },
        {
          desc_id: 5,
          desc: `Bank/Financial Institution Certificate required mentioning the breakup of Interest & Principal`
        }
      ]
    },
    {
      id: 7,
      schemeName: "Tuition Fee",
      schemID: [35, 36],
      description: [
        {
          desc_id: 1,
          desc: `Amount paid as Tuition fees qualifies for deduction`
        },
        {
          desc_id: 2,
          desc: `Deduction not available for payment made towards Development fees/donation/payment of similar nature`
        },
        {
          desc_id: 3,
          desc: `Amount can be paid the time of admission or otherwise `
        },
        {
          desc_id: 4,
          desc: `Payment should be made to any university/college/educational institution in India for full time education of any two children of the Individual`
        }
      ]
    },
    {
      id: 8,
      schemeName: "5 Years Fixed Deposits with Schedule Bank",
      schemID: [39],
      description: [
        {
          desc_id: 1,
          desc: `Tax-saving Fixed deposits (FDs) of scheduled banks with tenure of 5 years  or more are entitled for section 80C deduction`
        },
        {
          desc_id: 2,
          desc: `Deduction is eligible only if the Fixed Deposit is taken in his own name`
        }
      ]
    },
    {
      id: 9,
      schemeName: "5 Years Deposit under Post Office",
      schemID: [38],
      description: [
        {
          desc_id: 1,
          desc: `Tax-saving Fixed deposits (FDs) of Post Office with tenure of 5 years or more are entitled for section 80C deduction`
        },
        {
          desc_id: 2,
          desc: `Deduction is eligible only if the Fixed Deposit is taken in his own name`
        }
      ]
    },
    {
      id: 11,
      schemeName: "Contribution to certain Pension funds",
      schemID: [20],
      description: [
        {
          desc_id: 1,
          desc: `Deduction is available to an individual for any amount paid or deposited by him in any annuity plan of the Life Insurance Corporation of India or any other insurer for receiving pension from a fund referred to in Section 10(23AAB)`
        }
      ]
    },
    {
      id: 12,
      schemeName: "Contribution to pension scheme –NPS",
      schemID: [19],
      description: [
        {
          desc_id: 1,
          desc: `Additional deduction of Rs. 50,000/- towards contribution to National Pension Scheme is provided by section 80CCD (1B)`
        },
        {
          desc_id: 2,
          desc: `The said deduction is over and above Rs. 1, 50, 000/- U/s 80C, 80CCC & 80CCD (1)`
        },
        {
          desc_id: 3,
          desc: `The pension policy should be in the name of the employee`
        }
      ]
    },
    {
      id: 13,
      schemeName: "Income Tax computation of previous employment",
      schemID: [1],
      description: [
        {
          desc_id: 1,
          desc: `Employees who wish to show their Income earned from the previous employer can enter their amount.`
        },
        {
          desc_id: 2,
          desc: `Employee needs to provide the proof for the same for previous employer income (either pay slip or form 16).`
        }
      ]
    },
    {
      id: 14,
      schemeName: "Rent Paid – HRA Exemption",
      schemID: [2],
      description: [
        {
          desc_id: 1,
          desc: `Exemption is available based upon the location of rented property. Minimum of three is exempt:
          1)  Actual HRA Received per month
2) Rent paid over 10% of salary, i.e. Basic Salary
3) 50% of salary if rented property is in Metro (Delhi, Mumbai, Chennai & Kolkata) else for other cities 40%
`
        },
        {
          desc_id: 2,
          desc: `As per notification No. 30/2016, F.No. 142/29/2015-TPL,
                 it is now mandatory that the employees furnish the PAN Number of Landlord to the employer where the
                   aggregate rent paid during the year exceeds rupees 1 lakh.`
        },
        {
          desc_id: 3,
          desc: `Employee needs to provide us the “RENT Receipt” mentioning the tenure,
                 Landlord Name, Complete address of rented property along with PIN Code,
                 signature of landlord, affix revenue stamp on rent receipt.`
        }
      ]
    },
    {
      id: 15,
      schemeName: "Income/Loss from House Property",
      schemID: [6],
      description: [
        {
          desc_id: 1,
          desc: ` For the property from which employee is earning rental income (Let Out Property),
                employee has to enter the annual amount of rent received/receivable in “Final Lettable Val/Rent Amt”,
                Municipal taxes paid  (if paid), housing loan interest in “Interest Paid on Borrowing” &
                Possession date respectively in  “Wholly Let out Property” field.`
        },
        {
          desc_id: 2,
          desc: `For Self occupied house property, employee has to enter only housing loan
                 interest repayment made or to be made in “Interest Paid on borrowing” of “Self Occupied House Property” field`
        },
        {
          desc_id: 3,
          desc: `From F.Y. 2017-2018 loss under the head “Income from House Property”
                 is restricted to Rs. 2,00,000/-. (Even if you have multiple house property the limit will be Rs.
                  2 lakh only & the ceiling limit is not per house property)`
        },
        {
          desc_id: 4,
          desc: `In case of Pre EMI Interest paid by an employee before possession of house,
                 interest will be allowed in 5 equal instalments beginning from the year of possession`
        },
        {
          desc_id: 5,
          desc: `Bank/financial Institution Provisional Interest certificate would be required to claim this deduction`
        }
      ]
    },
    {
      id: 16,
      schemeName: "Other Income",
      schemID: [7],
      description: [
        {
          desc_id: 1,
          desc: `Employee, who wishes to declare his /her other income, can enter the amount in this field`
        },
        {
          desc_id: 2,
          desc: `Employee claiming TDS w.r.t. income from other sources will have to submit the TDS certificate
                 regarding the same without which the deduction will not be allowed`
        }
      ]
    },
    {
      id: 17,
      schemeName: "Interest accrued on NSC",
      schemID: [30],
      description: [
        {
          desc_id: 1,
          desc: `Accrued Interest (which is deemed as reinvested) qualifies for deduction except for the last year`
        }
      ]
    },
    {
      id: 18,
      schemeName: "Subscription to Notified Mutual Fund",
      schemID: [32],
      description: [
        {
          desc_id: 1,
          desc: `Subscription towards notified units of Tax Saving Mutual funds is eligible for deduction `
        },
        {
          desc_id: 2,
          desc: `Deduction is eligible only if the ELSS/Mutual Fund is taken in his own name`
        }
      ]
    },
    {
      id: 19,
      schemeName: "Sukanya Samriddhi Scheme",
      schemID: [37],
      description: [
        {
          desc_id: 1,
          desc: `Deposit can be made in the name of individual or any girl child of the individual or any girl child for whom such person is legal guardian`
        },
        {
          desc_id: 2,
          desc: `Maximum two minor girl children are eligible for deduction`
        }
      ]
    },
    {
      id: 20,
      schemeName: "Medical Insr Prem - (Non Senior Ctz) ",
      schemID: [8],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to employee who has,
                during the financial year actually paid any medical premium amount for self , spouse or his/ her children`
        },
        {
          desc_id: 2,
          desc: `The eligible amount of deduction is Rs. 25,000`
        },
        {
          desc_id: 3,
          desc: `Deduction is available in respect of an individual who is less than 60 years of age`
        }
      ]
    },
    {
      id: 21,
      schemeName: "Medical Insr Prem - (Senior Citizen)",
      schemID: [9],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to an employee who has, during the financial year actually incurred medical expenditure in respect of self and spouse`
        },
        {
          desc_id: 2,
          desc: `Deduction is available in respect of an individual/spouse whose age is equal or greater than 60 years of age`
        },
        {
          desc_id: 3,
          desc: `The eligible amount of deduction is Rs. 50,000`
        }
      ]
    },
    {
      id: 22,
      schemeName:
        "Medical Insr Premium (Payment on behalf of Parents non-senior Ctz",
      schemID: [10],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to employee who has,
                  during the financial year actually paid any medical premium amount
                   for his/ her parents `
        },
        {
          desc_id: 2,
          desc: `The eligible amount of deduction is Rs. 25,000`
        },
        {
          desc_id: 3,
          desc: `Age of the parents should be less than 60 years of age`
        }
      ]
    },
    {
      id: 23,
      schemeName:
        "Medical Insr Premium (Payment on behalf of Parents senior citizen)",
      schemID: [11],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to employee who has, during the financial year actually paid any medical premium amount for his/ her parents who are greater than 60 years of age`
        },
        {
          desc_id: 2,
          desc: `The eligible amount of deduction is Rs. 50,000`
        }
      ]
    },
    {
      id: 24,
      schemeName: "Preventive Health Checkup- Self",
      schemID: [12],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to an employee who has, during the FY paid any amount on preventive health check up for self/spouse/child`
        },
        {
          desc_id: 2,
          desc: `The eligible amount is Rs. 5,000`
        }
      ]
    },
    {
      id: 25,
      schemeName: "Preventive Health Checkup (Parents)",
      schemID: [13],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to an employee who has,
                during the FY paid any amount on preventive health check up for Parents`
        },
        {
          desc_id: 2,
          desc: `The eligible amount is Rs. 5,000`
        }
      ]
    },
    {
      id: 26,
      schemeName: "Deduction for Dependent with Disability",
      schemID: [16],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to the employee who has actually
                incurred any expenditure for the Medical Treatment  (including nursing, training and rehabilitation) of a dependant i.e. spouse, children, parents, brothers and sisters`
        },
        {
          desc_id: 2,
          desc: `Disability should be less than 80%`
        },

        {
          desc_id: 3,
          desc: `The eligible deduction will be Rs. 75,000`
        }
      ]
    },
    {
      id: 27,
      schemeName: "Deduction for Dependent with Severe Disability",
      schemID: [17],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to the employee who has actually
                  incurred any expenditure for the Medical Treatment  (including nursing,
                  training and rehabilitation) of a dependant i.e. spouse, children, parents, brothers and sisters`
        },
        {
          desc_id: 2,
          desc: `Disability should be greater than 80%`
        },
        {
          desc_id: 3,
          desc: `The eligible deduction will be Rs. 1,25,000`
        }
      ]
    },
    {
      id: 28,
      schemeName: "Medical Treatment of Senior Citizen",
      schemID: [21],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to the employee who has
                 actually paid any amount for the Medical treatment of prescribed disease or
                 ailment (as per Income Tax) during the financial year for himself or a dependant
                 i.e. spouse, children, parents, brothers and sisters`
        },
        {
          desc_id: 2,
          desc: `Age should be 60 years or more`
        },
        {
          desc_id: 3,
          desc: `The deduction available is Rs. 1,00,000`
        }
      ]
    },
    {
      id: 29,
      schemeName: "Medical Treatment For Non-senior Citizen",
      schemID: [22],
      description: [
        {
          desc_id: 1,
          desc: `Deduction under this section is available to the employee who has actually paid any amount for the Medical treatment of prescribed disease or ailment (as per Income Tax) during the financial year for himself or a dependant i.e. spouse, children, parents, brothers and sisters`
        },
        {
          desc_id: 2,
          desc: `Age should be less than 60 years`
        },
        {
          desc_id: 3,
          desc: `The deduction available is Rs. 40,000`
        }
      ]
    },
    {
      id: 30,
      schemeName: "Repayment of Interest on Loan for Higher Education",
      schemID: [18],
      description: [
        {
          desc_id: 1,
          desc: `Employee should take the loan from an approved financial or any charitable institution`
        },
        {
          desc_id: 2,
          desc: `Loan should be  for pursuing higher education either himself, spouse or his children`
        },
        {
          desc_id: 3,
          desc: `Deduction is available of the entire Interest paid during the financial year`
        },
        {
          desc_id: 4,
          desc: `“Higher education” means any course of study pursued after passing the Senior Secondary Examination or its equivalent from any school, board or university recognized by the Central Government or State Government or local authority or by any other authority authorized by the Central Government or State Government or Local authority`
        },
        {
          desc_id: 5,
          desc: `Employee needs to provide the Loan certificate mentioning the breakup of Principal and Interest amount of Loan`
        }
      ]
    },
    {
      id: 31,
      schemeName:
        "Deduction for Interest on Home Loan (First time Home buyer) (80EE)",
      schemID: [40],
      description: [
        {
          desc_id: 1,
          desc: `Additional deduction of Rs. 1,50,000/- is allowed on account of interest paid  on home loan `
        },
        {
          desc_id: 2,
          desc: `The said deduction is over and above the tax deduction of Rs. 2,00,000 under section 24`
        },
        {
          desc_id: 3,
          desc: `This deduction would be allowed only if the value of the property purchased is less than Rs. 45 Lakhs`
        },
        {
          desc_id: 4,
          desc: `Not eligible for benefit u/s 80EE if claimed u/s 80EEA`
        },
        {
          desc_id: 5,
          desc: `Value of loan taken should be less than Rs. 35 Lakhs`
        },
        {
          desc_id: 6,
          desc: `The Home Loan must be sanctioned during 1st April 2019 and 31st March 2021`
        },
        {
          desc_id: 7,
          desc: `As on the date of sanction of the loan the taxpayer should not own any other house property`
        },
        {
          desc_id: 8,
          desc: `The loan must be taken from a financial institution or Housing Finance Company`
        },
        {
          desc_id: 9,
          desc: `The said additional deduction of Rs. 1,50,000/-cannot be claimed under any other provisions of the Income tax Act,1961`
        },
        {
          desc_id: 10,
          desc: `For claiming the deduction under this section, employee needs to provide the home loan sanction letter from the bank or housing finance company along with Interest Certificate mentioning the Breakup of Principal & Interest Paid or to be paid`
        }
      ]
    },
    {
      id: 32,
      schemeName: "Interest From Savings Bank Account (Sec 80TTA)",
      schemID: [23],
      description: [
        {
          desc_id: 1,
          desc: `Deduction is available to the employee in respect of Interest received on deposits (not being time deposits) in a savings account held with Banks, Co- Operative banks and post office `
        },
        {
          desc_id: 1,
          desc: `The deduction is restricted to Rs. 10,000/- or actual interest whichever is lower`
        },
        {
          desc_id: 1,
          desc: `Employee needs to provide the Bank Passbook/Statement showing the Saving Interest amount`
        }
      ]
    },
    {
      id: 33,
      schemeName: "Interest on Deposits in case of Senior Citizen (Sec 80TTB)",
      schemID: [44],
      description: [
        {
          desc_id: 1,
          desc: `Deduction is available to the employee who is a senior citizen `
        },
        {
          desc_id: 2,
          desc: `Deduction is in respect of Interest received on deposits with Banks, Co- Operative banks and post office ( it may be interest on fixed deposits, interest on savings account or any other interest)`
        },
        {
          desc_id: 3,
          desc: `The deduction is restricted to Rs. 50,000/- or actual interest whichever is lower`
        },
        {
          desc_id: 4,
          desc: `Employee needs to provide the Bank Passbook/Statement showing the Saving Interest amount`
        }
      ]
    },
    {
      id: 34,
      schemeName: "Deduction for Self Non-Severe Disability",
      schemID: [14],
      description: [
        {
          desc_id: 1,
          desc: `Deduction is available if the individual is suffering from a disability which is not less than 40%`
        },
        {
          desc_id: 2,
          desc: `Fixed deduction of Rs. 75,000/- is available`
        },
        {
          desc_id: 3,
          desc: `The tax payer will have to furnish a copy of the certificate issued by the medical authority along with the return of income`
        }
      ]
    },
    {
      id: 35,
      schemeName: "Deduction for Self Severe Disability",
      schemID: [15],
      description: [
        {
          desc_id: 1,
          desc: `Deduction is available if the individual is suffering from a disability which is not less than 80%`
        },
        {
          desc_id: 2,
          desc: `Fixed deduction of Rs. 1,25,000/- is available`
        },
        {
          desc_id: 3,
          desc: `The tax payer will have to furnish a copy of the certificate issued by the medical authority along with the return of income`
        }
      ]
    }
  ];
}
