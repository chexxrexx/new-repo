import { initializeApp } from 'firebase/app';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import firebaseConfig from '../firebaseConfig';
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { motion as m } from "framer-motion";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }; // Export the initialized database

function PODraftPage() {
  const router = useRouter();
  const { id } = router.query;  // Get the ID from query params
  const [formData, setFormData] = useState({});
  const [batchOptions, setBatchOptions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    // Fetch batch options when the component mounts
    const fetchBatches = async () => {
      try {
        const snapshot = await get(ref(database, 'entry'));
        const data = snapshot.val();
        if (data) {
          const batches = Object.values(data).map(entry => ({
            id: entry.batchNumber,
            ...entry
          }));
          setBatchOptions(batches);
        }
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    // Fetch and set formData when selectedBatch changes
    const fetchBatchData = async () => {
      if (selectedBatch) {
        try {
          const snapshot = await get(ref(database, 'entry'));
          const data = snapshot.val();
          const selectedEntry = Object.values(data).find(entry => entry.batchNumber === selectedBatch);
          if (selectedEntry) {
            setFormData(selectedEntry);
            formik.setValues(prevValues => ({
              ...prevValues,
              CO2e_reduction_WTW: selectedEntry.co2e_p_r || "",
              SAF_Efficiency: selectedEntry.co2e_p_r_percent || "",
              SAF_Batch: selectedEntry.batchNumber || ""
            }));
          }
        } catch (error) {
          console.error("Error fetching batch details:", error);
        }
      }
    };
    fetchBatchData();
  }, [selectedBatch]);

  const formik = useFormik({
    initialValues: {
      purchaseVolume: "",
      purchase_volume: "",
      purchase_cost: "",
      currency: "",
      purchase_date: "",
      SAF_Efficiency: formData.co2e_p_r_percent || "", // Default to the value in formData
      SAF_Batch: selectedBatch, // Default to selected batch
      CO2e_reduction_WTW: formData.co2e_p_r || "",
      customer_name: "",
      bill_to_party: "",
      valid_until: "", // Added valid_until
    },
    enableReinitialize: true, // Reinitialize form when formData is updated
    onSubmit: (values) => {
      // Form submission logic (if needed)
    },
  });

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const generatePDF = async () => {
    const page = document.body; // Capture the entire page

  // Capture the page content as a canvas
  const canvas = await html2canvas(page, {
    useCORS: true,
    scrollY: 0, // Ensures capturing from the top of the page
  });

  const imgData = canvas.toDataURL('image/png');

  // Create a new PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Calculate the dimensions
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  // Add the first page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add more pages if needed
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Automatically download the PDF
  pdf.save('PO_Draft.pdf');
};

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute w-full h-full flex items-center justify-center"
    >
      <main className="flex items-center justify-center w-full h-full">
        <form id="form-container" onSubmit={formik.handleSubmit}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg h-screen overflow-y-auto">


          {/* Dropdown for selecting batch number */}
          <div className = "flex items-center pb-4">
            <label className="block font-latoBold text-sm w-1/3">SAF Batch</label>
            <select
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              value={selectedBatch}
              onChange={handleBatchChange}
            >
              <option value="" label="-- Select --" />
              {batchOptions.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.id}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pb-4">
            {/* Purchase Volume metric tons */}
            <label className="block font-latoBold text-sm w-1/3">Purchase Volume</label>
            <input
              className="border-2 border-gray-500 p-2 rounded-md w-1/3 focus:border-teal-500 focus:ring-teal-500"
              type="text"
              name="purchaseVolume"
              placeholder="metric tons"
              value={formik.values.purchaseVolume}
              onChange={formik.handleChange}
            />
            {/* Purchase volume liters */}
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-1/3 focus:border-teal-500 focus:ring-teal-500"
              name="purchase_volume"
              placeholder="liters"
              value={formik.values.purchase_volume}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            {/* Purchase cost */}
            <label className="block font-latoBold text-sm w-1/3">Purchase Cost</label>
            <input
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              type="text"
              name="purchase_cost"
              value={formik.values.purchase_cost}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            {/* Currency */}
            <label className="block font-latoBold text-sm w-1/3">Currency</label>
            <select
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
            >
              <option value="" label="-- Select --" />
              <option> USD</option>
              <option> EUR</option>
            </select>
          </div>
          <div className = "flex items-center pb-4">
            {/* Purchase date */}
            <label className="block font-latoBold text-sm w-1/3">Purchase Date</label>
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="purchase_date"
              value={formik.values.purchase_date}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            <label className="block font-latoBold text-sm w-1/3">Customer Name</label>
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="customer_name"
              value={formik.values.customer_name}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            <label className="block font-latoBold text-sm w-1/3">Bill to Party</label>
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="bill_to_party"
              value={formik.values.bill_to_party}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            <label className="block font-latoBold text-sm w-1/3">SAF Efficiency</label>
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="SAF_Efficiency"
              value={formik.values.SAF_Efficiency}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            <label className="block font-latoBold text-sm w-1/3">CO2e Reduction WTW</label>
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="CO2e_reduction_WTW"
              value={formik.values.CO2e_reduction_WTW}
              onChange={formik.handleChange}
            />
          </div>
          <div className = "flex items-center pb-4">
            {/* Valid Until */}
            <label className="block font-latoBold text-sm w-1/3">Valid Until</label>
            <input
              type="text"
              className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
              name="valid_until"
              value={formik.values.valid_until}
              onChange={formik.handleChange}
            />
          </div>
          <button 
            onClick={() => {
              generatePDF();
              const ref1 = push(ref(database, 'buy_and_sell'));  // Create a new reference under 'buy_and_sell'
              set(ref1, formik.values)
                .then(() => {
                  console.log("Form submitted successfully!");
                })
                .catch((error) => {
                  console.error("Error saving data:", error);
                });
            }}
            className="bg-teal-500 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-teal-700 mt-6"
          >
            Generate PO Draft
          </button>
        </form>
      </main>
    </m.div>
  );
          }

export default PODraftPage;

