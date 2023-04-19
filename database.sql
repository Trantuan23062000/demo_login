CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
CREATE DATABASE demo;

CREATE TABLE users(
  user_id SERIAL NOT null PRIMARY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  

);

CREATE TABLE todo(
  todo_id SERIAL,
  user_id UUID ,
  description VARCHAR(255),
  PRIMARY KEY (todo_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


INSERT INTO users (user_name, user_email, user_password) VALUES ('tuan', 'tuan@gmail.com', '123');