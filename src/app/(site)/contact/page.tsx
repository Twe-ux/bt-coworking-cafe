import ContactInfo from "@/components/site/contactInfo";
import GoogleMap from "@/components/site/googleMap";
import PageTitle from "@/components/site/pageTitle";

const Contact = () => {
  return (
    <>
      <PageTitle title={"Contact Us"} currentPage={"Contact Us"} />
      <ContactInfo />
      <GoogleMap />
    </>
  );
};

export default Contact;
