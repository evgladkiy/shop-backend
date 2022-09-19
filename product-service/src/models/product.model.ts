import { ProductMetadata } from './productMetadata.model';
import { ProductStock } from './productStock.model';

export interface Product extends ProductMetadata, ProductStock {}