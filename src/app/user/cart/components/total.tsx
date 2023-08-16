"use client";

import UIButton from "@/components/common/button";
import {
  selectCart,
  selectCouponDiscount,
  setCouponDiscount,
} from "@/redux/slice/cart.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { FC, Fragment, useEffect, useState } from "react";
import { AiOutlineArrowDown, AiOutlineTag } from "react-icons/ai";
import { getAmounts } from "../utils/calculation";
import axios from "axios";
import { Coupon } from "../../account/page";
import { cn } from "@/utils/lib";
import CouponCartComponent from "./couponCartComponent";
import { RxCross2 } from "react-icons/rx";
import {
  setNotification,
  showNotification,
} from "@/redux/slice/notification.slice";

const Total: FC = () => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCart);
  const couponDiscount = useAppSelector(selectCouponDiscount);

  const { total, discount, gst, finalValue } = getAmounts(cart);

  const [coupons, setCoupons] = useState<Coupon[]>();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!couponDiscount.discount) return;
    applyCode(couponDiscount.code);
  }, [finalValue, couponDiscount.discount, couponDiscount.code]);

  const fetchCoupons = async () => {
    axios
      .get<{ coupons: Coupon[] }>(
        `${process.env.ENDPOINT}/api/v1/user/coupons`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setCoupons(res.data.coupons);
      })
      .catch((err) => {});
  };

  const applyCode = async (couponCode: string) => {
    axios
      .post<Notification & { couponDiscount: number; code: string }>(
        `${process.env.ENDPOINT}/api/v1/user/coupons`,
        {
          code: couponCode,
          price: finalValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        dispatch(
          setCouponDiscount({
            discount: res.data.couponDiscount,
            code: res.data.code,
          })
        );
      })
      .catch((err) => {
        const response = err.response.data;
        dispatch(
          setCouponDiscount({
            discount: 0,
            code: "",
          })
        );
        dispatch(
          setNotification({
            message: response.message,
            content: response.content,
            type: response.type,
          })
        );
        dispatch(showNotification());
      });
  };

  if (!cart || cart?.length === 0) return <Fragment></Fragment>;
  return (
    <div className="flex w-full flex-col gap-3 border-gray-300 max-lg:border-t-[1px] max-lg:pt-5 lg:h-full lg:max-w-sm lg:border-l-[1px] lg:pl-5">
      {/* coupons */}
      <div className="text-xs font-medium text-gray-500">COUPONS</div>
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-2 font-bold">
          <AiOutlineTag className="h-4 w-4" />
          Apply Coupons
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "h-6 w-6 rounded-full border-[1px] border-gray-500 p-1 outline-4 outline-gray-200 transition-all duration-200 ease-in-out hover:outline",
            open && "rotate-180"
          )}
        >
          {open ? (
            <RxCross2 className="h-full w-full" />
          ) : (
            <AiOutlineArrowDown className="h-full w-full" />
          )}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2 text-xs">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              className="h-full w-full rounded-[4px] border-[1px] border-gray-500 px-2 py-1 text-gray-500 outline-none focus-within:border-gray-700 focus-within:text-black"
            />

            <UIButton
              onClick={() => applyCode(code)}
              className="w-fit rounded-[4px] border-[1px] border-sanskrutiRed px-3 py-1 text-sanskrutiRed hover:outline-sanskrutiRedLight"
            >
              Apply
            </UIButton>
          </div>
          {coupons && coupons.length ? (
            <div className="relative overflow-hidden rounded-b-xl rounded-t-md">
              <div className="flex h-full max-h-[12.5rem] flex-col gap-1 overflow-y-scroll pb-2 scrollbar-none">
                {coupons?.map((coupon, index) => (
                  <CouponCartComponent
                    key={coupon.code + index}
                    className="flex-shrink-0"
                    applyCoupon={() => applyCode(coupon.code)}
                    {...coupon}
                  />
                ))}
              </div>
              <div
                style={{
                  boxShadow: "0px -10px 5px #0000002f inset",
                }}
                className="absolute bottom-0 left-0 h-5 w-full rounded-b-xl"
              ></div>
              <div
                style={{
                  boxShadow: "0px 5px #00000011 inset",
                }}
                className="absolute left-0 top-0 h-2 w-full rounded-t-md"
              ></div>
            </div>
          ) : (
            <span className="text-center">No coupons found</span>
          )}
        </div>
      )}
      <div className="border-t-[1px] border-gray-300 pt-3 text-xs font-semibold text-gray-500">
        PAYMENT DETAILS ({cart.length !== 1 ? `${cart.length} items` : `1 item`}
        )
      </div>
      <div className="flex w-full flex-col gap-3 [&>*]:flex [&>*]:w-full [&>*]:justify-between">
        <div>
          <span>Total MRP</span>
          <span>&#8377;{total}</span>
        </div>
        {!!discount && (
          <div>
            <span>Discount</span>
            <span className="text-green-400">-&#8377;{discount}</span>
          </div>
        )}
        {!!couponDiscount.discount && (
          <div>
            <span>Coupon Discount</span>
            <span className="text-green-400">
              -&#8377;{couponDiscount.discount}
            </span>
          </div>
        )}
        {!!gst && (
          <div>
            <span>GST</span>
            <span></span>&#8377;{gst}
          </div>
        )}
        <div className="border-t-[1px] border-gray-300 pt-5 font-bold">
          <span>Total Amount</span>
          <span>
            &#8377;
            {couponDiscount ? finalValue - couponDiscount.discount : finalValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Total;
