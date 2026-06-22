import sys
import os

# ============================================================
# PythonAnywhere WSGI fayli
# "SIZNING_USERNAMENGIZ" ni o'zingizning username bilan almashtiring!
# ============================================================

path = '/home/SIZNING_USERNAMENGIZ/manticha'
if path not in sys.path:
    sys.path.insert(0, path)

from dotenv import load_dotenv
load_dotenv(os.path.join(path, '.env'))

from app import app as application
