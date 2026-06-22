import shutil
import os

base = r'c:\Users\Hp\Desktop\manticha'
dest = os.path.join(base, 'static', 'images')

os.makedirs(dest, exist_ok=True)

# O'chirish va tozalash (agar kerak bo'lsa)
copies = [
    # media/ -> choylar
    ('media/image.png', 'green_tea.png'),
    ('media/image copy.png', 'black_tea.png'),
    ('media/image copy 2.png', 'lemon_tea.png'), # lemon va novotli choylar uchun ishlatsa bo'ladi
    ('media/image copy 3.png', 'black_tea_novot.png'),
    ('media/image copy 4.png', 'green_tea_novot.png'),
    
    # media1/ -> napitki (suvlar)
    ('media1/image.png', 'bonaqua_gas.png'),
    ('media1/image copy.png', 'cola_draft.png'),
    ('media1/image copy 2.png', 'cola_bottle.png'),
    ('media1/image copy 3.png', 'bonaqua_nogas.png'),
    
    # media2/ -> souslar
    ('media2/image.png', 'smetana.png'),
    ('media2/image copy.png', 'sirka.png'),
    ('media2/image copy 2.png', 'achchiq.png'),
    ('media2/image copy 3.png', 'qatiq.png'),
    
    # media3/ -> non
    ('media3/image.png', 'kulcha_non.png'),
    
    # media4/ -> ovqatlar (blyudolar)
    ('media4/image.png', 'qovoqli_manti.png'),
    ('media4/image copy.png', 'kokatli_manti.png'),
    ('media4/image copy 2.png', 'goshtli_manti.png'),
]

# Ba'zi qo'shimcha choy rasmlari uchun nusxalar yaratamiz (skrinshotdagi choylar uchun)
# Limonli va novotli choylar uchun ham rasmlarni moslaymiz:
extra_copies = [
    ('lemon_tea.png', 'black_tea_lemon_novot.png'),
    ('lemon_tea.png', 'green_tea_lemon_novot.png'),
]

for src_rel, dst_name in copies:
    src = os.path.join(base, src_rel)
    dst = os.path.join(dest, dst_name)
    try:
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f'Muvaffaqiyatli nusxalandi: {src_rel} -> {dst_name}')
        else:
            print(f'Fayl topilmadi: {src}')
    except Exception as e:
        print(f'Xato {src_rel} nusxalashda: {e}')

for src_name, dst_name in extra_copies:
    src = os.path.join(dest, src_name)
    dst = os.path.join(dest, dst_name)
    try:
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f'Qo\'shimcha nusxalandi: {src_name} -> {dst_name}')
    except Exception as e:
        print(f'Xato {src_name} -> {dst_name} nusxalashda: {e}')

print('Nusxalash yakunlandi.')
