import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo context để lưu trạng thái follow
interface FollowContextType {
  following: Record<string, boolean>; // Lưu trạng thái follow cho mỗi người dùng
  setFollowing: (username: string, following: boolean) => void;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

// Cung cấp context cho toàn bộ ứng dụng
export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [following, setFollowingState] = useState<Record<string, boolean>>({});

  // Khi trang được tải lại, lấy trạng thái follow từ localStorage
  useEffect(() => {
    const savedFollowing = localStorage.getItem("followingData");
    if (savedFollowing) {
      setFollowingState(JSON.parse(savedFollowing)); // Cập nhật lại trạng thái follow từ localStorage
    }
  }, []);

  const setFollowing = (username: string, following: boolean) => {
    setFollowingState((prevFollowing) => {
      const updatedFollowing = { ...prevFollowing, [username]: following };
      localStorage.setItem("followingData", JSON.stringify(updatedFollowing)); // Lưu vào localStorage
      return updatedFollowing;
    });
  };

  return (
    <FollowContext.Provider value={{ following, setFollowing }}>
      {children}
    </FollowContext.Provider>
  );
};

// Hook để sử dụng FollowContext
export const useFollow = (): FollowContextType => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error("useFollow must be used within a FollowProvider");
  }
  return context;
};
