import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { ApiResponseError } from '../schema';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable';
import AddStockForm from '../components/AddStocksForm';
import { Warehouse } from './Warehouse';
import UpdateStockForm from '../components/UpdateStockForm';
import { formatCurrency, formatDate } from '../utils/formatter';
import { getTotalSpent } from '../utils/totalSpent';

export type Stock = {
  id: number;
  name: string;
  supplier: string;
  quantity: number;
  cost_price: number;
  purchase_date: number;
  stock_due_date: number;
  amount: number;
};

function Stocks() {
  const { id: warehouseId } = useParams();
  const axios = useAxios();
  const [stocks, setStocks] = useState<{
    warehouse: Warehouse;
    stocks: Stock[];
  }>();
  const [stockIdToUpdate, setStockIdToUpdate] = useState<number>(0);
  const [responesError, setResponseError] = useState<ApiResponseError>();
  const [showAddStockForm, setShowAddStockForm] = useState<boolean>(false);
  const [showUpdateStockForm, setShowUpdateStockForm] =
    useState<boolean>(false);

  async function getStocks(warehouseId: number) {
    try {
      const { data: res } = await axios.get(
        `/warehouses/${warehouseId}/stocks`,
      );
      console.log({ getStock: res });
      setStocks(res.data);
      setResponseError(undefined);
    } catch (error: any) {
      setResponseError(error.response.data);
    }
  }

  async function deleteStock(stockId: number) {
    try {
      const result = await axios.delete(`/stocks/${stockId}`);
      if (result.status === 204) {
        getStocks(parseInt(warehouseId!, 10));
      }
      setStocks((prev) => ({
        warehouse: { ...prev },
        stocks: prev?.stocks.filter((stock) => {
          return stock.id !== stockId;
        }),
      }));
    } catch (error) {
      console.log('delete_stock', error);
    }
  }

  function createReport(data: Stock[]) {
    const doc = new jsPDF();
    const generatDate = formatDate(new Date().getTime());
    doc.setFontSize(18);
    doc.setTextColor(100);
    doc.text(`Stocks Report at ${stocks?.warehouse.name} Warehouse`, 14, 22);

    doc.setFontSize(11);
    doc.text(`Generated at ${generatDate}`, 14, 30);
    doc.text(
      `Total spent in this warehouse ${formatCurrency(
        getTotalSpent(stocks?.stocks),
      )}`,
      14,
      38,
    );

    autotable(doc, {
      head: [
        [
          'ID',
          'Name',
          'Supplier',
          'Purchase Date',
          'Stock Due Date',
          'Quantity',
          'Cost Price',
          'Amount',
        ],
      ],
      body: data.map((stock) => [
        stock.id,
        stock.name,
        stock.supplier,
        formatDate(stock.purchase_date),
        formatDate(stock.stock_due_date),
        stock.quantity,
        formatCurrency(stock.cost_price),
        formatCurrency(stock.quantity * stock.cost_price),
      ]),
      startY: 50,
      showHead: 'firstPage',
    });
    doc.save(`report-${generatDate}.pdf`);
  }

  useEffect(() => {
    if (warehouseId) {
      const id = parseInt(warehouseId, 10);
      getStocks(id);
    }
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">
        Your stocks details in {stocks?.warehouse.name} warehouse
      </h1>
      <div className="flex gap-2 mt-5">
        <button
          className="bg-blue-400 p-2 text-white rounded-md w-fit"
          onClick={() => setShowAddStockForm(true)}
        >
          Add New Stock
        </button>
        {stocks?.stocks.length ? (
          <button onClick={() => createReport(stocks.stocks)}>
            <span className="p-2 rounded-md bg-gray-500 text-white">
              Create Report
            </span>
          </button>
        ) : null}
      </div>
      {showAddStockForm && (
        <AddStockForm
          setStock={setStocks}
          showForm={setShowAddStockForm}
          warehouse_id={parseInt(warehouseId!, 10)}
        />
      )}
      {showUpdateStockForm && (
        <UpdateStockForm
          setStocks={setStocks}
          showForm={setShowUpdateStockForm}
          warehouseId={parseInt(warehouseId!, 10)}
          stockId={stockIdToUpdate}
        />
      )}
      {responesError && (
        <p className="text-sm text-red-500">{responesError.errors.message}</p>
      )}
      {stocks?.stocks.length ? (
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border border-gray-400 p-3">No</th>
              <th className="border border-gray-400 p-3">Product Name</th>
              <th className="border border-gray-400 p-3">Purchase Date</th>
              <th className="border border-gray-400 p-3">Stock Due Date</th>
              <th className="border border-gray-400 p-3">Supplier</th>
              <th className="border border-gray-400 p-3">Quantity</th>
              <th className="border border-gray-400 p-3">Cost Price</th>
              <th className="border border-gray-400 p-3">Amount</th>
              <th className="border border-gray-400 p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks?.stocks &&
              stocks.stocks.map((stock: Stock, index: number) => {
                return (
                  <tr key={stock.id}>
                    <td className="border border-gray-400 p-3">{index + 1}</td>
                    <td className="border border-gray-400 p-3">{stock.name}</td>
                    <td className="border border-gray-400 p-3">
                      {formatDate(stock.purchase_date)}
                    </td>
                    <td className="border border-gray-400 p-3">
                      {formatDate(stock.stock_due_date)}
                    </td>
                    <td className="border border-gray-400 p-3">
                      {stock.supplier}
                    </td>
                    <td className="border border-gray-400 p-3">
                      {stock.quantity}
                    </td>
                    <td className="border border-gray-400 p-3">
                      {formatCurrency(stock.cost_price)}
                    </td>
                    <td className="border border-gray-400 p-3">
                      {formatCurrency(stock.amount)}
                    </td>
                    <td className="border border-gray-400 p-3 space-x-2">
                      <button
                        onClick={() => {
                          setShowUpdateStockForm(true);
                          setStockIdToUpdate(stock.id);
                        }}
                        className="bg-gray-400 p-2 text-white rounded-md w-fit"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          deleteStock(stock.id);
                        }}
                        className="bg-red-400 p-2 text-white rounded-md w-fit"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="border border-gray-400 p-3 bg-blue-50">
                <span className="font-bold">Total</span>
              </td>
              <td
                colSpan={2}
                className="font-bold text-center border border-gray-400 bg-blue-50"
              >
                {formatCurrency(getTotalSpent(stocks?.stocks))}
              </td>
            </tr>
          </tfoot>
        </table>
      ) : null}
    </div>
  );
}

export default Stocks;
