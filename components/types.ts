export type ProductType = {
  title: string;
  price: string;
  image: string;
};
export interface SearchInterface {
  doSearch: (term: string) => void;
}

export interface ProductCardInterface {
  product: ProductType;
  addToCart(product: ProductType): void;
}
