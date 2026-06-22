import os
import json
import threading
from flask import Flask, request, jsonify, render_template, send_from_directory
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from dotenv import load_dotenv

# Load env variables
load_dotenv()

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
WEB_APP_URL = os.getenv('WEB_APP_URL', '')
SECRET_KEY = os.getenv('SECRET_KEY', 'manticha_secret_key')

# Initialize Telebot
bot = telebot.TeleBot(BOT_TOKEN, parse_mode='HTML')

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = SECRET_KEY

# Automatic media assets copy
def auto_copy_assets():
    import shutil
    base = os.path.dirname(os.path.abspath(__file__))
    dest = os.path.join(base, 'static', 'images')
    os.makedirs(dest, exist_ok=True)
    
    copies = [
        ('media/image.png', 'green_tea.png'),
        ('media/image copy.png', 'black_tea.png'),
        ('media/image copy 2.png', 'lemon_tea.png'),
        ('media/image copy 3.png', 'black_tea_novot.png'),
        ('media/image copy 4.png', 'green_tea_novot.png'),
        ('media1/image.png', 'bonaqua_gas.png'),
        ('media1/image copy.png', 'cola_draft.png'),
        ('media1/image copy 2.png', 'cola_bottle.png'),
        ('media1/image copy 3.png', 'bonaqua_nogas.png'),
        ('media2/image.png', 'smetana.png'),
        ('media2/image copy.png', 'sirka.png'),
        ('media2/image copy 2.png', 'achchiq.png'),
        ('media2/image copy 3.png', 'qatiq.png'),
        ('media3/image.png', 'kulcha_non.png'),
        ('media4/image.png', 'qovoqli_manti.png'),
        ('media4/image copy.png', 'kokatli_manti.png'),
        ('media4/image copy 2.png', 'goshtli_manti.png'),
    ]
    
    for src_rel, dst_name in copies:
        src = os.path.join(base, src_rel)
        dst = os.path.join(dest, dst_name)
        if os.path.exists(src):
            try:
                shutil.copy2(src, dst)
            except Exception as e:
                print(f"Error copying {src_rel}: {e}")
                
    # Extra copies for tea variations
    for extra_dst in ['black_tea_lemon_novot.png', 'green_tea_lemon_novot.png']:
        src = os.path.join(dest, 'lemon_tea.png')
        dst = os.path.join(dest, extra_dst)
        if os.path.exists(src):
            try:
                shutil.copy2(src, dst)
            except Exception as e:
                print(f"Error copying extra {extra_dst}: {e}")

try:
    auto_copy_assets()
except Exception as e:
    print(f"Asset copy failed: {e}")


# File paths for simple JSON database persistence
USERS_DB = 'users.json'
ORDERS_DB = 'orders.json'

