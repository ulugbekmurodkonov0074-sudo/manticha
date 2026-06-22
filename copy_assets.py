import os
import shutil

images_dir = r"c:\Users\Hp\Desktop\manticha\static\images"
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

src_zu_zuki = r"C:\Users\Hp\.gemini\antigravity\brain\d03362c9-04ce-49dd-a064-02112aa316a5\zu_zuki_salat_1782118986959.png"
dst_zu_zuki = os.path.join(images_dir, "zu_zuki.png")

src_qara_manti = r"C:\Users\Hp\.gemini\antigravity\brain\d03362c9-04ce-49dd-a064-02112aa316a5\qara_manti_1782119044411.png"
dst_qara_manti = os.path.join(images_dir, "qara_manti.png")

try:
    if os.path.exists(src_zu_zuki):
        shutil.copy(src_zu_zuki, dst_zu_zuki)
        print("Copied zu_zuki.png successfully")
    else:
        print("Source zu_zuki not found")
        
    if os.path.exists(src_qara_manti):
        shutil.copy(src_qara_manti, dst_qara_manti)
        print("Copied qara_manti.png successfully")
    else:
        print("Source qara_manti not found")
        
    print("Files in static/images:", os.listdir(images_dir))
except Exception as e:
    print("Error copying assets:", str(e))
