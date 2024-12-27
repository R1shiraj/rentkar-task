// src/lib/assignmentUtils.ts
import { IDeliveryPartner } from "@/types/partner";
import { IOrder } from "@/types/order";

export function findBestPartner(order: IOrder, availablePartners: IDeliveryPartner[]): IDeliveryPartner | null {
  // Filter partners by area and current load
  const eligiblePartners = availablePartners.filter(partner => 
    partner.areas.includes(order.area) && 
    partner.currentLoad < 3 &&
    isTimeWithinShift(order.scheduledFor, partner.shift)
  );

  if (eligiblePartners.length === 0) return null;

  // Score partners based on various factors
  const scoredPartners = eligiblePartners.map(partner => ({
    partner,
    score: calculatePartnerScore(partner, order)
  }));

  // Sort by score and return the best match
  scoredPartners.sort((a, b) => b.score - a.score);
  return scoredPartners[0].partner;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculatePartnerScore(partner: IDeliveryPartner, order: IOrder): number {
  let score = 0;
  
  // Higher rating increases score
  score += partner.metrics.rating * 10;
  
  // Lower current load is better
  score += (3 - partner.currentLoad) * 5;
  
  // More completed orders indicates experience
  score += Math.min(partner.metrics.completedOrders / 100, 10);
  
  // Penalize for cancelled orders
  score -= partner.metrics.cancelledOrders;
  
  return score;
}

function isTimeWithinShift(scheduledTime: string, shift: { start: string; end: string }): boolean {
  const scheduled = new Date(`1970/01/01 ${scheduledTime}`);
  const shiftStart = new Date(`1970/01/01 ${shift.start}`);
  const shiftEnd = new Date(`1970/01/01 ${shift.end}`);
  
  return scheduled >= shiftStart && scheduled <= shiftEnd;
}