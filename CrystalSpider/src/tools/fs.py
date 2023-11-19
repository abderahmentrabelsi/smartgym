import os


def get_path_in_working_dir(path: str) -> str:
    return os.path.join(os.getcwd(), path)