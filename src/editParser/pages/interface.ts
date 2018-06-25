export interface IEach {
    item?: number;
    description?: string;
    qty?: number;
    UM?: string;
    PPU?: number;
    cost?: number;
    comments?: string;
    image?: IPicture[];
}

export interface IPicture {
    name: string;
    src: string;
}

export interface IList {
    cate: string;
    each: IEach[];
}

export interface IParsed {
    name: string;
    address: string;
    city: string;
    year: string;
    stories: string;
    area: string;
    totalCost: string;
    bdate: string;
    list: IList[];
    totalImage: number;
    unused: {
        Exterior: IPicture[];
        Interior: IPicture[];
        Other: IPicture[];
    };
}

export type availableDivider = "_" | "+" | "-";
