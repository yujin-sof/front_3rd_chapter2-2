import { useState } from "react";

export const useOpenProduct = () => {
    const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());  // 열려있는 상품의 ID들을 Set으로 관리합니다.

    // 특정 상품의 상세 정보를 열거나 닫는 함수.
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