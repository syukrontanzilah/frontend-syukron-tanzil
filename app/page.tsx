"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CountryType, HarborType, ProductType } from "./DataType";
import { NumberFormatBase, NumericFormat } from "react-number-format";
import { IoCart } from "react-icons/io5";


export default function Home() {
  const [listCountry, setListCountry] = useState<CountryType[]>([])
  const [countryName, setCountryName] = useState("");
  const [countryId, setCountryId] = useState(0)
  const [countryCode, setCountryCode] = useState("")

  const [listHarbor, setListHarbor] = useState<HarborType[]>([])
  const [harbourName, setHarbourName] = useState("");
  const [harbourId, setHarbourId] = useState("");

  const [listProduct, setListProduct] = useState<ProductType[]>([])
  const [productName, setProductName] = useState("")
  const [productId, setProductId] = useState(0);
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [showDesc, setShowDesc] = useState(false);

  const URLNegara = `http://202.157.176.100:3000/negaras`
  const URLPelabuhan = `http://202.157.176.100:3000/pelabuhans`
  const URLBarang = `http://202.157.176.100:3000/barangs`

  // get negara
  const getNegara = async () => {
    try{
      await axios.get(URLNegara)
      .then((data)=> {
        const datanya = data.data
        setListCountry(datanya)
      })
    }catch(error){
      console.log(error)
    }
  }

  // get pelabuhan
  const filter = JSON.stringify({where:{id_negara: countryId}});
  const getPelabuhan = async () => {
    try{
      await axios.get(`${URLPelabuhan}?filter=${encodeURIComponent(filter)}`)
      .then((data)=> {
        const datanya = data.data
        setListHarbor(datanya)
      })
    } catch(error){
      console.log(error)
    }
  }

  // get barang
  const filterBarang = JSON.stringify({ where:{id_pelabuhan: harbourId}});
  const getProduct = async () => {
    setLoadingProduct(true)
    try{
      await axios.get(`${URLBarang}?filter=${encodeURIComponent(filterBarang)}`)
      .then((data)=> {
        console.log("barang", data.data)
        const datanya = data.data
        if(
          harbourId !== null || 
          harbourId !== "" || 
          harbourId !== undefined 
        ){
          setListProduct(datanya)
          setLoadingProduct(false)
        }
      })
    }catch(error){
      console.log(error)
      setLoadingProduct(false)
    }
  }

  useEffect(()=>{
    getNegara()
    getPelabuhan()
    getProduct()
  },[
    countryId, 
    harbourId, 
    productId,
    showDesc
  ])

  return (
    <main className="bg-slate-200 min-h-[100vh]">
    <div className="w-full xl:w-[480px] bg-white mx-auto min-h-[100vh] p-6">
    <form>
    <h5>Negara</h5>
      <select 
        value={countryName}
        onChange={(e)=> {
          setCountryName(e.target.value);
          var name = listCountry.filter(function(element){
            return element.nama_negara === e.target.value;
          })[0];
          setCountryId(name.id_negara)
          // console.log('id negara', countryId)
          setShowDesc(false)
        }}
      >
        <option value={""} disabled>Pilih Negara..</option>
        {
        listCountry.map((item,i)=> {
          return(
            <option key={i} value={item.nama_negara}>{item.kode_negara} - {item.nama_negara}</option>
          )
        })
      }
      </select>

      <h5>Pelabuhan</h5>
      <select 
      value={harbourName}
      onChange={(e)=> {
        setHarbourName(e.target.value);
        var name = listHarbor.filter(function(element){
          return element.nama_pelabuhan === e.target.value;
        })[0]
        setHarbourId(name.id_pelabuhan)
        console.log('id pelabuhan', harbourId)
        // setShowDesc(false)
      }}
      >
      <option value={""} disabled>Pilih Pelabuhan..</option>
        {
          listHarbor.map((item,i)=> {
            return(
              <option key={i} value={item.nama_pelabuhan}>{item.nama_pelabuhan}</option> 
            )
          })
        }
      </select>

      <h5>Barang</h5>
      <select 
      value={productName}
      onChange={(e)=> {
        setProductName(e.target.value);
        var name = listProduct.filter(function(element){
          return element.nama_barang === e.target.value;
        })[0]
        setProductId(name.id_barang);
        console.log('id barang', productId)
      }}
      >
      <option value={""} disabled>Pilih barang..</option>
        {
          listProduct.map((item,i)=> {
            return(
              <option key={i} value={item.nama_barang}> 
              {item.nama_barang} 
              </option> 
            )
          })
        }
      </select>

      {
        // loadingProduct ?
        // <div>Loading... </div> :
        productId ?
        listProduct.map((item,i)=> {
          return(
            <div className="">
              <div>
                <h5>Description</h5>
                <div className="description">
                <IoCart size={24} className="mr-2" />
                  {item.description}
                </div>                
              </div>

        <div className="list">
          <h5 className="discount">Discount ({item.diskon}%)</h5>
            <div>
              <NumericFormat
                disabled
                className="price discount"
                value={item.diskon/100 * item.harga}
                thousandSeparator
                fixedDecimalScale
                prefix="Rp."
                />
                </div> 
            </div>
         
          <div className="list">
          <h5>Harga</h5>
              <div>
                <NumericFormat
                  disabled
                  className="price"
                  value={item.harga}
                  thousandSeparator
                  fixedDecimalScale
                  prefix="Rp."
                  />
              </div>
          </div>

          <div className="list total-harga">
          <h5 className="">Total Harga</h5>
                <div>
                  <NumericFormat
                    disabled
                    className="price"
                    value={item.harga - item.diskon/100 * item.harga}
                    thousandSeparator
                    // fixedDecimalScale
                    prefix="Rp."
                    />
                </div>
          </div>
        </div>
          )
        })
        : null
      }
    </form>
    </div>      
    </main>

  );
}
