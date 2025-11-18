import { SpacesDetailsProps } from "@/db/spaces/spacesData";

const AboutCounter = ({ counterBox }: SpacesDetailsProps) => {
  // console.log(counterBox[0].id);

  return (
    <div>
      <div className="counter">
        {counterBox.map((id) => {
          return (
            <div key={id.id} className="counter__box">
              <h1 className="counter__number">{id.number}</h1>
              <p className="counter__text">{id.box}</p>
            </div>
          );
        })}
      </div>
      {/* {counterBox[0] ? null : <p className="stars">﹡ A partir de </p>} */}
      {/* <p className="stars">﹡ A partir de </p> */}
    </div>
  );
};

export default AboutCounter;
