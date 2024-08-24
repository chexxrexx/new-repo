import { useRouter } from "next/router";
import { motion as m } from "framer-motion";
import { database } from '../firebaseConfig'; 
import { ref, onValue, update, remove} from 'firebase/database';
import Confetti from "react-confetti";
import { useState, useEffect } from "react";

export default function Success() {
  const router = useRouter();
  const [pieces, setPieces] = useState(200);
  const [data, setData] = useState({}); // Store the data as an object to preserve keys
  const [editingKey, setEditingKey] = useState(null); // Store the key of the entry being edited
  const [editedData, setEditedData] = useState({}); // State to store the edited data

  const stopConfetti = () => {
    setTimeout(() => {
      setPieces(0);
    }, 3000);
  };

  useEffect(() => {
    stopConfetti();

    // fetch data from Firebase
    const dataRef = ref(database, 'entry');
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setData(data || {});
    });
  }, []);

  const handleEditClick = (key) => {
    setEditingKey(key);
    setEditedData(data[key]);
  };

  const handleDeleteClick = (key) => {
    const entryRef = ref(database, `entry/${key}`);
    remove(entryRef);
  };

// -- handle saves by pressing enter key
  const handleSaveClick = () => {
    const entryRef = ref(database, `entry/${editingKey}`);
    update(entryRef, editedData).then(() => {
      setEditingKey(null);
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSaveClick();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [editingKey, editedData]);

//-- handle change of data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen items-center flex flex-col justify-center relative"
    >
       <button onClick={() => router.push('/pmodule')}>Back to Procurement Module</button> 
      <div className="w-full overflow-x-auto">
        <table className="bg-white table-auto border-collapse border border-gray-500 min-w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">Batch Number</th>
              <th className="border border-gray-400 px-4 py-2">Purchase Type</th>
              <th className="border border-gray-400 px-4 py-2">Network Exclusivity</th>
              <th className = "border border-gray-400 px-4 py-2">Purchase Volume</th>
              <th className="border border-gray-400 px-4 py-2">Volume Unit</th>
              <th className="border border-gray-400 px-4 py-2">Purchase Cost</th>
              <th className="border border-gray-400 px-4 py-2">Currency</th>
              <th className="border border-gray-400 px-4 py-2">Purchase Date</th>
              <th className="border border-gray-400 px-4 py-2">Insertion Point</th>
              <th className="border border-gray-400 px-4 py-2">Insertion Date</th>
              <th className="border border-gray-400 px-4 py-2">Purchase Reference</th>
              <th className="border border-gray-400 px-4 py-2">Provider Entity</th>
              <th className="border border-gray-400 px-4 py-2">Fuel Type</th>
              <th className="border border-gray-400 px-4 py-2">Energy Value</th>
              <th className="border border-gray-400 px-4 py-2">CO2e Proven Reduction</th>
              <th className="border border-gray-400 px-4 py-2">CO2e Proven Reduction Value</th>
              <th className="border border-gray-400 px-4 py-2">CO2e Proven Reduction Percentage</th>
              <th className="border border-gray-400 px-4 py-2">Certificate Number</th>
              <th className="border border-gray-400 px-4 py-2">Feedstock</th>
              <th className="border border-gray-400 px-4 py-2">Country Restricted</th>
              <th className="border border-gray-400 px-4 py-2">Country</th>
              <th className="border border-gray-400 px-4 py-2">Customer Restricted</th>
              <th className="border border-gray-400 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => (
              <tr key={key}>
                {editingKey === key ? (
                  <>
                    <td className="border border-gray-400 px-4 py-2"><input name="batchNumber" value={editedData.batchNumber} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="purchasetype" value={editedData.purchase_type} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="network_exclusivity" value={editedData.network_exclusivity} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="purchaseVolume" value={editedData.purchaseVolume} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="purchase_volume" value={editedData.purchase_volume} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="purchase_cost" value={editedData.purchase_cost} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="currency" value={editedData.currency} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="purchase_date" value={editedData.purchase_date} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="insertion_point" value={editedData.insertion_point} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="insertion_date" value={editedData.insertion_date} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="purchase_reference" value={editedData.purchase_reference} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="provider_entity" value={editedData.provider_entity} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="fuel_type" value={editedData.fuel_type} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="energy_value" value={editedData.energy_value} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="co2e_p_r" value={editedData.co2e_p_r} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="co2e_p_r" value={editedData.co2e_p_r_value} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="co2e_p_r" value={editedData.co2e_p_r_percent} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="ISCC_RSB_Certificate_Number" value={editedData.ISCC_RSB_Certificate_Number} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="feedstock" value={editedData.feedstock} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="country_restricted" value={editedData.country_restricted} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="country" value={editedData.country} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2"><input name="customer_restricted" value={editedData.customer_restricted} onChange={handleChange} /></td>
                    <td className="border border-gray-400 px-4 py-2">
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-400 px-4 py-2">{data[key].batchNumber}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].purchase_type}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].network_exclusivity}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].purchaseVolume}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].purchase_volume}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].purchase_cost}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].currency}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].purchase_date}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].insertion_point}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].insertion_date}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].purchase_reference}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].provider_entity}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].fuel_type}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].energy_value}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].co2e_p_r}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].co2e_p_r_value}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].co2e_p_r_percent}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].ISCC_RSB_Certificate_Number}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].feedstock}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].country_restricted}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].country}</td>
                    <td className="border border-gray-400 px-4 py-2">{data[key].customer_restricted}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      <button onClick={() => handleEditClick(key)} className="bg-blue-500 text-white px-4 py-2 mr-2">Edit</button>
                      <button onClick={() => handleDeleteClick(key)} className="bg-red-500 text-white px-4 py-2">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Confetti gravity={0.2} numberOfPieces={pieces} />
    </m.main>
  );
}


