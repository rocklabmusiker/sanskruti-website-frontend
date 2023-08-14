"use client";

import { FC, useState } from "react";
import Container from "../../components/container";
import { Input } from "@/components/common/input";
import UIButton from "@/components/common/button";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
  NotificationType,
  setNotification,
  showNotification,
} from "@/redux/slice/notification.slice";
import axios from "axios";
import { Address, selectUser, setAddress } from "@/redux/slice/user.slice";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import z from "zod";
import PhoneInput from "react-phone-input-2";
import "@/app/high-res.css";
import Link from "next/link";

const EditAddressPage: FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const dispatch = useAppDispatch();
  const router = useRouter();

  if (!id) router.push("/user/address/add");

  const user = useAppSelector(selectUser);
  const foundAddress =
    user.address && user.address.find((address) => address.id === id);

  const [name, setName] = useState(foundAddress?.name || "");
  const [address, setaddress] = useState(foundAddress?.address || "");
  const [city, setCity] = useState(foundAddress?.city || "");
  const [state, setState] = useState(foundAddress?.state || "");
  const [zip, setZip] = useState(foundAddress?.zip.toString() || "");
  const [country, setCountry] = useState(foundAddress?.country || "");
  const [tel, setTel] = useState(foundAddress?.tel.toString() || "");
  const [email, setEmail] = useState(foundAddress?.email || "");

  const validateTypes = (): { valid: boolean } & NotificationType => {
    const mobileNumberSchema = z
      .number()
      .refine((number) => number.toString().length > 10);
    try {
      mobileNumberSchema.parse(Number(tel));
    } catch {
      return {
        valid: false,
        message: "not a valid mobile number",
        type: "warning",
        content: `For mobile number, include the country code, like "911234567890".`,
      };
    }

    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
    } catch {
      return {
        valid: false,
        message: "not a valid email",
        type: "warning",
        content:
          "the email you have provide is not a valid email format an example of a valid email is: ashokkumar@email.com",
      };
    }

    const zipSchema = z
      .number()
      .refine(
        (number) =>
          /^[1-9][0-9]{5}$/.test(number.toString()) &&
          number.toString().length === 6
      );
    try {
      zipSchema.parse(Number(zip));
    } catch {
      return {
        valid: false,
        message: "Not a valid zip",
        type: "warning",
        content:
          "According to indian standard, a valid zip is a 6-digit number. example: 123456",
      };
    }

    return { valid: true, message: "", type: "info", content: "" };
  };

  const submit = async () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zip.trim() ||
      !country.trim() ||
      !tel.trim() ||
      !email.trim()
    ) {
      dispatch(
        setNotification({
          message: "fill all details",
          type: "warning",
          content:
            "We request the user to please fill all the required fields.",
        })
      );
      return dispatch(showNotification());
    }

    const { valid, message, type, content } = validateTypes();
    if (!valid) {
      dispatch(setNotification({ message, type, content }));
      return dispatch(showNotification());
    }

    await axios
      .put<NotificationType & { address: Address[] }>(
        `${process.env.ENDPOINT}/api/v1/user/address`,
        {
          newAddress: {
            id,
            name,
            tel: Number(tel),
            zip,
            address,
            city,
            state,
            country,
            email,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        const response = res.data;
        dispatch(
          setNotification({ message: response.message, type: response.type })
        );
        dispatch(showNotification());
        dispatch(setAddress(response.address));
        router.push("/user/address");
      })
      .catch((err) => {
        const response = err.response.data;
        dispatch(
          setNotification({
            message: response.message,
            type: response.type,
          })
        );
        dispatch(showNotification());
      });
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col justify-center gap-4 pt-6 md:max-w-lg">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Edit address</h3>
        <Link href="/user/address">
          <UIButton className="w-fit border-slate-400 px-5">Back</UIButton>
        </Link>
      </div>
      <Input
        input_type="text"
        placeholder="Full Name"
        setValue={setName}
        value={name}
      />
      <div className="relative h-fit w-full rounded-md hover:outline hover:outline-4 hover:outline-gray-300">
        <PhoneInput country={"in"} value={tel} onChange={setTel} />
        <label
          id="mobileLabel"
          htmlFor="mobile"
          className="absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-2 text-xs"
        >
          Contact Number
        </label>
      </div>
      <Input
        input_type="text"
        placeholder="Email"
        setValue={setEmail}
        value={email}
      />
      <Input
        input_type="text"
        placeholder="Address"
        setValue={setaddress}
        value={address}
      />
      <Input
        input_type="text"
        placeholder="City"
        setValue={setCity}
        value={city}
      />
      <Input
        input_type="text"
        placeholder="State"
        setValue={setState}
        value={state}
      />
      <Input
        input_type="text"
        placeholder="Country"
        setValue={setCountry}
        value={country}
      />
      <Input
        input_type="text"
        placeholder="Zip"
        setValue={setZip}
        value={zip}
      />
      <UIButton
        onClick={submit}
        className="ml-auto w-fit border-none bg-sanskrutiRed px-[3.25rem] font-bold text-white hover:outline-sanskrutiRedLight"
      >
        SUBMIT
      </UIButton>
    </div>
  );
};

export default EditAddressPage;
