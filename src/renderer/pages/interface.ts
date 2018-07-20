export interface IItem {
    description: string;
    unique: string;
    amount: number;
    taxable: boolean;
    before: string[];
    during: string[];
    after: string[];
}

export interface IPage {
    invoice: string;
    billTo: string;
    address: string;
    completionDate: string;
    invoiceDate: string;
    item: IItem[];
    tax: number;
}
