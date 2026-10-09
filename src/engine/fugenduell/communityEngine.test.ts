import { describe, it, expect } from 'vitest';
import { ACTIONS, cover, emptyGround, startCommunity, playCommunity } from './communityEngine';
const ids = ['taraxacum-officinale', 'plantago-major', 'bryum-argenteum'];
describe('community deck', () => {
 it('starts with three persistent species and two copies of each card', () => {
  const g=startCommunity(ids, 5); expect(g.player.plants).toHaveLength(3); expect(emptyGround(g)).toBe(28);
  const cards=[...g.player.hand,...g.player.draw]; expect(cards).toHaveLength(12);
  Object.keys(ACTIONS).forEach(a=>expect(cards.filter(c=>c===a)).toHaveLength(2));
 });
 it('rejects duplicate species, banned species and invalid seeds',()=>{
  expect(()=>startCommunity([ids[0],ids[0],ids[1]])).toThrow();
  expect(()=>startCommunity([ids[0],ids[1],'ailanthus-altissima'])).toThrow();
  expect(()=>startCommunity(ids,NaN)).toThrow();
 });
 it('replays identically and conserves space, cards and resource bounds across seeds',()=>{
  for(let seed=0;seed<50;seed++){
   let a=startCommunity(ids,seed),b=startCommunity(ids,seed);
   for(let round=1;round<=6;round++){
    const before=JSON.stringify(a);const index=a.player.hand.findIndex(c=>ACTIONS[c].cost<=a.player.energy);
    const next=playCommunity(a,index,round%3,'pavement');expect(JSON.stringify(a)).toBe(before);
    b=playCommunity(b,index,round%3,'pavement');a=next;expect(a).toEqual(b);
    expect(cover(a.player)+cover(a.rival)).toBeLessThanOrEqual(100.00001);
    for(const side of [a.player,a.rival]){
     expect(side.hand.length+side.draw.length+side.discard.length).toBe(12);
     expect(side.energy).toBeGreaterThanOrEqual(0);
     side.plants.forEach(p=>{expect(p.cover).toBeGreaterThanOrEqual(0);expect(p.reserve).toBeGreaterThanOrEqual(0);});
    }
   }
   expect(a.winner).not.toBeNull();expect(()=>playCommunity(a,0,0,'wall')).toThrow();
  }
 });
 it('keeps unplayed cards and does not mutate the input on an invalid move',()=>{
  const g=startCommunity(ids);const hand=g.player.hand.slice();const next=playCommunity(g,0,0,'pavement');
  expect(next.player.hand.slice(0,2)).toEqual(hand.slice(1));
  expect(()=>playCommunity(g,99,0,'pavement')).toThrow();expect(g.player.hand).toEqual(hand);
 });
});
