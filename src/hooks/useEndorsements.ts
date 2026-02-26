import { useState, useEffect, useCallback } from 'react';
import { EndorsementItem, UseEndorsementsReturn, UseRandomEndorsementReturn } from '../types/endorsement';
import { getEndorsementManager } from '../services/endorsementService';

/**
 * 安利数据管理 Hook
 * 提供安利数据的增删改查功能
 */
export const useEndorsements = (): UseEndorsementsReturn => {
  const [endorsements, setEndorsements] = useState<EndorsementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  const loadEndorsements = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const manager = getEndorsementManager();
      const data = manager.getAll();
      setEndorsements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load endorsements');
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取随机安利
  const getRandomEndorsement = useCallback((): EndorsementItem | null => {
    try {
      const manager = getEndorsementManager();
      return manager.getRandom();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get random endorsement');
      return null;
    }
  }, []);

  // 根据ID获取安利
  const getEndorsementById = useCallback((id: string): EndorsementItem | null => {
    try {
      const manager = getEndorsementManager();
      return manager.getById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get endorsement by ID');
      return null;
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadEndorsements();
  }, [loadEndorsements]);

  return {
    endorsements,
    loading,
    error,
    getRandomEndorsement,
    getEndorsementById,
  };
};

/**
 * 随机安利 Hook
 * 专门用于获取和管理随机安利内容
 */
export const useRandomEndorsement = (): UseRandomEndorsementReturn => {
  const [endorsement, setEndorsement] = useState<EndorsementItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取随机安利
  const refresh = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const manager = getEndorsementManager();
      const randomEndorsement = manager.getRandom();

      if (randomEndorsement) {
        setEndorsement(randomEndorsement);
      } else {
        setError('No endorsements available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get random endorsement');
      setEndorsement(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始获取一个随机安利
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    endorsement,
    loading,
    error,
    refresh,
  };
};

export default useEndorsements;