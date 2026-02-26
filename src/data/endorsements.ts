import { EndorsementItem } from '../types/endorsement';

/**
 * 安利数据存储
 * 用户可以在这里填写具体的安利内容
 */
export const ENDORSEMENTS_DATA: EndorsementItem[] = [
  {
    id: '1',
    quote: '我不愿离开 我不愿存在\n我不愿活得过分实实在在\n我想要离开 我想要存在\n我想要死去 之后从头再来',
    source: '崔健《从头再来》',
    link: 'https://music.douban.com/subject/1394742/'
  },
  {
    id: '2',
    quote: '我行日夜向江海，枫叶芦花秋兴长。\n 长淮忽迷天远近，青山久与船低昂。\n寿州已见白石塔，短棹未转黄茅冈。\n波平风软望不到，故人久立烟苍茫。',
    source: '苏轼《出颍口初见淮山是日至寿州》',
    link: 'https://www.gushiwen.cn/shiwenv_377fb380c0e5.aspx'
  },
  {
    id: '3',
    quote: '岁岁年年风水都在改变\n有多少沧海一夜变成桑田\n在这个五千年的悠久历史里面\n成功与失败多少都有一点',
    source: '罗大佑《现象Ⅰ》',
    link: 'https://music.douban.com/subject/1417731/'
  },
  {
    id: '4',
    quote: '我忘却了所有悲剧，所见皆是奇迹。',
    source: '空洞骑士',
    link: 'https://en.wikipedia.org/wiki/Hollow_Knight'
  },
  {
    id: '5',
    quote: '这个世界冰冷而孤寂，这个游戏刚好能陪伴它。',
    source: '极乐迪斯科',
    link: 'https://en.wikipedia.org/wiki/Disco_Elysium'
  },
];

/**
 * 获取所有安利数据
 */
export const getAllEndorsements = (): EndorsementItem[] => {
  return [...ENDORSEMENTS_DATA];
};

/**
 * 根据ID获取安利项
 */
export const getEndorsementById = (id: string): EndorsementItem | null => {
  return ENDORSEMENTS_DATA.find(item => item.id === id) || null;
};

/**
 * 获取安利数据总数
 */
export const getEndorsementsCount = (): number => {
  return ENDORSEMENTS_DATA.length;
};