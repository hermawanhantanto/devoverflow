import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const { name, username, bio, portofolioWebsite, location } =
    await getUserById({ userId });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile
          clerkId={userId}
          name={name}
          username={username}
          bio={bio}
          portofolioWebsite={portofolioWebsite}
          location={location}
        />
      </div>
    </>
  );
};

export default Page;
