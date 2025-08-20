import request from '../axios'

export interface Product {
  id: number
  name: string
  price: number
}

export const ProductService = {
  getProducts: (): Promise<Product[]> =>
    request({ url: 'products', method: 'GET' }),
    
  updateProduct: (id: number, data: Partial<Product>): Promise<Product> =>
    request({ 
      url: `products/${id}`, 
      method: 'PUT',
      data 
    }),
}