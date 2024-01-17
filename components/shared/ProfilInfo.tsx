import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imgUrl: string;
  href?: string;
  title: string;
}

const ProfilInfo = ({ href, imgUrl, title }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={imgUrl}
        alt="profile"
        width={18}
        height={18}
        className="rounded-full object-cover"
      />
      {href ? (
        <Link href={href} className="paragraph-medium text-blue-500">
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark300_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfilInfo;
