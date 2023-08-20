"use client";

import { FC, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";
import UIButton from "../common/button";
import Link from "next/link";
import { cn } from "@/utils/lib";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { CategoryType, selectCategory } from "@/redux/slice/category.slice";
import { closeSidebar } from "@/redux/slice/sidebar.slice";

export const NavbarDrawer: FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { categories } = useAppSelector(selectCategory);
  const [displayCategory, setDisplayCategory] = useState<CategoryType>();

  const isBlocked = pathname.includes("/category");

  return (
    <div
      className={cn(
        "fixed left-0 top-0 -z-30 max-h-screen min-h-screen w-full overflow-auto bg-white px-[3vw] pt-40 scrollbar-none md:hidden",
        !sidebarOpen && "hidden",
        isBlocked && "max-sm:hidden"
      )}
    >
      {!displayCategory ? (
        <div className="grid grid-cols-2 gap-2">
          {categories?.map((category) => (
            <button
              key={category.Title + " nav"}
              onClick={() => setDisplayCategory(category)}
              className="relative h-32"
            >
              <Image
                src={category.Image}
                alt={category.Title + " nav image"}
                className="h-full w-full object-cover object-top"
                height={100}
                width={100}
              />
              <div className="absolute bottom-0 flex h-8 w-full items-center justify-center gap-1 bg-white bg-opacity-75 capitalize">
                {category.Title} <FaAngleDown />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <UIButton
              onClick={() => setDisplayCategory(undefined)}
              className="px-4"
            >
              Back
            </UIButton>
            <span className="text-lg font-bold capitalize">
              {displayCategory?.Title}
            </span>
          </div>
          <Image
            src={displayCategory?.Image}
            alt={displayCategory?.Title + " image"}
            width={100}
            height={100}
            className="h-40 w-full object-cover object-top"
          />
          <div className="flex flex-col gap-1 pb-20">
            {displayCategory?.subCategory.map((item, index) => (
              <Link
                key={item + index + displayCategory?.Title + " sidebar"}
                href={`/category/${encodeURIComponent(
                  displayCategory?.Title
                )}?${encodeURIComponent(item)}`}
                onClick={() => dispatch(closeSidebar())}
                className="w-fit text-lg capitalize hover:text-sanskrutiRed hover:underline hover:decoration-sanskrutiRed hover:underline-offset-4"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
