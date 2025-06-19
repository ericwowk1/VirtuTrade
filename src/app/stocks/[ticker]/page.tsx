'use client';
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";





//const response = await fetch(
//'/ap/stockApi'
//);

export default  function Ticker() {

   const pathname = usePathname();
  const ticker = pathname.split("/")[2];
  const [data, setData] = useState(null);



useEffect(() => {
  fetch(`/api/stockApi?ticker=${encodeURIComponent(ticker)}`)
     .then(res => res.json())
     .then(data => setData(data))
     .catch(err => console.error(err));
}, [ticker]);


   return (

   <h1 className="text-white">${ticker}</h1>
   )
 }