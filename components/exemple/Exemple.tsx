import Image from "next/image";

interface ExempleProps {
  imageSrc: string;
  style?: React.CSSProperties;
  position?: "left" | "right";
}

const Exemple = ({ imageSrc, style, position = "left" }: ExempleProps) => {
  return (
    <div
      className={`w-full md:w-5/9 mx-auto md:mx-0 flex md:block justify-center h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] ${
        position === "right" ? "md:ml-auto" : ""
      }`}
      style={{ position: "relative", ...style }}
    >
      {/* Ajout de relative ici */}
      <div className="w-full h-full relative">
        <Image
          src={imageSrc}
          alt="exemple"
          fill
          className={`rounded-md md:rounded-none ${
            position === "left" ? "md:rounded-r-md" : "md:rounded-l-md"
          }`}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default Exemple;