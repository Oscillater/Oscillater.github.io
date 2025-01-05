import os

def remove_spaces_in_filenames(folder_path):
    # 获取文件夹中的所有文件
    for filename in os.listdir(folder_path):
        # 构造完整的文件路径
        old_file_path = os.path.join(folder_path, filename)
        
        # 检查是否是文件（不考虑文件夹）
        if os.path.isfile(old_file_path):
            # 去掉文件名中的空格
            new_filename = filename.replace(' ', '')
            new_file_path = os.path.join(folder_path, new_filename)
            
            # 重命名文件
            os.rename(old_file_path, new_file_path)
            print(f'Renamed: {old_file_path} -> {new_file_path}')

# 使用示例
folder_path = './'
remove_spaces_in_filenames(folder_path)