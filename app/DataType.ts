export type CountryType = {
    id_negara: number
    kode_negara: string
    nama_negara: string
  }
  
export type HarborType = {
    id_negara: string
    id_pelabuhan: string
    nama_pelabuhan: string
  }
  
export type ProductType = {
    id_barang: number
    id_pelabuhan: number
    nama_barang: string
    description: string
    harga: number
    diskon: number
  }