def load_db(filepath):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_db(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Load database on startup
users_data = load_db(USERS_DB)
orders_data = load_db(ORDERS_DB)

# Product catalog data structured by category
PRODUCTS = {
    "blyudo": [
        {"id": "m1", "name_uz": "Qovoqli manti", "name_ru": "Манты с тыквой", "price": 6000, "weight": "55 g", "image": "qovoqli_manti.png", "desc_uz": "Qovoqli maxsus manti", "desc_ru": "Особые манты с тыквой"},
        {"id": "m2", "name_uz": "Ko'katli va go'shtli manti", "name_ru": "Манты с зеленью и мясом", "price": 8000, "weight": "55 g", "image": "kokatli_manti.png", "desc_uz": "Ko'katlar va yangi go'shtli manti", "desc_ru": "Манты с зеленью и нежным мясом"},
        {"id": "m3", "name_uz": "Go'shtli manti", "name_ru": "Манты с мясом", "price": 9500, "weight": "55 g", "image": "goshtli_manti.png", "desc_uz": "Sof go'shtli toza manti", "desc_ru": "Классические манты с сочным мясом"}
    ],
    "salat": [
        {"id": "s1", "name_uz": "Zu Zuki Salat", "name_ru": "Салат Зу Зуки", "price": 11000, "weight": "150 g", "image": "zu_zuki.png", "desc_uz": "Yengil va mazali salat", "desc_ru": "Легкий и вкусный салат"},
        {"id": "s2", "name_uz": "Achichuk Salat", "name_ru": "Салат Ачичук", "price": 10000, "weight": "150 g", "image": "achichuk.png", "desc_uz": "Pomidor va piyozdan achchiq salat", "desc_ru": "Острый салат из помидоров и лука"}
    ],
    "non": [
        {"id": "n1", "name_uz": "Kulcha Non", "name_ru": "Кульча Нон", "price": 3000, "weight": "50 g", "image": "kulcha_non.png", "desc_uz": "Kichkina shirin kulcha non", "desc_ru": "Маленькая лепешка кульча"}
    ],
    "napitki": [
        {"id": "d1", "name_uz": "Gazlangan suv BonAqua 0.5", "name_ru": "Газированная вода BonAqua 0.5", "price": 5000, "weight": "500 g", "image": "bonaqua_gas.png", "desc_uz": "Salqin gazlangan mineral suv", "desc_ru": "Освежающая газированная вода"},
        {"id": "d2", "name_uz": "Coca-Cola 0.4 razliv", "name_ru": "Coca-Cola 0.4 разлив", "price": 10000, "weight": "400 g", "image": "cola_draft.png", "desc_uz": "Muzdek quyma Coca-Cola", "desc_ru": "Ледяная разливная Coca-Cola"},
        {"id": "d3", "name_uz": "Coca-Cola 0.5", "name_ru": "Coca-Cola 0.5 бутылка", "price": 12000, "weight": "500 g", "image": "cola_bottle.png", "desc_uz": "Coca-Cola klassik shisha", "desc_ru": "Классическая Coca-Cola"},
        {"id": "d4", "name_uz": "Gazlanmagan suv BonAqua 0.5", "name_ru": "Негазированная вода BonAqua 0.5", "price": 5000, "weight": "500 g", "image": "bonaqua_nogas.png", "desc_uz": "Tiniq tabiiy suv", "desc_ru": "Чистая природная вода"}
    ],
    "choy": [
        {"id": "t1", "name_uz": "Qora choy", "name_ru": "Черный чай", "price": 5000, "weight": "350 g", "image": "black_tea.png", "desc_uz": "Klassik achchiq qora choy", "desc_ru": "Классический черный чай"},
        {"id": "t2", "name_uz": "Qora choy limon va novotli", "name_ru": "Черный чай с лимоном и наватом", "price": 7000, "weight": "350 g", "image": "black_tea_lemon_novot.png", "desc_uz": "Limonli va novotli shirin qora choy", "desc_ru": "Черный чай с лимоном и наватом"},
        {"id": "t3", "name_uz": "Qora choy novotli", "name_ru": "Черный чай с наватом", "price": 7000, "weight": "350 g", "image": "black_tea_novot.png", "desc_uz": "Novotli shirin qora choy", "desc_ru": "Черный чай с наватом"},
        {"id": "t4", "name_uz": "Ko'k choy novotli", "name_ru": "Зеленый чай с наватом", "price": 7000, "weight": "350 g", "image": "green_tea_novot.png", "desc_uz": "Novotli shirin ko'k choy", "desc_ru": "Зеленый чай с наватом"},
        {"id": "t5", "name_uz": "Ko'k choy limon va novotli", "name_ru": "Зеленый чай с лимоном и наватом", "price": 7000, "weight": "350 g", "image": "green_tea_lemon_novot.png", "desc_uz": "Limonli va novotli shirin ko'k choy", "desc_ru": "Зеленый чай с лимоном и наватом"},
        {"id": "t6", "name_uz": "Ko'k choy", "name_ru": "Зеленый чай", "price": 5000, "weight": "350 g", "image": "green_tea.png", "desc_uz": "Tinchlantiruvchi ko'k choy", "desc_ru": "Успокаивающий зеленый чай"}
    ],
    "soyus": [
        {"id": "so1", "name_uz": "Smetana", "name_ru": "Сметана", "price": 3000, "weight": "50 g", "image": "smetana.png", "desc_uz": "Yog'li smetana", "desc_ru": "Густая сметана"},
        {"id": "so2", "name_uz": "Sirka", "name_ru": "Уксус", "price": 3000, "weight": "50 g", "image": "sirka.png", "desc_uz": "Manti uchun sirka sousi", "desc_ru": "Уксусный соус для мантов"},
        {"id": "so3", "name_uz": "Achchiq", "name_ru": "Острый соус", "price": 3000, "weight": "50 g", "image": "achchiq.png", "desc_uz": "Achchiq qalampir sousi", "desc_ru": "Острый перечный соус"},
        {"id": "so4", "name_uz": "Qatiq", "name_ru": "Кефир", "price": 3000, "weight": "50 g", "image": "qatiq.png", "desc_uz": "Yangi quyuq qatiq", "desc_ru": "Свежий густой кефир"}
    ]
}

# Restaurant Branches Data
BRANCHES = [
    {
        "id": "b1",
        "name_uz": "01 Manticha Qorasaroy",
        "name_ru": "01 Manticha Qorasaroy",
        "address_uz": "Karasaroy ko'chasi, 6, Toshkent",
        "address_ru": "Карасарайская улица, 6, Ташкент",
        "hours": "09:00 - 00:00",
        "lat": 41.3325,
        "lng": 69.2612
    },
    {
        "id": "b2",
        "name_uz": "02 Manticha Qatortol",
        "name_ru": "02 Manticha Qatortol",
        "address_uz": "Katartal 1-tor ko'chasi, 60/3, Chilonzor tumani, Toshkent",
        "address_ru": "1-й проезд Катартал, 60/3, Чиланзарский район, Ташкент",
        "hours": "09:00 - 20:00",
        "lat": 41.2892,
        "lng": 69.2185
    }
]

# Bot Localization Strings
LOCALIZATION = {
    'uz': {
        'welcome': "<b>Xush kelibsiz! Tilni tanlang:</b>",
        'language_selected': "Tizim tili O'zbekchaga o'zgartirildi! 🇺🇿",
        'open_mini_app': "Mini Appni ochish 📱",
        'change_language': "Tilni o'zgartirish 🌐",
        'main_menu_text': "<b>Manticha botiga xush kelibsiz!</b>\n\nQuyidagi tugma orqali Mini App-ni ochishingiz va mazali manti hamda salatlar buyurtma qilishingiz mumkin.",
        'order_title': "Buyurtma Qabul Qilindi! 🎉",
        'order_details': "<b>Yangi buyurtma kelib tushdi!</b>\n\n👤 <b>Mijoz:</b> {name}\n📞 <b>Telefon:</b> {phone}\n🚚 <b>Tur:</b> {delivery_type}\n📍 <b>Manzil:</b> {address}\n🗺️ <b>Xarita:</b> {map_link}\n🏢 <b>Podezd:</b> {entrance}, <b>Qavat:</b> {floor}, <b>Xonadon:</b> {apartment}\n💬 <b>Kuryerga izoh:</b> {comment}\n\n📋 <b>Savatdagilar:</b>\n{items_str}\n💰 <b>Jami summa:</b> {total_price:,} UZS\n\n<i>Kuryerimiz tez fursatda siz bilan bog'lanadi!</i>"
    },
    'ru': {
        'welcome': "<b>Добро пожаловать! Выберите язык:</b>",
        'language_selected': "Язык системы изменен на Русский! 🇷🇺",
        'open_mini_app': "Открыть Mini App 📱",
        'change_language': "Сменить язык 🌐",
        'main_menu_text': "<b>Добро пожаловать в бот Manticha!</b>\n\nВы можете открыть Mini App с помощью кнопки ниже и заказать вкусные манты и салаты.",
        'order_title': "Заказ Принят! 🎉",
        'order_details': "<b>Поступил новый заказ!</b>\n\n👤 <b>Клиент:</b> {name}\n📞 <b>Телефон:</b> {phone}\n🚚 <b>Тип:</b> {delivery_type}\n📍 <b>Адрес:</b> {address}\n🗺️ <b>Карта:</b> {map_link}\n🏢 <b>Подъезд:</b> {entrance}, <b>Этаж:</b> {floor}, <b>Кв:</b> {apartment}\n💬 <b>Комментарий курьеру:</b> {comment}\n\n📋 <b>Корзина:</b>\n{items_str}\n💰 <b>Итоговая сумма:</b> {total_price:,} UZS\n\n<i>Наш курьер свяжется с вами в ближайшее время!</i>"
    }
}


# Bot Helper Functions
def get_user_lang(chat_id):
    chat_id_str = str(chat_id)
    if chat_id_str in users_data and 'lang' in users_data[chat_id_str]:
        return users_data[chat_id_str]['lang']
    return 'uz' # Default

def save_user_lang(chat_id, lang):
    chat_id_str = str(chat_id)
    if chat_id_str not in users_data:
        users_data[chat_id_str] = {}
    users_data[chat_id_str]['lang'] = lang
    save_db(users_data, USERS_DB)

def send_main_menu(chat_id):
    lang = get_user_lang(chat_id)
    strings = LOCALIZATION[lang]
    
    # Create Reply Keyboard with WebApp button
    markup = ReplyKeyboardMarkup(resize_keyboard=True)
    
    # Configure WebApp URL
    web_app_url = f"{WEB_APP_URL}?chat_id={chat_id}&lang={lang}"
    web_app = WebAppInfo(web_app_url)
    
    btn_webapp = KeyboardButton(text=strings['open_mini_app'], web_app=web_app)
    btn_lang = KeyboardButton(text=strings['change_language'])
    
    markup.add(btn_webapp)
    markup.add(btn_lang)
    
    bot.send_message(chat_id, strings['main_menu_text'], reply_markup=markup, parse_mode='HTML')

# BOT HANDLERS
@bot.message_handler(commands=['start'])
def command_start(message):
    chat_id = message.chat.id
    
    # Check if user already exists
    chat_id_str = str(chat_id)
    if chat_id_str not in users_data:
        users_data[chat_id_str] = {
            'username': message.from_user.username,
            'first_name': message.from_user.first_name,
            'lang': 'uz'
        }
        save_db(users_data, USERS_DB)

    # Let user select language
    markup = InlineKeyboardMarkup()
    btn_uz = InlineKeyboardButton("🇺🇿 O'zbekcha", callback_data="lang_uz")
    btn_ru = InlineKeyboardButton("🇷🇺 Русский", callback_data="lang_ru")
    markup.add(btn_uz, btn_ru)
    
    bot.send_message(chat_id, "<b>Xush kelibsiz! Tilni tanlang / Добро пожаловать! Выберите язык:</b>", reply_markup=markup, parse_mode='HTML')

@bot.callback_query_handler(func=lambda call: call.data.startswith('lang_'))
def handle_lang_callback(call):
    chat_id = call.message.chat.id
    lang = call.data.split('_')[1]
    
    save_user_lang(chat_id, lang)
    
    strings = LOCALIZATION[lang]
    bot.answer_callback_query(call.id, text=strings['language_selected'])
    bot.delete_message(chat_id, call.message.message_id)
    
    send_main_menu(chat_id)

@bot.message_handler(func=lambda message: message.text in ["Tilni o'zgartirish 🌐", "Сменить язык 🌐", "Tilni o'zgartirish", "Сменить язык"])
def handle_change_lang(message):
    chat_id = message.chat.id
    markup = InlineKeyboardMarkup()
    btn_uz = InlineKeyboardButton("🇺🇿 O'zbekcha", callback_data="lang_uz")
    btn_ru = InlineKeyboardButton("🇷🇺 Русский", callback_data="lang_ru")
    markup.add(btn_uz, btn_ru)
    bot.send_message(chat_id, "Tilni tanlang / Выберите язык:", reply_markup=markup)

@bot.message_handler(content_types=['web_app_data'])
def handle_web_app_data(message):
    # This handler processes data sent from WebApp if using sendData
    chat_id = message.chat.id
    try:
        data = json.loads(message.web_app_data.data)
        process_order(chat_id, data)
    except Exception as e:
        bot.send_message(chat_id, f"Error processing order: {str(e)}")

# Order processing logic shared between webhook/API
def process_order(chat_id, order_data):
    lang = get_user_lang(chat_id)
    strings = LOCALIZATION[lang]
    
    # Save order to database
    order_id = str(len(orders_data) + 1).zfill(6)
    orders_data[order_id] = {
        'chat_id': chat_id,
        'order_data': order_data
    }
    save_db(orders_data, ORDERS_DB)
    
    # Compile order receipt items
    items_str = ""
    for item in order_data.get('items', []):
        name = item.get('name_uz') if lang == 'uz' else item.get('name_ru')
        items_str += f"• {name} - {item.get('quantity')}x ({item.get('price'):,} UZS) = {item.get('price') * item.get('quantity'):,} UZS\n"
        
    delivery_type_str = "Yetkazib berish (Доставка)" if order_data.get('delivery_type') == 'delivery' else "Olib ketish (Самовывоз)"
    
    # Generate Google Maps link if coordinates exist
    lat = order_data.get('lat')
    lng = order_data.get('lng')
    if lat and lng:
        map_link = f'<a href="https://www.google.com/maps?q={lat},{lng}">Joylashuvni ko\'rish (Google Maps) 🗺️</a>' if lang == 'uz' else f'<a href="https://www.google.com/maps?q={lat},{lng}">Посмотреть локацию (Google Maps) 🗺️</a>'
    else:
        map_link = "Mavjud emas" if lang == 'uz' else "Не указана"

    # Populate receipt template
    receipt = strings['order_details'].format(
        name=order_data.get('user_name', 'Mijoz'),
        phone=order_data.get('user_phone', 'Kiritilmagan'),
        delivery_type=delivery_type_str,
        address=order_data.get('address', 'Kiritilmagan'),
        map_link=map_link,
        entrance=order_data.get('entrance', '-'),
        floor=order_data.get('floor', '-'),
        apartment=order_data.get('apartment', '-'),
        comment=order_data.get('comment', '-'),
        items_str=items_str,
        total_price=order_data.get('total_price', 0)
    )
    
    try:
        bot.send_message(chat_id, receipt, parse_mode='HTML')
    except Exception as e:
        print(f"Telegram notification failed (order was saved to database!): {str(e)}")


# FLASK ROUTES
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/products')
def api_products():
    return jsonify(PRODUCTS)

@app.route('/api/branches')
def api_branches():
    return jsonify(BRANCHES)

@app.route('/api/order', methods=['POST'])
def api_order():
    try:
        data = request.json
        chat_id = data.get('chat_id')
        if not chat_id:
            return jsonify({'success': False, 'message': 'Missing chat_id'}), 400
        
        process_order(chat_id, data)
        return jsonify({'success': True, 'message': 'Order processed successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/user-data/<chat_id>', methods=['GET', 'POST'])
def api_user_data(chat_id):
    chat_id_str = str(chat_id)
    if request.method == 'POST':
        data = request.json
        if chat_id_str not in users_data:
            users_data[chat_id_str] = {}
        
        # Save user info (phone, address, coordinates, etc.)
        for key in ['phone', 'address', 'lat', 'lng', 'entrance', 'floor', 'apartment']:
            if key in data:
                users_data[chat_id_str][key] = data[key]
                
        save_db(users_data, USERS_DB)
        return jsonify({'success': True})
    
    # GET method
    user_info = users_data.get(chat_id_str, {})
    return jsonify(user_info)

# Telegram Webhook endpoint (for PythonAnywhere / Production)
@app.route('/webhook/' + BOT_TOKEN, methods=['POST'])
def webhook():
    if request.headers.get('content-type') == 'application/json':
        json_string = request.get_data().decode('utf-8')
        update = telebot.types.Update.de_json(json_string)
        bot.process_new_updates([update])
        return '', 200
    else:
        return 'Forbidden', 403

# WSGI Application entrypoint for PythonAnywhere
# PythonAnywhere looks for a variable named 'application' or 'app' in the WSGI file
# we will expose 'app' as the WSGI hook

if __name__ == '__main__':
    # Local Development Setup: Start bot polling in a separate background thread
    if BOT_TOKEN and "AAF_YourRealBotTokenHere" not in BOT_TOKEN:
        print("Starting Bot in Polling Mode (Local Thread)...")
        try:
            bot.remove_webhook()
            polling_thread = threading.Thread(target=bot.infinity_polling, daemon=True)
            polling_thread.start()
        except Exception as e:
            print(f"Error starting polling thread: {e}")
    else:
        print("WARNING: TELEGRAM_BOT_TOKEN is not configured or placeholder remains. Bot polling skipped.")
        
    print("Starting Flask web server...")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
