import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import SearchBar from "@/components/searchBar/SearchBar";
import Link from "next/link";
import Glass from "@/components/icon/Glass";
import House from "@/components/icon/House";
import Event from "@/components/icon/Event";
import Restaurant from "@/components/icon/Restaurant";
import Spot from "@/components/icon/Spot";
import Exemple from "@/components/exemple/Exemple";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
        <main className="flex flex-col">
      <div className="border border-gray-200">
       <SearchBar/> 
      </div>
    
      <div className="flex flex-row gap-12 justify-start md:justify-center mt-5 font-geist font-normal overflow-x-auto pb-4 md:overflow-x-visible md:pb-0 mx-2 md:mx-0">
        <Link href="/bars">
        <div role="button" tabIndex={0} className="flex flex-col cursor-pointer gap-2 items-center border border-primary rounded-md p-2 w-20 sm:w-24 md:w-28 lg:w-32 hover:bg-secondary transition-all duration-300 shadow-md flex-shrink-0">
          <Glass width={60} height={60}/>
          <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">Bar</p>
        </div>
        </Link>
        <Link href="/hotels">
        <div role="button" tabIndex={0} className="flex flex-col cursor-pointer gap-2 items-center border border-primary rounded-md p-2 w-20 sm:w-24 md:w-28 lg:w-32 hover:bg-secondary transition-all duration-300 shadow-md flex-shrink-0">
          <House width={60} height={60} />
          <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">Hotel</p>
        </div>
        </Link>
        <Link href="/evenements">
        <div role="button" tabIndex={0} className="flex flex-col cursor-pointer gap-2 items-center border border-primary rounded-md p-2 w-20 sm:w-24 md:w-28 lg:w-32 hover:bg-secondary transition-all duration-300 shadow-md flex-shrink-0">
          <Event width={60} height={60}/>
          <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">Traiteur</p>
        </div>
        </Link>
        <Link href="/restaurants">
        <div role="button" tabIndex={0} className="flex flex-col cursor-pointer gap-2 items-center border border-primary rounded-md p-2 w-20 sm:w-24 md:w-28 lg:w-32 hover:bg-secondary transition-all duration-300 shadow-md flex-shrink-0">
          <Restaurant width={60} height={60}/>
          <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">Restaurant</p>
        </div>
        </Link>
        <Link href="/protected/spot">
        <div role="button" tabIndex={0} className="flex flex-col cursor-pointer gap-2 items-center border border-primary rounded-md p-2 w-20 sm:w-24 md:w-28 lg:w-32 hover:bg-secondary transition-all duration-300 shadow-md flex-shrink-0">
          <Spot width={60} height={60}/> 
          <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">Spot</p>
        </div>
        </Link>
      </div>
      <div className="bg-primary w-[90%] h-auto justify-center items-center flex flex-col gap-6 font-geist font-normal rounded-md p-4 px-12 text-sm my-12 mx-auto text-black shadow-md md:w-[70%]">
        <p className="text-center">Avec <b>Horeca Seek</b>, explorez, partagez et vivez vos expériences culinaires ensemble !</p>
        <p className="text-center">Restaurants, bars, hôtels, événements ou même ces petits spots méconnus que vous adorez… Ne gardez pas vos pépites pour vous ! Partagez-les avec la communauté Horeca Seek et faites-les découvrir aux autres passionnés.</p>
        <p className="text-center">Rejoignez la tribu des <b>HorecaSeekers</b>, échangez vos meilleures adresses et vivez la gastronomie autrement!</p>
        <p className="text-center">Parce que les bons plans sont encore meilleurs quand ils sont partagés.</p>
      </div>
      <div className="overflow-hidden mx-2 md:mx-0 my-4 flex flex-col md:flex-row items-center gap-3 md:gap-8">
      <p className="md:hidden">"Le resto est top et class "</p>

<Exemple imageSrc="/assets/img/card/restaurant-exemple.jpg" position="left" />
<p className="hidden md:block">"Le resto est top et class "</p>

      </div>
      <div className="overflow-hidden mx-2 md:mx-0 my-4 flex flex-col md:flex-row items-center gap-3 md:gap-8">
<p className="hidden md:block">"Le resto est top et class "</p>
<Exemple imageSrc="/assets/img/card/bar-exemple.jpg" position="right" />

      </div>
      <div className="overflow-hidden mx-2 md:mx-0 my-4 flex flex-col md:flex-row items-center gap-3 md:gap-8">
<Exemple imageSrc="/assets/img/card/event-exemple.jpg" position="left" />
<p className="hidden md:block">"Le resto est top et class "</p>

      </div>
      <div className="overflow-hidden mx-2 md:mx-0 my-4 flex flex-col md:flex-row items-center gap-3 md:gap-8">
        <p className="hidden md:block">"Le resto est top et class "</p>

<Exemple imageSrc="/assets/img/card/spot-exemple.jpg" position="right" />
      </div>
      <div className="overflow-hidden mx-2 md:mx-0 my-4 flex flex-col md:flex-row items-center gap-3 md:gap-8">
<Exemple imageSrc="/assets/img/card/hotel-exemple.jpg" position="left" />
<p className="hidden md:block">"Le resto est top et class "</p>

      </div>
    </main>
  );
}
