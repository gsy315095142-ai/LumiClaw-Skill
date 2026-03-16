# -*- coding: utf-8 -*-
"""
文件删除助手 - 用于安全删除指定文件
用法: python delete_file.py <文件路径>
"""

import os
import sys

def delete_file(file_path):
    """删除指定文件"""
    if not os.path.exists(file_path):
        print(f"INFO: 文件不存在 - {file_path}")
        return True
    
    try:
        os.remove(file_path)
        # 验证删除成功
        if not os.path.exists(file_path):
            print(f"SUCCESS: 已删除 {file_path}")
            return True
        else:
            print(f"ERROR: 删除失败，文件仍然存在 - {file_path}")
            return False
    except Exception as e:
        print(f"ERROR: 删除时出错 - {file_path} - {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python delete_file.py <文件路径>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    success = delete_file(file_path)
    sys.exit(0 if success else 1)
