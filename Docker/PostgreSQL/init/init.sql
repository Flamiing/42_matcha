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
	biography TEXT,
	profile_picture UUID,
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