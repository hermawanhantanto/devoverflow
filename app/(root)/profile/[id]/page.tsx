import CardProfile from "@/components/cards/CardProfile";
import CardStat from "@/components/cards/CardStat";
import AnswerTabs from "@/components/shared/AnswerTabs";
import ProfilInfo from "@/components/shared/ProfilInfo";
import QuestionTab from "@/components/shared/QuestionTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfo } from "@/lib/actions/user.action";
import { formatMonthYear } from "@/lib/utils";
import { URLProps } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dev Overflow | Profile Page",
  description: "Profile page of Dev Overflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Page = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({
    userId: params.id,
  });

  if (!userInfo) return null;

  return (
    <>
      <div className="flex flex-col-reverse justify-between sm:flex-row ">
        <div className="flex gap-4 max-sm:flex-col sm:items-center">
          <Image
            src={userInfo?.user.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h2 className="h2-bold text-dark300_light700">
              {userInfo?.user.name}
            </h2>
            <p className="paragraph-medium text-dark400_light800">
              @{userInfo?.user.username}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {userInfo?.user.portofolioWebsite && (
                <ProfilInfo
                  imgUrl="/assets/icons/link.svg"
                  title="Portofolio"
                  href={userInfo?.user.portofolioWebsite}
                />
              )}

              {userInfo?.user.location && (
                <ProfilInfo
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo?.user.location}
                />
              )}
              <ProfilInfo
                imgUrl="/assets/icons/calendar.svg"
                title={formatMonthYear(userInfo?.user.joinedAt)}
              />
            </div>
            {userInfo?.user.bio && (
              <p className="paragraph-medium text-dark400_light800 mt-4">
                {userInfo?.user.bio}
              </p>
            )}
          </div>
        </div>
        {params.id === userInfo?.user.clerkId && (
          <Link href="/profile/edit" className="max-sm:mb-4 max-sm:self-end">
            <Button className="btn-secondary text-dark300_light700 paragraph-medium min-h-[46px] min-w-[170px] px-6 py-3">
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
      <h2 className="h2-bold text-dark400_light700 mt-12">
        Stats - {userInfo?.user.reputation}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat
          countAnswer={userInfo?.question ? userInfo?.question : 0}
          countQuestion={userInfo?.answer ? userInfo?.answer : 0}
        />
        <CardProfile
          imgUrl="/assets/icons/gold-medal.svg"
          count={userInfo?.gold || 0}
          label="Gold Medals"
        />
        <CardProfile
          imgUrl="/assets/icons/silver-medal.svg"
          count={userInfo?.silver || 0}
          label="Silver Medals"
        />
        <CardProfile
          imgUrl="/assets/icons/bronze-medal.svg"
          count={userInfo?.bronze || 0}
          label="Bronze Medals"
        />
      </div>

      <Tabs defaultValue="top-posts" className="mt-10">
        <TabsList className="background-light800_dark400 min-h-[42px] p-1">
          <TabsTrigger value="top-posts" className="tab">
            Questions
          </TabsTrigger>
          <TabsTrigger value="answers" className="tab">
            Answers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="top-posts">
          <QuestionTab
            userId={userInfo?.user._id}
            page={searchParams.page ? Number(searchParams.page) : 1}
          />
        </TabsContent>
        <TabsContent value="answers">
          <AnswerTabs
            userId={userInfo?.user._id}
            page={searchParams.page ? Number(searchParams.page) : 1}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Page;
