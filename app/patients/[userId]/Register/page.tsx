import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/actions";
import Image from "next/image";
import React from "react";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py10#">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="Patient"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user} />

          <p className="copyright py-12">@copy; 2024 CarePulse</p>
        </div>
      </section>

      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt="Patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
