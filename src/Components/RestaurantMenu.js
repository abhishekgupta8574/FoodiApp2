import { Link, useParams } from "react-router-dom";
import useRestaurantMenu from "../Utils/useRestaurantMenu";
import RestaurantCategory from "./RestaurantCategory";
import OfferCard from "./OfferCard";
import RestaurantHeader from "./RestaurantHeader";
import RestaurantMenuShimmer from "../Shimmers/RestaurantMenuShimmer";
import { useEffect, useState } from "react";
import { REST_MENU_API } from "../Utils/constants";

const RestaurantMenu = () => {
  //UseParams to fetch dynamic from router child
  const { id } = useParams();
  const[resMenu,setRestMenu]=useState([]);
  const[restInfoData,setRestInfoData]=useState([]);
  const[restOffData,setRestOffData]=useState([]);
  
  //CUSTOM HOOK TO FETCH THE ALL INFO OF THE Rest
  //const { restInfo, restMenu, restOff } = useRestaurantMenu(id);
  // console.log("menu data",restMenu);
  // console.log("restInfo",restInfo);
  const fetchData = async () => {
    const data = await fetch(REST_MENU_API + id);
    const json = await data.json();
    //console.log("json", json)
    const Category =
      json?.data?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
        (cat) =>
          cat?.card?.card?.["@type"] ===
          "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
      ) ||
      json?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
        (cat) =>
          cat?.card?.card?.["@type"] ===
          "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
      );
    setRestMenu(Category);
      console.log("rasmanu",resMenu)
    setRestInfoData(
      json?.data?.cards[0]?.card?.card?.info ||
        json?.data?.cards[2]?.card?.card?.info
    );

    setRestOffData(
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.offers ||
        json?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers
    );
  };
  
  useEffect(()=>{
    fetchData().catch((e)=>{console.log(e)});
    
  },[])

  //Have to do this before destructing the data (we dont kn how much time it take to fetch so it will return.. is not defined)
  if (!restInfoData||restInfoData.length===0 ){
    return <RestaurantMenuShimmer />;
  }
  const linksCss =
    "lg:text-[10px] md:text-[10px] text-[8px] text-gray-400 font-bold pr-1";

  return (
    <div>
      <div className="lg:w-8/12 md:w-8/12 w-10/12 mx-auto lg:pt-5 md:pt-4 pt-2">
        <Link to={"/"}>
          <span className={linksCss}>Home</span>
        </Link>
        <span className={linksCss}>/</span>
        <span className={linksCss}>Pune</span>
        <span className={linksCss}>/</span>
        <span className="lg:text-[10px] md:text-[10px] text-[8px] text-gray-700 font-bold pr-1">
          {restInfoData.name}
        </span>
      </div>
      <div className="h-full lg:my-4 md:my-4 my-2 lg:w-8/12 md:w-8/12 w-10/12 mx-auto">
        <RestaurantHeader restInfoData={restInfoData} />

        <div className="flex justify-start items-center flex-row gap-1 auto overflow-x-scroll lg:space-x-4 lg:p-4 md:space-x-4 md:p-4 space-x-2 p-2">
          {restOffData.map((off) => (
            <OfferCard offdata={off} key={off?.info?.offerIds?.[0]} />
          ))}
        </div>

        {resMenu && resMenu.map((cat, index) => (
          <RestaurantCategory data={cat?.card?.card} key={index} />
        ))}

        <div className="bgc flex justify-start items-start flex-col lg:pt-6 lg:pb-32 lg:px-4 lg:py-6 md:pt-6 md:pb-32 md:px-4 md:py-6 pt-3 pb-20 px-2 bg-gray-100">
          <div>
            <span className="text-sm font-extrabold text-gray-500">
              {restInfoData?.name}
            </span>
            <br></br>
            <span className="text-sm font-bold text-gray-400">
              (Outlet: {restInfoData?.areaName})
            </span>
          </div>
          <span className="text-xs font-medium text-gray-400 pt-3">
            <i className="ri-map-pin-line"></i> {restInfoData?.labels?.[1]?.message}
          </span>
        </div>
      </div>
    </div>
  );
};
export default RestaurantMenu;
