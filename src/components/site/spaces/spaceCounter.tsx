import { SpacesDetailsProps } from "@/db/spaces/spacesData";

interface SpaceCounterProps {
  counterBox: SpacesDetailsProps["counterBox"];
}

const SpaceCounter = ({ counterBox }: SpaceCounterProps) => {
  return (
    <div>
      <div className="counter">
        {counterBox.map((item) => {
          return (
            <div key={item.id} className="counter__box">
              <h1 className="counter__number">{item.number}</h1>
              <p className="counter__text">{item.box}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpaceCounter;
