import sys
import os

path = '/home/manticha/manticha'
if path not in sys.path:
    sys.path.insert(0, path)

from dotenv import load_dotenv
load_dotenv(os.path.join(path, '.env'))

from app import app as application
