import Image from "next/image";
import logoDark from "/public/images/logo-black.svg";
import logoLight from "/public/images/logo_white.svg";

const LogoBox = () => {
  return (
    <a href={"/"}>
      <div className="logo-box">
        <div className="logo-dark">
          <Image
            width={30}
            height={30}
            src={logoDark}
            className="logo-sm"
            alt="logo sm"
          />
          <Image
            width={40}
            height={40}
            src={logoDark}
            className="logo-lg"
            alt="logo dark"
          />
        </div>
        <div className="logo-light">
          <Image
            width={30}
            height={30}
            src={logoLight}
            className="logo-sm"
            alt="logo sm"
          />
          <Image
            width={40}
            height={40}
            src={logoLight}
            className="logo-lg"
            alt="logo light"
          />
        </div>
        <h4>Cow or King Café</h4>
      </div>
    </a>
  );
};

export default LogoBox;
