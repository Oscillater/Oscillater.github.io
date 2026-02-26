/**
 * 安利页面功能类型定义
 */

export interface EndorsementItem {
  id: string;
  quote: string;      // 安利语录
  source: string;     // 出处来源
  link?: string;      // 跳转链接
  category?: string;  // 分类（为扩展预留）
  createdAt?: Date;  // 创建时间（为扩展预留）
}

export interface EndorsementFilter {
  category?: string;
  source?: string;
  hasLink?: boolean;
}

export interface EndorsementQuery {
  limit?: number;
  offset?: number;
  filter?: EndorsementFilter;
  sortBy?: 'createdAt' | 'source' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface EndorsementManager {
  getAll(): EndorsementItem[];
  getRandom(): EndorsementItem | null;
  getById(id: string): EndorsementItem | null;
  query(query: EndorsementQuery): EndorsementItem[];
  add(item: Omit<EndorsementItem, 'id' | 'createdAt'>): EndorsementItem;
  update(id: string, updates: Partial<EndorsementItem>): EndorsementItem | null;
  delete(id: string): boolean;
  count(): number;
}

export interface UseEndorsementsReturn {
  endorsements: EndorsementItem[];
  loading: boolean;
  error: string | null;
  getRandomEndorsement: () => EndorsementItem | null;
  getEndorsementById: (id: string) => EndorsementItem | null;
}

export interface UseRandomEndorsementReturn {
  endorsement: EndorsementItem | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}