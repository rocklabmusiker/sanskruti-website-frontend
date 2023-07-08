"use client";

import { Address } from "@/redux/slice/user.slice";
import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Container from "../components/container";
import OrderComponet from "../components/orderComponent";
import { useAppDispatch } from "@/redux/store/hooks";
import { completeLoading, startLoading } from "@/redux/slice/loading.slice";
import { AiOutlineSearch } from "react-icons/ai";

export type Order = {
  order: {
    _id: string;
    orderId: string;
    userId: string;
    product: {
      id: string;
      slug: string;
      name: string;
      brand_name: string;
      images: string[];
      gst_percent: number;
      quantity: number;
      varient: {
        price: number;
        discount?: number;
        variations: Record<string, string>;
      };
    };
    deliveryInfo: {
      date: string;
      status: "Pending" | "Confirmed" | "Out for deivery" | "Delivered";
    };
    cancellationInfo: {
      isCancelled: boolean;
      date: string;
      Amount_refunded: boolean;
    };
    returnInfo?: {
      isReturned: boolean;
      date: string;
      status: "Pending" | "Confirmed" | "Out for return" | "Returned";
      Amount_refunded: boolean;
    };
  };
  payment: {
    paymentMethod: string;
    orderId: string;
    userId: string;
    shippingAddress: Address;
    billingAddress: Address;
    orderInfo: {
      Date: Date;
      status: string;
      SubTotal: number;
      ShippingCost: number;
      Totaldiscount: number;
      TotalGST: number;
      Amount: number;
    };
    paymentInfo: {
      status?: string;
      transactionId?: string;
      amount?: number;
      currency?: string;
      timestamp?: string;
      referenceId?: string;
    };
  };
};

const OrderHistoryPage: NextPage = () => {
  const [orders, setOrders] = useState<Order[]>();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("No filter");

  const orderList =
    (orders &&
      orders.filter(
        (order) =>
          (order.order.product.name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) &&
            filter === "No filter") ||
          order.order.deliveryInfo.status === filter
      )) ||
    [];

  const getOrders = () => {
    dispatch(startLoading());
    axios
      .get<{ orders: Order[] }>(
        `${process.env.ENDPOINT}/api/v1/user/order/history`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setOrders(res.data.orders);
        dispatch(completeLoading());
      })
      .catch((err) => {
        dispatch(completeLoading());
      });
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Container containerTitle="Order History">
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex gap-2">
          <div className="text-md flex h-9 w-full items-center gap-1 rounded-md border-2 border-gray-300 bg-slate-50 px-2 text-gray-400 focus-within:border-gray-600 focus-within:text-gray-600">
            <AiOutlineSearch className="aspect-sqaure text-xl" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="w-full border-none bg-transparent outline-none"
              placeholder="Search for past orders"
            />
          </div>
          <div className="flex w-[10rem] items-center justify-center rounded-md border-2 border-gray-300 bg-slate-50">
            <select
              name="filter"
              id="filter"
              defaultValue="No filter"
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none"
            >
              {[
                "Pending",
                "Confirmed",
                "Out for deivery",
                "Delivered",
                "No filter",
              ].map((val) => (
                <option key={"filter " + val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        </div>
        {orderList.length ? (
          orderList.map((order) => (
            <OrderComponet key={order.payment.orderId} order={order} />
          ))
        ) : (
          <div className="mt-5 text-center text-lg font-semibold">
            No orders Found
          </div>
        )}
      </div>
    </Container>
  );
};

export default OrderHistoryPage;
