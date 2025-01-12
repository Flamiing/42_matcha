CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE gender_enum AS ENUM('male', 'female');
CREATE TYPE gender_preference_enum AS ENUM('male', 'female', 'bisexual');

CREATE TABLE users (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	username VARCHAR(50) UNIQUE NOT NULL,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	password VARCHAR(255) DEFAULT NULL,
	age INTEGER CHECK (age >= 0),
	biography VARCHAR(500),
	profile_picture VARCHAR(255) DEFAULT NULL,
	location VARCHAR(100),
	fame INTEGER DEFAULT 0,
	last_online TIMESTAMP,
	is_online BOOLEAN DEFAULT FALSE,
	active_account BOOLEAN DEFAULT FALSE,
	oauth BOOLEAN DEFAULT FALSE,
    refresh_token VARCHAR(2048) DEFAULT NULL,
    reset_pass_token VARCHAR(2048) DEFAULT NULL,
	gender gender_enum,
	sexual_preference gender_preference_enum
);

CREATE TABLE images (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	image VARCHAR(255) NOT NULL
);

CREATE TABLE tags (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	value VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_tags (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
	UNIQUE(user_id, tag_id)
);

CREATE TABLE likes (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	liked_by UUID REFERENCES users(id) ON DELETE CASCADE,
	liked_to UUID REFERENCES users(id) ON DELETE CASCADE,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(liked_by, liked_to)
);

CREATE TABLE visit_history (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	viewer UUID REFERENCES users(id) ON DELETE CASCADE,
	viewed UUID REFERENCES users(id) ON DELETE CASCADE,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocked_users (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	blocked_user UUID REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(user_id, blocked_user)
);

CREATE TABLE reports (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	reporter UUID REFERENCES users(id) ON DELETE CASCADE,
	reported UUID REFERENCES users(id) ON DELETE CASCADE,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(reporter, reported)
);

CREATE TABLE chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user1 UUID REFERENCES users(id) ON DELETE CASCADE,
    user2 UUID REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user1, user2)
);

CREATE TABLE message (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);

ALTER TABLE users
ADD CONSTRAINT fk_profile_picture
FOREIGN KEY (profile_picture) REFERENCES images(id) ON DELETE SET NULL;

