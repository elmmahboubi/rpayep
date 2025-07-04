import React from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  CreateOrderActions,
  OnApproveActions,
} from '@paypal/react-paypal-js';
import ClientOnly from './ClientOnly';

interface PayPalButtonProps {
  amount: number;
  description: string;
  payeeEmail?: string;
}

const PayPalButtonWrapper: React.FC<PayPalButtonProps> = ({
  amount,
  description,
  payeeEmail,
}) => {
  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: 'sb', // IMPORTANT: Replace with your actual client ID for production
    currency: 'USD',
    components: 'buttons',
  };

  const createOrder = (
    _data: Record<string, unknown>,
    actions: CreateOrderActions
  ) => {
    const purchase_units = [
      {
        amount: {
          value: amount.toFixed(2),
          currency_code: 'USD',
        },
        description: description,
        ...(payeeEmail && { payee: { email_address: payeeEmail } }),
      },
    ];
    return actions.order.create({ purchase_units });
  };

  const onApprove = async (
    _data: Record<string, unknown>,
    actions: OnApproveActions
  ) => {
    try {
      if (actions.order) {
        const details = await actions.order.capture();
        alert(
          `Payment successful! Thank you, ${details.payer.name.given_name}!`
        );
        // Here you would typically handle the successful payment,
        // e.g., redirect to a success page, update order status in your backend.
      }
    } catch (error) {
      console.error('Payment capture error:', error);
      // Handle payment error (e.g., show a message to the user)
    }
  };

  const onError = (err: Record<string, unknown>) => {
    console.error('PayPal button error:', err);
    // Handle SDK or button rendering errors
  };

  if (!amount || amount <= 0) {
    return (
      <div className="w-full p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm text-center">
        Please add items to your cart to check out.
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        forceReRender={[amount, description, payeeEmail]} // Re-render buttons if these props change
      />
    </PayPalScriptProvider>
  );
};

// Wrap with ClientOnly to prevent any SSR issues with the PayPal SDK
const PayPalButton: React.FC<PayPalButtonProps> = (props) => (
  <ClientOnly
    fallback={
      <div className="w-full h-[150px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <p className="ml-4 text-gray-600">Loading Payment Options...</p>
      </div>
    }
  >
    <PayPalButtonWrapper {...props} />
  </ClientOnly>
);

export default PayPalButton;