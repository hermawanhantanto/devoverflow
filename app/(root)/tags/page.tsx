import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  if (result.tags.length === 0)
    return (
      <div>
        <h1 className="h1-bold text-dark300_light700">All Users</h1>
        <div className="mt-36 flex w-full flex-col items-center justify-center">
          <NoResult
            title="No tags found"
            description="Try searching for something else"
            link="/"
            linkTitle="Go back home"
          />
        </div>
      </div>
    );
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.map((tag) => (
          <TagCard tag={tag} key={tag._id} />
        ))}
      </section>
      <div className="mt-12 flex items-center justify-center">
        <Pagination
          currentPage={searchParams.page ? +searchParams.page : 1}
          itemCount={result.total}
          pageSize={10}
        />
      </div>
    </>
  );
};

export default Page;