INSERT INTO tags (value) VALUES
    ('hiking'), ('traveling'), ('cooking'), ('photography'), ('painting'), ('yoga'), 
    ('reading'), ('writing'), ('gaming'), ('dancing'), ('singing'), ('gardening'), 
    ('cycling'), ('running'), ('fitness'), ('meditation'), ('volunteering'), 
    ('surfing'), ('snowboarding'), ('fishing'), ('camping'), ('board_games'), 
    ('videography'), ('diy'), ('crafts'), ('knitting'), ('crochet'), ('sewing'), 
    ('pottery'), ('calligraphy'), ('puzzles'), ('movies'), ('theater'), ('concerts'), 
    ('podcasts'), ('comedy'), ('astrology'), ('tech'), ('cars'), ('motorcycles'), 
    ('sports'), ('football'), ('basketball'), ('tennis'), ('badminton_1'), ('swimming'), 
    ('scuba_diving'), ('rock_climbing'), ('martial_arts'), ('language_learning'), 
    ('history'), ('science'), ('coding'), ('startups'), ('investing'), ('woodworking'), 
    ('baking'), ('mixology'), ('fashion'), ('makeup'), ('skincare'), ('museum_visits'), 
    ('zoos'), ('bird_watching'), ('anime'), ('manga'), ('cosplay'), ('k_pop'), 
    ('collecting'), ('antiques'), ('stamps'), ('coins'), ('action_figures'), 
    ('vinyl_records'), ('lego_building'), ('model_trains'), ('rc_planes'), 
    ('drums'), ('piano'), ('guitar'), ('violin'), ('ukulele'), ('djing'), 
    ('stand_up_comedy'), ('travel_blogging'), ('wine_tasting'), ('beer_brewing'), 
    ('whiskey_collecting'), ('sailing'), ('archery'), ('fencing'), ('equestrian'), 
    ('magic_tricks'), ('esports'), ('vr_gaming'), ('geocaching'), ('urban_exploration'), 
    ('tattoos'), ('astrophotography'), ('origami'), ('robotics'), ('graphic_design'), 
    ('interior_design'), ('landscaping'), ('scrapbooking'), ('genealogy'), 
    ('philosophy'), ('poetry'), ('storytelling'), ('acting'), ('improv'), 
    ('juggling'), ('parkour'), ('kite_flying'), ('roller_skating'), ('ice_skating'), 
    ('skiing'), ('longboarding'), ('skateboarding'), ('climbing_gyms'), 
    ('spelunking'), ('drone_photography'), ('foraging'), ('soap_making'), 
    ('candle_making'), ('metalworking'), ('leathercraft'), ('jewelry_making'), 
    ('aquascaping'), ('tarot_reading'), ('crystals'), ('feng_shui'), ('minimalism'), 
    ('zero_waste'), ('vegan_cooking'), ('vegetarianism'), ('foodie'), ('street_food'), 
    ('restaurant_hopping'), ('coffee_art'), ('latte_art'), ('tea_tasting'), 
    ('gardening_flowers'), ('succulents'), ('bonsai_trees'), ('wildlife_photography'), 
    ('macro_photography'), ('film_photography'), ('cartooning'), ('comic_books'), 
    ('storyboarding'), ('3d_printing'), ('virtual_reality'), ('tabletop_games'), 
    ('dungeons_and_dragons'), ('romance_books'), ('science_fiction'), ('fantasy_novels'), 
    ('thrillers'), ('self_help_books'), ('autobiographies'), ('memoirs'), 
    ('classics'), ('world_cuisine'), ('desserts'), ('bread_baking'), ('pastry_making'), 
    ('cake_decorating'), ('fermentation'), ('kombucha_brewing'), ('herb_gardening'), 
    ('community_gardening'), ('hiking_with_dogs'), ('trail_running'), 
    ('mountaineering'), ('bird_photography'), ('aviation'), ('skydiving'), 
    ('paragliding'), ('hot_air_balloons'), ('salsa_dancing'), ('ballroom_dancing'), 
    ('ballet'), ('tap_dance'), ('hip_hop_dancing'), ('coding_hackathons'), 
    ('game_modding'), ('data_visualization'), ('ai_experiments'), ('machine_learning'), 
    ('blockchain'), ('cryptocurrency'), ('urban_gardening'), ('dogs'), ('cats'), 
    ('horses'), ('rabbits'), ('hamsters'), ('reptiles'), ('exotic_birds'), 
    ('fishkeeping'), ('aquariums'), ('horseback_riding'), ('dog_training'), 
    ('dog_walking'), ('cat_care'), ('ferret_care'), ('pet_grooming'), ('bird_care'), 
    ('snorkeling'), ('diving'), ('parasailing'), ('kayaking'), ('canoeing'), 
    ('rowing'), ('rafting'), ('paddleboarding'), ('zumba'), ('pilates'), ('spinning'), 
    ('bodybuilding'), ('weightlifting'), ('powerlifting'), ('boxing'), ('kickboxing'), 
    ('muay_thai'), ('judo'), ('karate'), ('taekwondo'), ('brazilian_jiu_jitsu'), 
    ('wrestling'), ('gymnastics'), ('acrobatics'), ('cheerleading'), ('bowling'), 
    ('table_tennis'), ('ice_hockey'), ('field_hockey'), ('cricket'), ('rugby'), 
    ('baseball'), ('softball'), ('volleyball'), ('golf'), ('mini_golf'), ('frisbee'), 
    ('ultimate_frisbee'), ('disc_golf'), ('lacrosse'), ('dodgeball'), ('pickleball_1'), 
    ('handball'), ('bocce'), ('petanque'), ('cornhole'), ('board_sports'), 
    ('windsurfing'), ('kitesurfing'), ('water_skiing'), ('wakeboarding'), 
    ('jet_skiing'), ('scooters'), ('electric_bikes'), ('motorbiking'), 
    ('car_collecting'), ('off_roading'), ('racing'), ('karting'), ('campfires'), 
    ('stargazing'), ('meteor_shower_hunting'), ('planetariums'), ('space_exploration'), 
    ('dinosaurs'), ('archaeology'), ('paleontology'), ('science_museums'), 
    ('engineering'), ('math_puzzles'), ('sudoku'), ('crosswords'), ('trivia'), 
    ('quizzes'), ('escape_rooms'), ('treasure_hunts'), ('role_playing'), 
    ('larp'), ('puppetry'), ('k_pop_dancing'), ('fitness_challenges'), 
    ('medieval_history'), ('renaissance_faires'), ('vintage_clothing'), 
    ('thrifting'), ('garage_sales'), ('flipping'), ('homesteading'), ('beekeeping'), 
    ('backpacking'), ('eco_tourism'), ('sustainable_living');
