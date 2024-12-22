export const createTime = (startDate: string) => {
    const grt = new Date(startDate);
    const now = new Date();
  
    const updateTime = () => {
      now.setTime(now.getTime() + 250);
      const days = (now.getTime() - grt.getTime()) / 1000 / 60 / 60 / 24;
      const dnum = Math.floor(days);
      const hours = (now.getTime() - grt.getTime()) / 1000 / 60 / 60 - 24 * dnum;
      const hnum = Math.floor(hours).toString().padStart(2, '0');
      const minutes = (now.getTime() - grt.getTime()) / 1000 / 60 - 24 * 60 * dnum - 60 * Number(hnum);
      const mnum = Math.floor(minutes).toString().padStart(2, '0');
      const seconds = (now.getTime() - grt.getTime()) / 1000 - 24 * 60 * 60 * dnum - 60 * 60 * Number(hnum) - 60 * Number(mnum);
      const snum = Math.round(seconds).toString().padStart(2, '0');
  
      return {
        days: dnum,
        hours: hnum,
        minutes: mnum,
        seconds: snum,
      };
    };
  
    return updateTime;
  };