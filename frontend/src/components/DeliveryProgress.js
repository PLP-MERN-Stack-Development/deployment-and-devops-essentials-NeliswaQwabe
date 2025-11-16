import React from 'react';

const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function DeliveryProgress({ status }) {
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between mt-2">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 flex items-center">
          <div
            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
              ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-1 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default DeliveryProgress;