import { EndorsementItem, EndorsementManager, EndorsementQuery, EndorsementFilter } from '../types/endorsement';
import { ENDORSEMENTS_DATA } from '../data/endorsements';

/**
 * Fisher-Yates 洗牌算法实现
 * 用于真正的随机选择
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 静态安利管理器实现
 * 基于内存数据的管理服务
 */
export class StaticEndorsementManager implements EndorsementManager {
  private endorsements: EndorsementItem[];
  private lastRandomIndex: number = -1;
  private shuffledPool: EndorsementItem[] = [];

  constructor(data: EndorsementItem[] = []) {
    this.endorsements = [...data];
    this.resetShuffledPool();
  }

  /**
   * 重置洗牌池
   */
  private resetShuffledPool(): void {
    this.shuffledPool = fisherYatesShuffle(this.endorsements);
    this.lastRandomIndex = -1;
  }

  /**
   * 获取所有安利项
   */
  getAll(): EndorsementItem[] {
    return [...this.endorsements];
  }

  /**
   * 随机获取一个安利项（避免重复）
   */
  getRandom(): EndorsementItem | null {
    if (this.endorsements.length === 0) {
      return null;
    }

    // 如果只有一个安利项，直接返回
    if (this.endorsements.length === 1) {
      return this.endorsements[0];
    }

    // 如果洗牌池用完了，重新洗牌
    if (this.lastRandomIndex >= this.shuffledPool.length - 1) {
      this.resetShuffledPool();
    }

    // 获取下一个随机项
    this.lastRandomIndex++;
    return this.shuffledPool[this.lastRandomIndex];
  }

  /**
   * 根据ID获取安利项
   */
  getById(id: string): EndorsementItem | null {
    return this.endorsements.find(item => item.id === id) || null;
  }

  /**
   * 查询安利项
   */
  query(query: EndorsementQuery): EndorsementItem[] {
    let filtered = [...this.endorsements];

    // 应用过滤器
    if (query.filter) {
      const { category, source, hasLink } = query.filter;

      if (category) {
        filtered = filtered.filter(item => item.category === category);
      }

      if (source) {
        filtered = filtered.filter(item =>
          item.source.toLowerCase().includes(source.toLowerCase())
        );
      }

      if (typeof hasLink === 'boolean') {
        filtered = filtered.filter(item =>
          hasLink ? !!item.link : !item.link
        );
      }
    }

    // 排序
    if (query.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[query.sortBy!];
        let bValue: any = b[query.sortBy!];

        if (query.sortBy === 'createdAt') {
          aValue = aValue ? aValue.getTime() : 0;
          bValue = bValue ? bValue.getTime() : 0;
        }

        if (query.sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    // 分页
    const offset = query.offset || 0;
    const limit = query.limit || filtered.length;

    return filtered.slice(offset, offset + limit);
  }

  /**
   * 添加新的安利项
   */
  add(item: Omit<EndorsementItem, 'id' | 'createdAt'>): EndorsementItem {
    const newItem: EndorsementItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    this.endorsements.push(newItem);
    this.resetShuffledPool();
    return newItem;
  }

  /**
   * 更新安利项
   */
  update(id: string, updates: Partial<EndorsementItem>): EndorsementItem | null {
    const index = this.endorsements.findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }

    this.endorsements[index] = {
      ...this.endorsements[index],
      ...updates,
    };

    this.resetShuffledPool();
    return this.endorsements[index];
  }

  /**
   * 删除安利项
   */
  delete(id: string): boolean {
    const index = this.endorsements.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    this.endorsements.splice(index, 1);
    this.resetShuffledPool();
    return true;
  }

  /**
   * 获取总数
   */
  count(): number {
    return this.endorsements.length;
  }

  /**
   * 重新加载数据
   */
  reloadData(data: EndorsementItem[]): void {
    this.endorsements = [...data];
    this.resetShuffledPool();
  }
}

/**
 * 全局安利管理器单例
 */
export const endorsementManager = new StaticEndorsementManager(ENDORSEMENTS_DATA);

/**
 * 获取安利管理器实例
 */
export const getEndorsementManager = (): EndorsementManager => {
  return endorsementManager;
};