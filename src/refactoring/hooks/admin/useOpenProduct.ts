import { useState } from "react";

export const useOpenProduct = () => {
    const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());  

    function toggleProductAccordion (productId: string) {
        setOpenProductIds(prev => {
            const newSet = new Set(prev);
            newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
            return newSet;
        });
    };

    return {
        toggleProductAccordion,
        openProductIds,
    }

} 