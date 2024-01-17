interface Props {
  countAnswer: number;
  countQuestion: number;
}

const CardStat = ({ countAnswer, countQuestion }: Props) => {
  return (
    <div className="background-light900_dark200 light-border-2 flex flex-wrap items-center gap-4 px-12 py-8 shadow-light-300 dark:shadow-dark-200">
      <div className="text-dark200_light800 flex flex-col gap-1">
        <p className="paragraph-semibold">{countAnswer}</p>
        <p className="body-regular">Answer</p>
      </div>
      <div className="text-dark200_light800 flex flex-col gap-1">
        <p className="paragraph-semibold">{countQuestion}</p>
        <p className="body-regular">Question</p>
      </div>
    </div>
  );
};

export default CardStat;
