from __future__ import print_function

import io
import os


def read_file(path_text):
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    requested = os.path.abspath(os.path.join(base_dir, path_text))
    if requested != base_dir and not requested.startswith(base_dir + os.sep):
        return "File access denied: path is outside the project."
    if not os.path.exists(requested):
        return "File not found: {0}".format(path_text)
    with io.open(requested, "r", encoding="utf-8") as target_file:
        return target_file.read()
