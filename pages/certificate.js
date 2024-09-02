// Certificate.js
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import airplane from '../public/airplane.jpg';
import logo from '../public/logo.png';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Certificate = () => {
  const [customerName, setCustomerName] = useState('');
  const [purchaseVolume, setPurchaseVolume] = useState('');
  const [SAF_Batch, setSAFBatch] = useState('');
  const [provider_entity, setAirline] = useState('');
  const [purchaseVolumeFuel, setPurchaseVolumeFuel] = useState('');
  const [purchase_date, setPurchaseDate] = useState('');
  const [valid_until, setValidUntil] = useState('');
  const [CO2e_reduction_WTW, setCO2eReductionWTW] = useState('');
  const [co2e_p_r_percent, setCo2ePRPercent] = useState('');
  const [co2e_p_r_value, setCo2ePRValue] = useState('');
  const [insertion_point, setInsertionPoint] = useState('');

  useEffect(() => {
    // Fetch data directly from the 'buy_and_sell' section in Firebase
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, 'buy_and_sell'));
        const data = snapshot.val();
        if (data) {
          const lastEntry = Object.values(data).pop(); // Adjust if needed based on how the data is structured
          console.log('Fetched data:', lastEntry); // Debug to check the structure

          // Set state with the fetched data
          setCustomerName(lastEntry.customer_name || '');
          setPurchaseVolume(lastEntry.purchaseVolume || '');
          setSAFBatch(lastEntry.SAF_Batch || '');
          setPurchaseDate(lastEntry.purchase_date || '');
          setValidUntil(lastEntry.valid_until || '');
          setCO2eReductionWTW(lastEntry.CO2e_reduction_WTW || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch related provider data based on SAF_Batch from the 'entry' section
    const fetchAirlineData = async () => {
      if (SAF_Batch) {
        try {
          const snapshot = await get(ref(database, 'entry'));
          const data = snapshot.val();
          if (data) {
            const matchingEntry = Object.values(data).find(
              (entry) => entry.batchNumber === SAF_Batch
            );
            if (matchingEntry) {
              console.log('Fetched provider data:', matchingEntry); // Debug to check provider data
              setAirline(matchingEntry.provider_entity || '');
              setPurchaseVolumeFuel(matchingEntry.purchaseVolumeFuel || '');
              setCo2ePRPercent(matchingEntry.co2e_p_r_percent || '');
              setCo2ePRValue(matchingEntry.co2e_p_r_value || '');
              setInsertionPoint(matchingEntry.insertion_point || '');
            }
          }
        } catch (error) {
          console.error('Error fetching provider data:', error);
        }
      }
    };

    fetchAirlineData();
  }, [SAF_Batch]);

    return (
      <div className="w-[210mm] h-[310mm] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white font-sans">
  {/* Logo Section */}
  <div className="flex justify-center items-center absolute inset-x-0 scale-50">
    <Image src={logo} alt="logo" layout="intrinsic" />
  </div>

  <div className="flex h-4/6 text-2xl flex-col justify-center items-center space-y-0 -mt-7.5">
    {/* Centered Heading */}
    <h1 className="text-center m-0">Declaration of Sustainable Aviation Fuel (SAF) Freight Service</h1>

    {/* Airplane Image in Separate Div */}
    <div className="flex scale-50 justify-center items-center -mt-1">
      <Image src={airplane} alt="airplane" layout="intrinsic" />
    </div>
    </div>

    {/* Customer Name and Details Section */}
    <div className="text-3xl flex flex-col justify-center items-center h-[10mm]">
      {/* Display customer name */}
      <div className="-mt-12">Customer name</div>
      <div>
        <p className="flex justify-center items-center text-xl mt-2">
          placeholder metric tons of CO<sub>2</sub>e<sup>*</sup> reduced
        </p>
        <p className="flex justify-center items-center text-xl mt-2">
          Declaration #: placeholder
        </p>
        <p className="flex justify-center items-center text-sm mt-2">
          Schenker AG hereby confirms that on behalf of Customer, a quantity of 100 tons of equivalent
          pure palm oil-free biofuel is inserted by Airline in Airport as part of Airline's
          {' '}certified fuel volume claim granted to Schenker AG.
        </p>
      </div>

    {/* Blue Boxes Section */}
    <div className="grid grid-cols-3 gap-2 relative mt-8" style={{ paddingTop: '20px' }}>
      <div className="bg-blue-500 p-4 text-white text-lg">
        Fuel Purchase
        <div className="text-sm">Amount of tons: placeholder</div>
        <div className="text-sm">Shipment period: placeholder to placeholder</div>
      </div>
      <div className="bg-blue-500 p-4 text-white text-lg">
        Tank-to-Wheel Emissions
        <div className="text-sm">Standard Fuel:</div>
        <div className="text-sm">SAF:</div>
        <div className="text-sm">Reduction:</div>
      </div>
      <div className="bg-blue-500 p-4 text-white text-lg">
        Well-to-Wheel Emissions
        <div className="text-sm">Standard Fuel: placeholder</div>
        <div className="text-sm">SAF: placeholder t of CO<sub>2</sub>e</div>
        <div className="text-sm">
          Reduction: placeholder t of CO<sub>2</sub>e / {co2e_p_r_percent}% of CO<sub>2</sub>e
        </div>
        </div>
    </div>

    {/* Green Boxes Section */}
    <div
      className="absolute bottom-0 right-0 grid grid-cols-2 gap-20"
      style={{ bottom: '30px', right: '20px', transform: 'translate(-20px, 10px)' }}
    >
      <div className="bg-white-500 p-8 text-black text-sm">
      <div className="mb-1">Bjeorn Eckbauer</div> {/* Optional spacing */}
    <div className="mb-1">SVP Global</div>     {/* Optional spacing */}
    <div className="mb-1">Operations & </div>
    <div className="mb-1">Procurement</div> {/* Optional spacing */}
    <div>Airfreight</div>
    </div>
      <div className="bg-white-500 p-8 text-black text-sm">
      <div className="mb-1">Hamad Nasar</div> {/* Optional spacing */}
    <div className="mb-1">Global Air Freight</div>     {/* Optional spacing */}
    <div className="mb-1">Sustainability </div>
    <div className="mb-1">Manager</div> {/* Optional spacing */}
    </div>
    </div>
  </div>
</div>


    );
    
};

export default Certificate;
