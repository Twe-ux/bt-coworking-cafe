import ManifestDetails from "@/components/site/manifest/manifestDetails";
import { manifestDetailsData } from "@/db/manifest/manifestData";

const ManifestPage = () => {
  return (
    <>
      <section className="spaces spaces__2 py__90" id="spaces">
        <div className="container position-relative pb__130">
          <div className="spaces__wapper spaces__2_wapper">
            {manifestDetailsData.map(
              ({ id, title, description, subDescription, img }) => {
                return (
                  <ManifestDetails
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    subDescription={subDescription}
                    img={img}
                  />
                );
              }
            )}
          </div>
          <div className="pb__130">
            <div className="counter d-flex flex-column ">
              <div className="counter__box d-flex justify-content-center">
                <div className="d-flex text-center">
                  <h1 className="counter__number">
                    Le café motive. <br /> L’humain relie. <br /> Vous faites le
                    reste.
                  </h1>
                </div>
                {/* <p className="counter__text">test</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ManifestPage;
