CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
		url text NOT NULL,
		title text NOT NULL,
		likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Bruce Wayne', 'https://batman.fandom.com/wiki/Batman', 'Batman', 199);
insert into blogs (author, url, title, likes) values ('Bruce Wayne', 'https://batman.fandom.com/wiki/The_Joker', 'The Joker', 203);