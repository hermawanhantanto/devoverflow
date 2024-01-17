import Image from "next/image";
import React from "react";

interface Props {
  imgUrl: string;
  label: string;
  count: number;
}

const CardProfile = ({ imgUrl, label, count }: Props) => {
  return (
    <div className="background-light900_dark200 light-border-2 flex flex-wrap items-center gap-4 px-12 py-8 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt={label} width={38} height={38} />
      <div className="text-dark200_light800 flex flex-col gap-1">
        <p className="paragraph-semibold">{count}</p>
        <p className="body-regular">{label}</p>
      </div>
    </div>
  );
};

export default CardProfile;
