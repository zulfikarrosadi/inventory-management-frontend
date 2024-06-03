import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiResponse } from '../schema';
import useAxios from '../hooks/useAxios';
import { Stock } from '../pages/Stocks';
import { Warehouse } from '../pages/Warehouse';

export const createStockSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(1, 'name is required'),
  supplier: z
    .string({ required_error: 'supplier is required' })
    .min(1, 'supplier is required'),
  quantity: z
    .string({ required_error: 'total is required' })
    .min(1, 'total stock is required'),
  cost_price: z
    .string({ required_error: 'cost price is required' })
    .min(1, 'cost price is required'),
  purchase_date: z.string({ required_error: 'purchase date is required' }),
  stock_due_date: z.string({ required_error: 'stock due date is required' }),
});

type ServerValidationError = {
  name: string;
  supplier: string;
  quantity: string;
  cost_price: string;
  purchase_date: string;
  stock_due_date: string;
};

function AddStockForm({
  warehouse_id,
  showForm,
  setStock,
}: {
  warehouse_id: number;
  showForm: Dispatch<SetStateAction<boolean>>;
  setStock: Dispatch<
    SetStateAction<{ warehouse: Warehouse; stocks: Stock[] } | undefined>
  >;
}) {
  const axios = useAxios();
  const [responseError, setResponseError] = useState<ApiResponse>();
  const [serverValidationError, setServerValidationError] =
    useState<ServerValidationError>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.TypeOf<typeof createStockSchema>>();

  async function submitHandler(data: z.TypeOf<typeof createStockSchema>) {
    const quantity = parseInt(data.quantity, 10);
    const cost_price = parseInt(data.cost_price, 10);

    try {
      const { data: res } = await axios.post(
        '/stocks',
        JSON.stringify({
          ...data,
          quantity,
          cost_price,
          warehouse_id,
          created_at: new Date(),
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (res.status === 'success') {
        setStock(res.data);
        showForm(false);
      }
    } catch (error: any) {
      if (error.response.data.errors.message === 'validation errors') {
        setServerValidationError(error.response.data.errors.details);
      }
      setResponseError(error.response.data);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        {responseError && responseError.errors && (
          <>
            <p className="text-sm text-red-500 gap-2">
              {responseError.errors.message}
            </p>
          </>
        )}
        <ul className="flex flex-col gap-4">
          <li className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                autoFocus
                className="border border-gray-400 rounded-md outline outline-1 w-1/3"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.name && errors.name.message}
            </p>
            {serverValidationError && serverValidationError.name && (
              <p className="text-sm text-red-500">
                {serverValidationError.name}
              </p>
            )}
          </li>
          <li className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="supplier">Supplier</label>
              <input
                type="text"
                id="supplier"
                {...register('supplier')}
                className="w-1/3 border border-gray-400 rounded-md outline outline-1"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.supplier && errors.supplier.message}
            </p>
            {serverValidationError && serverValidationError.supplier && (
              <p className="text-sm text-red-500">
                {serverValidationError.supplier}
              </p>
            )}
          </li>
          <li className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                {...register('quantity')}
                className="w-1/3 border border-gray-400 rounded-md outline outline-1"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.quantity && errors.quantity.message}
            </p>
            {serverValidationError && serverValidationError.quantity && (
              <p className="text-sm text-red-500">
                {serverValidationError.quantity}
              </p>
            )}
          </li>
          <li className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="cost_price">Cost Price</label>
              <input
                type="number"
                id="cost_price"
                {...register('cost_price')}
                className="w-1/3 border border-gray-400 rounded-md outline outline-1"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.cost_price && errors.cost_price.message}
            </p>
            {serverValidationError && serverValidationError.cost_price && (
              <p className="text-sm text-red-500">
                {serverValidationError.cost_price}
              </p>
            )}
          </li>
          <li className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="cost_price">Purchase Date</label>
              <input
                type="datetime-local"
                id="purchase_date"
                {...register('purchase_date')}
                className="w-1/3 border border-gray-400 rounded-md outline outline-1"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.purchase_date && errors.purchase_date.message}
            </p>
            {serverValidationError && serverValidationError.purchase_date && (
              <p className="text-sm text-red-500">
                {serverValidationError.purchase_date}
              </p>
            )}
          </li>
          <li className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="cost_price">Stock Due Date</label>
              <input
                type="datetime-local"
                id="stock_due_date"
                {...register('stock_due_date')}
                className="w-1/3 border border-gray-400 rounded-md outline outline-1"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.stock_due_date && errors.stock_due_date.message}
            </p>
            {serverValidationError && serverValidationError.stock_due_date && (
              <p className="text-sm text-red-500">
                {serverValidationError.stock_due_date}
              </p>
            )}
          </li>
          <li>
            <button
              disabled={isSubmitting}
              className="bg-gray-400 p-2 w-1/5 text-white rounded-md"
            >
              Submit
            </button>
          </li>
        </ul>
      </form>
    </>
  );
}

export default AddStockForm;
