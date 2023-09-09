import UIHeader from "@/components/common/header";
import axios from "axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
("react-markdown");

const PaymentPolicyPage = async () => {
  const reply = (
    await axios.get(
      `${process.env.ENDPOINT}/api/v1/user/getMarkdown?field=privacyPolicy`
    )
  ).data?.markdown;
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-[3vw] pb-10 pt-44 text-justify text-[16px]">
      <UIHeader title="PAYMENT POLICY" />
      <ReactMarkdown className="w-full leading-9">{reply}</ReactMarkdown>
    </div>
  );
};

export default PaymentPolicyPage;
