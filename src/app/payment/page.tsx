"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { UseCart } from "../../../action/usecart";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const router = useRouter();
  const { cart } = UseCart();
  const [shippingDetails, setShippingDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const calculateSubtotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const salesTax = 0.1;
  const subtotal = calculateSubtotal();
  const totalTax = subtotal * salesTax;
  const total = subtotal + totalTax;

  useEffect(() => {
    // Fetch shipping details from Sanity
    const fetchData = async () => {
      const details = await fetchShippingDetails();
      setShippingDetails(details);
    };
    fetchData();
  }, []);

  const handlePayment = () => {
    if (selectedPaymentMethod === "stripe") {
      router.push("/stripe-payment");
    } else if (selectedPaymentMethod === "cod") {
      Swal.fire("Order Placed Successfully with Cash on Delivery!");
    }
  };

  return (
    <main className="bg-gray-100 grid grid-cols-1 md:p-10 md:flex md:justify-between">
      {/* Order Summary */}
      <section className="w-[387px] md:w-[350px] bg-gray-100 p-6 md:border-none border-black border-[1px] md:ml-0 ml-3 md:mr-0 mr-3 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Tax (10%):</span>
            <span>${totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="md:w-[700px]">
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
        {shippingDetails ? (
          <div className="space-y-2 p-4 bg-white rounded-lg shadow-md">
            <p><strong>Name:</strong> {`${shippingDetails.firstName} ${shippingDetails.lastName}`}</p>
            <p><strong>Mobile:</strong> {shippingDetails.mobileNumber}</p>
            <p><strong>Address:</strong> {`${shippingDetails.streetAddress}, ${shippingDetails.city}, ${shippingDetails.province}, ${shippingDetails.country}`}</p>
          </div>
        ) : (
          <p>Loading shipping details...</p>
        )}

        <h2 className="text-xl font-bold mt-6">Payment Method</h2>
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={setSelectedPaymentMethod}
          className="space-y-2 mt-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <label htmlFor="cod" className="text-sm">Cash on Delivery (COD)</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stripe" id="stripe" />
            <label htmlFor="stripe" className="text-sm">Stripe Payment</label>
          </div>
        </RadioGroup>

        <Button
          disabled={!selectedPaymentMethod}
          onClick={handlePayment}
          className="w-full mt-6 bg-black text-white hover:bg-gray-500"
        >
          Proceed with {selectedPaymentMethod === "stripe" ? "Stripe" : "COD"}
        </Button>
      </section>
    </main>
  );
}
