import Image from "next/image";
import { CiSearch } from "react-icons/ci";
const SearchBar = () => {
  return (
    <>
      <div className="md:hidden bg-primary">
        <div className=" p-4 rounded-lg flex flex-col sm:items-start md:w-2/4 h-[120%]">
          <h2 className="text-3xl xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl font-geist font-semibold text-center sm:text-left md:text-left lg:text-left xl:text-left">
            De quoi avez vous envie <br className="sm:hidden lg:block" />
            aujourd'hui?
          </h2>
          <div className="border border-black rounded-md flex flex-row w-[100%] mt-8">
            <input
              type="text"
              placeholder="Recherche rapide"
              className="p-2 w-full rounded-l-md font-geist bg-white text-black"
            />
            <button className="bg-secondary w-12  border-l-black border-l rounded-r-md flex items-center justify-center cursor-pointer">
              <CiSearch size={30} />
            </button>
          </div>
          <div className="flex-1"></div>
          <p className="sm:text-sm md:text-lg font-geist mb-2 mt-6">
            Boire un verre ? Manger un bout ? Faire la fête ? Trouver un spot?
          </p>
        </div>
      </div>
      <div className="sm:hidden hidden md:block">
        <div
          className="relative w-full h-72 bg-cover bg-center flex items-center justify-end p-6"
          style={{
            backgroundImage: "url('/assets/img/wallpaper/accueil.jpg')",
          }}
        >
          <div className=" p-4 rounded-lg flex flex-col sm:items-start md:w-2/4 h-[120%] mt-[2%]">
            <h2 className="text-3xl xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl font-geist font-semibold text-center sm:text-left md:text-left lg:text-left xl:text-left">
              De quoi avez vous envie <br className="sm:hidden lg:block" />
              aujourd'hui?
            </h2>
           
            <div className="border border-black rounded-md flex flex-row w-[75%] mt-8">
              <input
                type="text"
                placeholder="Recherche rapide"
                className="p-2 w-full rounded-l-md font-geist bg-white text-black"
              />
              <button className="hover:bg-secondary bg-primary w-12  border-l-black border-l rounded-r-md flex items-center justify-center cursor-pointer">
                <CiSearch size={30} />
              </button>
            </div>
            <div className="flex-1"></div>
            <p className="sm:text-sm md:text-lg font-geist mb-2">
              Boire un verre ? Manger un bout ? Faire la fête ? Trouver un spot?
            </p>
          </div>
        </div>
      </div>
      </>
  );
};

export default SearchBar;
