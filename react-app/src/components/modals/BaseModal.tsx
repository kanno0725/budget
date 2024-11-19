import React, { type Dispatch } from "react";
import PaymentForm from '../../components/PaymentForm';
import { GetPayment } from '../../models/Payment';

const BaseModal = (props: {
    showFlag: boolean;
    showModal: boolean;
    setShowModal: Dispatch<React.SetStateAction<boolean>>
    formPayment: GetPayment | null | undefined;
  }) => {
  return (
    <>
      {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div>
          <div className="bg-white top-1/2 left-1/3 transform -translate-x-1/4 -translate-y-1/2 w-100 h-90 p-5 flex flex-col items-start absolute z-20">
            <h1 className="text-xl font-bold mb-5">編集</h1>
            <PaymentForm formPayment={props.formPayment}/>
            {/* <p className="text-lg mb-5">Dialog Message.</p>
            <div className="flex mt-auto w-full">
              <button
                className="bg-slate-900 hover:bg-slate-700 text-white px-8 py-2 mx-auto"
                onClick={() => props.setShowModal(false)}
              >
                OK
              </button>
            </div> */}
          </div>
          <div
            className="fixed bg-black bg-opacity-50 w-full h-full z-10"
            onClick={() => props.setShowModal(false)}
          ></div>
        </div>
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない
      )}
    </>
  );
};

export default BaseModal;