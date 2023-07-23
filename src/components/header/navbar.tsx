"use client";

import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/lib";
import { FaAngleDown } from "react-icons/fa";
import { useAppSelector } from "@/redux/store/hooks";
import { selectCategory } from "@/redux/slice/category.slice";

const Navbar: FC = () => {
  const { categories } = useAppSelector(selectCategory);

  const [displayCategory, setDisplayCategory] = useState(categories[0]);
  const pathname = usePathname();
  const block = pathname.includes("/auth") || pathname.includes("/user");

  return (
    <div
      className={cn(
        "relative flex w-full justify-center bg-white px-[3vw] max-md:hidden",
        block && "hidden"
      )}
    >
      <div className="group flex w-full max-w-4xl justify-center max-md:hidden">
        <nav className="flex h-12 w-full items-center justify-between">
          {categories?.map((category) => (
            <div
              key={category.Title}
              className={cn(
                "flex items-center justify-center gap-[2px] rounded-md p-2 text-[0.7rem] font-medium capitalize lg:text-sm",
                "hover:bg-red-100 hover:text-sanskrutiRed",
                category.Title === displayCategory?.Title &&
                  "group-hover:bg-red-100 group-hover:text-sanskrutiRed"
              )}
              onMouseEnter={() => {
                setDisplayCategory(category);
              }}
            >
              {category.Title.toLocaleUpperCase()} <FaAngleDown />
            </div>
          ))}
        </nav>
        <div className="absolute left-1/2 top-12 hidden w-full max-w-4xl -translate-x-1/2 pt-2 group-hover:block">
          <div className="h-[25rem] rounded-md border-[1px] border-gray-500 bg-white shadow-lg">
            <div className="flex h-full w-full gap-3 overflow-hidden p-5">
              <div className="flex w-full flex-col gap-4">
                <h3 className="text-lg font-semibold">
                  {displayCategory?.Title.toLocaleUpperCase()}
                </h3>
                <div className="flex h-[15rem] w-full flex-col flex-wrap gap-3 text-[16px]">
                  {displayCategory?.subCategory.map((item, index) => (
                    <Link
                      key={item + index + displayCategory?.Title}
                      href={`/category/${displayCategory?.Title}?${
                        displayCategory?.Title
                      }=${encodeURIComponent(item)}`}
                      className="w-fit capitalize hover:font-medium hover:text-sanskrutiRed hover:underline hover:underline-offset-4"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="aspect-[2/3] h-full shrink-0 overflow-hidden rounded-sm">
                {!!displayCategory?.Image && (
                  <Image
                    src={displayCategory?.Image}
                    alt={displayCategory?.Title}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover object-top"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
