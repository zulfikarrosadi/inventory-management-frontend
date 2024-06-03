import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { AxiosResponse } from 'axios';
import AddWarehouseForm from '../components/AddWarehouseForm';
import { ApiResponse, ApiResponseGeneric } from '../schema';
import { Link } from 'react-router-dom';
import { Stock } from './Stocks';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from '../utils/formatter';
import { getTotalSpent } from '../utils/totalSpent';

export type Warehouse = {
  id: number;
  name: string;
  address: string;
};

type AllStocks = {
  warehouses: {
    id: number;
    name: string;
    address: string;
    stocks: Stock[];
  }[];
};

function Warehouse() {
  const [responseError, setResponseError] = useState<ApiResponse>();
  const [response, setResponse] =
    useState<ApiResponseGeneric<{ warehouse: Warehouse[] }>>();
  const [showAddWarehouseForm, setShowAddWarehouseForm] = useState(false);
  const axios = useAxios();
  const [allStocks, setAllStocks] = useState<AllStocks>();

  async function getWarehouses() {
    try {
      const { data: res } = await axios.get<
        {},
        AxiosResponse<ApiResponseGeneric<{ warehouse: Warehouse[] }>>
      >('/warehouses');
      setResponse(res);
    } catch (error: any) {
      setResponseError(error.response.data);
    }
  }

  async function getStocksAccrossWarehouses() {
    try {
      const { data: res } = await axios.get('/warehouses/stocks');
      setAllStocks(res.data);
    } catch (error: any) {
      console.log('get_stocks_accross_warehouses', error);
      setResponseError(error);
    }
  }

  function generateReport() {
    const doc = new jsPDF();
    let finalY = 10;

    allStocks.warehouses.forEach((warehouse) => {
      const totalSpent = formatCurrency(getTotalSpent(warehouse.stocks));
      doc.setFontSize(16);
      doc.text(`Warehouse: ${warehouse.name}`, 14, finalY);
      doc.text(
        `Total spent in ${warehouse.name} is ${totalSpent}`,
        14,
        (finalY += 10),
      );
      finalY += 10;

      const tableColumn = [
        'ID',
        'Name',
        'Supplier',
        'Purchase Date',
        'Stock Due Date',
        'Quantity',
        'Cost Price',
        'Amount',
      ];
      const tableRows = [];

      warehouse.stocks.forEach((stock) => {
        const stockData = [
          stock.id,
          stock.name,
          stock.supplier,
          formatDate(stock.purchase_date),
          formatDate(stock.stock_due_date),
          stock.quantity,
          formatCurrency(stock.cost_price),
          formatCurrency(stock.cost_price * stock.quantity),
        ];
        tableRows.push(stockData);
      });

      // Create the table for the current warehouse
      doc.autoTable({
        startY: finalY,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 10 },
        margin: { top: 10 },
      });

      // Update finalY position for the next table
      finalY = doc.lastAutoTable.finalY + 20;
    });

    // Save the PDF
    doc.save('warehouses.pdf');
  }

  useEffect(() => {
    console.log(allStocks);
  }, [allStocks]);

  useEffect(() => {
    getWarehouses();
  }, []);
  useEffect(() => {
    setResponseError(undefined);
  }, [response]);

  return (
    <section className="flex flex-col gap-4">
      <div className="mt-5 space-y-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Your Warehouses</h1>
          <div className="flex gap-2">
            <button
              className="bg-gray-400 p-2 text-white rounded-md w-fit"
              onClick={() => setShowAddWarehouseForm(true)}
            >
              Add Warehouses
            </button>
            {response?.data.warehouse.length && (
              <button
                onClick={() => {
                  getStocksAccrossWarehouses();
                  generateReport();
                }}
                className="bg-gray-500 p-2 text-white rounded-md w-fit"
              >
                Generate Report Accross Warehouses
              </button>
            )}
          </div>
          {showAddWarehouseForm && (
            <AddWarehouseForm
              showForm={setShowAddWarehouseForm}
              setWarehouses={setResponse}
            />
          )}
        </div>
        {responseError?.errors?.message && (
          <p className="text-sm text-red-500">{responseError.errors.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {response &&
          response.data &&
          response.data.warehouse.map((warehouse: Warehouse) => {
            return (
              <div
                key={warehouse.id}
                className="border border-1 border-gray-300 rounded-lg p-4 space-y-2 w-full md:w-1/3"
              >
                <div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Warehouse name</p>
                      <Link to={`${warehouse.id}/stocks`} className="underline">
                        {warehouse.name}
                      </Link>
                    </div>
                    <span className="text-sm rounded-lg bg-slate-300 h-fit p-2 hover:cursor-pointer">
                      See Stocks
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">
                    Warehouse address
                  </span>
                  <p>{warehouse.address}</p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default Warehouse;
