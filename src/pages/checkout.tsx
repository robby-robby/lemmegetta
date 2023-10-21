import { ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import CustomerLayout from "~/components/CustomerLayout";
import { useCart } from "~/hooks/useCart";

function Checkout() {
  const { useItemizedList } = useCart();
  const list = [];
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(
      list.reduce(
        (previousValue, currentItem) => previousValue + currentItem.price,
        0
      )
    );
  }, []);

  return (
    <div className="flex items-start justify-center bg-gray-100">
      <div className="m-4 w-full max-w-lg rounded-lg bg-white shadow-md sm:p-3 ">
        <div className="p-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="mb-4 grid grid-cols-5 gap-4 rounded bg-gray-200 p-4"
            >
              <Image
                priority
                className="col-span-1"
                src={item.imageUrl}
                alt={item.name}
              />
              <div className="col-span-4">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-sm text-gray-700">{item.description}</p>
                <p className="text-lg text-gray-900">
                  {item.price.toFixed(2)}$
                </p>
                <p className="text-xs text-gray-500">{item.shortCode}</p>
              </div>
            </div>
          ))}
          <h2 className="text-right text-2xl font-bold">
            Total: {totalPrice.toFixed(2)}$
          </h2>
        </div>
      </div>
    </div>
  );
}

Checkout.getLayout = function getLayout(page: ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>;
};
export default Checkout;
