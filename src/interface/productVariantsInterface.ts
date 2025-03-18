export enum WebsiteName {
    BLINKIT = 1,
    ZEPTO = 2,
    SWIGGY = 3
}

export enum Category {
    FRUITS = 2,
    VEGETABLES = 1
};


export type CategoryValue = typeof Category[keyof typeof Category];

export type WebsiteValue = typeof WebsiteName[keyof typeof WebsiteName];

export type ProductCategory = keyof typeof Category;

export type ScrapeWebsite = keyof typeof WebsiteName;

export interface Product {
    id: number;
    first_name: string;
    category_id: number;
    createdAt: string;
    updatedAt: string
}

export interface ProductVariant {
    id: number;
    website_id: WebsiteValue;
    product_id: number;
    category_id: CategoryValue;
    name: string;
    actual_price: number;
    discounted_price: number;
    quantity: string;
    out_of_stock: boolean;
    img_url: string;
    last_scraped: string;
    createdAt: string;
    updatedAt: string
}

export interface ProductWithVarinats extends Product {
    Variants: ProductVariant[]
}
