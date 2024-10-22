import { Coupon } from "../../types.ts";
import { useState } from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {

  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupons: Coupon) => {
    setCoupons(provCoupons => [...provCoupons, newCoupons]);
  }

  return { 
    coupons, 
    addCoupon, 
  };
};
