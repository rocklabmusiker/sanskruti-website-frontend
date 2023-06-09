"use client";

import { setLoading } from "@/redux/slice/loading.slice";
import {
  UserType,
  loggedIn,
  loggedOut,
  selectUser,
  setUser,
} from "@/redux/slice/user.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { FC, HTMLAttributes, useEffect, useRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}
const AuthComponent: FC<Props> = ({ children }) => {
  const firstFetch = useRef(true);

  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const router = useRouter();

  const getUser = async () => {
    await axios
      .get<UserType>(`${process.env.ENDPOINT}/api/v1/user/`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        dispatch(
          setUser({
            username: response.data.username,
            email: response.data.email,
            Mobile_No: response.data.Mobile_No,
            address: response.data.address,
            provider: response.data.provider,
          })
        );
        dispatch(loggedIn());
        firstFetch.current = false;

        setTimeout(
          () => dispatch(setLoading({ loading: true, value: 20 })),
          200
        );
        setTimeout(
          () => dispatch(setLoading({ loading: true, value: 75 })),
          1000
        );
        setTimeout(
          () => dispatch(setLoading({ loading: true, value: 100 })),
          1600
        );
        setTimeout(
          () => dispatch(setLoading({ loading: false, value: 0 })),
          1650
        );
      })
      .catch(() => {
        dispatch(setUser({ address: [] }));
        dispatch(loggedOut());
        setTimeout(
          () => dispatch(setLoading({ loading: true, value: 20 })),
          200
        );
        setTimeout(
          () => dispatch(setLoading({ loading: true, value: 75 })),
          1000
        );
        setTimeout(
          () => dispatch(setLoading({ loading: true, value: 100 })),
          1600
        );
        setTimeout(
          () => dispatch(setLoading({ loading: false, value: 0 })),
          1650
        );
      });
    console.log(user);
    if (!user.isAuthenticated && pathname.includes("/user")) {
      router.replace("/");
    }
  };

  useEffect(() => {
    dispatch(setLoading({ loading: true, value: 0 }));
    if (firstFetch.current || pathname.includes("/user")) {
      getUser();
      console.log("fetch");
    } else {
      setTimeout(() => dispatch(setLoading({ loading: true, value: 20 })), 200);
      setTimeout(
        () => dispatch(setLoading({ loading: true, value: 55 })),
        1000
      );
      setTimeout(
        () => dispatch(setLoading({ loading: true, value: 75 })),
        1400
      );
      setTimeout(
        () => dispatch(setLoading({ loading: true, value: 100 })),
        1600
      );
      setTimeout(
        () => dispatch(setLoading({ loading: false, value: 0 })),
        1650
      );
    }
  }, [pathname]);

  return <>{children}</>;
};

export default AuthComponent;
