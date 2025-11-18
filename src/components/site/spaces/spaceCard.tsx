import Link from "next/link";

interface SpaceCardProps {
  imgSrc: string;
  title: string;
  description: string;
  className?: string;
  link: string;
}

const SpaceCard = ({
  imgSrc,
  title,
  description,
  link,
  className = "",
}: SpaceCardProps) => {
  return (
    <div className={`service__card services__2_card ${className}`}>
      <img src={imgSrc} alt={title} />
      <h3 className="t__28">{title}</h3>
      <p>{description}</p>
      <Link href={link} className="d-flex align-items-center">
        <span>Plus de détails</span>
        <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default SpaceCard;
