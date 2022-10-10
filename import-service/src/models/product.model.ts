export interface Product {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number,
  readonly weight: number,
  readonly img: string;
  readonly count: number;
}