import requests
import PIL
import matplotlib
import numpy as np
import sys

def verify():
    print(f"Python version: {sys.version}")
    
    try:
        import requests
        print(f"Requests version: {requests.__version__}")
    except ImportError:
        print("Requests NOT installed")
        
    try:
        from PIL import Image
        print(f"Pillow version: {PIL.__version__}")
    except ImportError:
        print("Pillow NOT installed")
        
    try:
        import matplotlib
        print(f"Matplotlib version: {matplotlib.__version__}")
    except ImportError:
        print("Matplotlib NOT installed")
        
    try:
        import numpy as np
        print(f"Numpy version: {np.__version__}")
    except ImportError:
        print("Numpy NOT installed")

if __name__ == "__main__":
    verify()
