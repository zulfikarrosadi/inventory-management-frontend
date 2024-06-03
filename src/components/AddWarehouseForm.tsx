import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { z } from 'zod';
import useAxios from '../hooks/useAxios';
import { ApiResponse, ApiResponseGeneric } from '../schema';
import { Warehouse } from '../pages/Warehouse';

const createWarehouseSchema = z.object({
  name: z.string({ required_error: 'Warehouse name is required' }),
  address: z.string({ required_error: 'Warehouse address is required' }),
});

type ServerValidationError = { name: string; address: string };

function AddWarehouseForm({
  showForm,
  setWarehouses,
}: {
  showForm: Dispatch<SetStateAction<boolean>>;
  setWarehouses: Dispatch<
    SetStateAction<ApiResponseGeneric<{ warehouse: Warehouse[] }> | undefined>
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
  } = useForm<z.TypeOf<typeof createWarehouseSchema>>();

  async function submitHandler(data: z.TypeOf<typeof createWarehouseSchema>) {
    try {
      const { data: res } = await axios.post<
        {},
        AxiosResponse<ApiResponseGeneric<Warehouse[]>>
      >('/warehouses', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 'success') {
        setWarehouses(res);
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
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                {...register('address')}
                className="w-1/3 border border-gray-400 rounded-md outline outline-1"
              />
            </div>
            <p className="text-sm text-red-500">
              {errors.address && errors.address.message}
            </p>
            {serverValidationError && serverValidationError.address && (
              <p className="text-sm text-red-500">
                {serverValidationError.address}
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

export default AddWarehouseForm;
